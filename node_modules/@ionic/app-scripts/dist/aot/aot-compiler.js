"use strict";
var fs_1 = require('fs');
var path_1 = require('path');
require('reflect-metadata');
var typescript_1 = require('typescript');
var compiler_cli_1 = require('@angular/compiler-cli');
var tsc_1 = require('@angular/tsc-wrapped/src/tsc');
var hybrid_file_system_factory_1 = require('../util/hybrid-file-system-factory');
var compiler_host_factory_1 = require('./compiler-host-factory');
var app_module_resolver_1 = require('./app-module-resolver');
var reflector_host_1 = require('./reflector-host');
var typescript_utils_1 = require('../util/typescript-utils');
var utils_1 = require('./utils');
var logger_1 = require('../logger/logger');
var logger_diagnostics_1 = require('../logger/logger-diagnostics');
var logger_typescript_1 = require('../logger/logger-typescript');
var errors_1 = require('../util/errors');
var helpers_1 = require('../util/helpers');
var AotCompiler = (function () {
    function AotCompiler(context, options) {
        this.context = context;
        this.options = options;
        this.tsConfig = getNgcConfig(this.context, this.options.tsConfigPath);
        this.angularCompilerOptions = Object.assign({}, this.tsConfig.ngOptions, {
            basePath: this.options.rootDir,
            entryPoint: this.options.entryPoint
        });
        this.fileSystem = hybrid_file_system_factory_1.getInstance();
        this.compilerHost = compiler_host_factory_1.getInstance(this.tsConfig.parsed.options);
        this.program = typescript_1.createProgram(this.tsConfig.parsed.fileNames, this.tsConfig.parsed.options, this.compilerHost);
        this.reflectorHost = new compiler_cli_1.ReflectorHost(this.program, this.compilerHost, this.angularCompilerOptions);
        this.reflector = new compiler_cli_1.StaticReflector(this.reflectorHost);
    }
    AotCompiler.prototype.compile = function () {
        var _this = this;
        return Promise.resolve().then(function () {
        }).then(function () {
            logger_diagnostics_1.clearDiagnostics(_this.context, logger_diagnostics_1.DiagnosticsType.TypeScript);
            var i18nOptions = {
                i18nFile: undefined,
                i18nFormat: undefined,
                locale: undefined,
                basePath: _this.options.rootDir
            };
            // Create the Code Generator.
            var codeGenerator = compiler_cli_1.CodeGenerator.create(_this.angularCompilerOptions, i18nOptions, _this.program, _this.compilerHost, new compiler_cli_1.NodeReflectorHostContext(_this.compilerHost));
            // We need to temporarily patch the CodeGenerator until either it's patched or allows us
            // to pass in our own ReflectorHost.
            reflector_host_1.patchReflectorHost(codeGenerator);
            logger_1.Logger.debug('[AotCompiler] compile: starting codegen ... ');
            return codeGenerator.codegen({ transitiveModules: true });
        }).then(function () {
            logger_1.Logger.debug('[AotCompiler] compile: starting codegen ... DONE');
            logger_1.Logger.debug('[AotCompiler] compile: Creating and validating new TypeScript Program ...');
            // Create a new Program, based on the old one. This will trigger a resolution of all
            // transitive modules, which include files that might just have been generated.
            _this.program = typescript_1.createProgram(_this.tsConfig.parsed.fileNames, _this.tsConfig.parsed.options, _this.compilerHost, _this.program);
            var globalDiagnostics = _this.program.getGlobalDiagnostics();
            var tsDiagnostics = _this.program.getSyntacticDiagnostics()
                .concat(_this.program.getSemanticDiagnostics())
                .concat(_this.program.getOptionsDiagnostics());
            if (globalDiagnostics.length) {
                var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(_this.context, globalDiagnostics);
                logger_diagnostics_1.printDiagnostics(_this.context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, false);
                throw new errors_1.BuildError(new Error('Failed to transpile TypeScript'));
            }
            if (tsDiagnostics.length) {
                var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(_this.context, tsDiagnostics);
                logger_diagnostics_1.printDiagnostics(_this.context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, false);
                throw new errors_1.BuildError(new Error('Failed to transpile TypeScript'));
            }
        })
            .then(function () {
            logger_1.Logger.debug('[AotCompiler] compile: Creating and validating new TypeScript Program ... DONE');
            logger_1.Logger.debug('[AotCompiler] compile: The following files are included in the program: ');
            for (var _i = 0, _a = _this.tsConfig.parsed.fileNames; _i < _a.length; _i++) {
                var fileName = _a[_i];
                logger_1.Logger.debug("[AotCompiler] compile: " + fileName);
                var cleanedFileName = path_1.normalize(path_1.resolve(fileName));
                var content = fs_1.readFileSync(cleanedFileName).toString();
                _this.context.fileCache.set(cleanedFileName, { path: cleanedFileName, content: content });
            }
        })
            .then(function () {
            logger_1.Logger.debug('[AotCompiler] compile: Starting to process and modify entry point ...');
            var mainFile = _this.context.fileCache.get(_this.options.entryPoint);
            if (!mainFile) {
                throw new errors_1.BuildError(new Error("Could not find entry point (bootstrap file) " + _this.options.entryPoint));
            }
            var mainSourceFile = typescript_utils_1.getTypescriptSourceFile(mainFile.path, mainFile.content, typescript_1.ScriptTarget.Latest, false);
            logger_1.Logger.debug('[AotCompiler] compile: Resolving NgModule from entry point');
            var AppNgModuleStringAndClassName = app_module_resolver_1.resolveAppNgModuleFromMain(mainSourceFile, _this.context.fileCache, _this.compilerHost, _this.program);
            var AppNgModuleTokens = AppNgModuleStringAndClassName.split('#');
            var modifiedFileContent = null;
            try {
                logger_1.Logger.debug('[AotCompiler] compile: Dynamically changing entry point content to AOT mode content');
                modifiedFileContent = utils_1.replaceBootstrap(mainFile.path, mainFile.content, AppNgModuleTokens[0], AppNgModuleTokens[1]);
            }
            catch (ex) {
                logger_1.Logger.debug("Failed to parse bootstrap: ", ex.message);
                logger_1.Logger.warn("Failed to parse and update " + _this.options.entryPoint + " content for AoT compilation.\n                    For now, the default fallback content will be used instead.\n                    Please consider updating " + _this.options.entryPoint + " with the content from the following link:\n                    https://github.com/driftyco/ionic2-app-base/tree/master/src/app/main.ts");
                modifiedFileContent = utils_1.getFallbackMainContent();
            }
            logger_1.Logger.debug("[AotCompiler] compile: Modified File Content: " + modifiedFileContent);
            _this.context.fileCache.set(_this.options.entryPoint, { path: _this.options.entryPoint, content: modifiedFileContent });
        })
            .then(function () {
            logger_1.Logger.debug('[AotCompiler] compile: Starting to process and modify entry point ... DONE');
            logger_1.Logger.debug('[AotCompiler] compile: Removing decorators from program files ...');
            var tsFiles = _this.context.fileCache.getAll().filter(function (file) { return path_1.extname(file.path) === '.ts' && file.path.indexOf('.d.ts') === -1; });
            for (var _i = 0, tsFiles_1 = tsFiles; _i < tsFiles_1.length; _i++) {
                var tsFile = tsFiles_1[_i];
                // Temporary fix to keep custom decorators until a
                // proper resolution can be found.
                /*const cleanedFileContent = removeDecorators(tsFile.path, tsFile.content);
                tsFile.content = cleanedFileContent;*/
                var cleanedFileContent = tsFile.content;
                var transpileOutput = _this.transpileFileContent(tsFile.path, cleanedFileContent, _this.tsConfig.parsed.options);
                var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(_this.context, transpileOutput.diagnostics);
                if (diagnostics.length) {
                    // darn, we've got some things wrong, transpile failed :(
                    logger_diagnostics_1.printDiagnostics(_this.context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, true);
                    throw new errors_1.BuildError();
                }
                var jsFilePath = helpers_1.changeExtension(tsFile.path, '.js');
                _this.fileSystem.addVirtualFile(jsFilePath, transpileOutput.outputText);
                _this.fileSystem.addVirtualFile(jsFilePath + '.map', transpileOutput.sourceMapText);
            }
            logger_1.Logger.debug('[AotCompiler] compile: Removing decorators from program files ... DONE');
        });
    };
    AotCompiler.prototype.transpileFileContent = function (fileName, sourceText, options) {
        var transpileOptions = {
            compilerOptions: options,
            fileName: fileName,
            reportDiagnostics: true
        };
        return typescript_1.transpileModule(sourceText, transpileOptions);
    };
    return AotCompiler;
}());
exports.AotCompiler = AotCompiler;
function getNgcConfig(context, tsConfigPath) {
    var tsConfigFile = tsc_1.tsc.readConfiguration(tsConfigPath, process.cwd());
    if (!tsConfigFile) {
        throw new errors_1.BuildError("tsconfig: invalid tsconfig file, \"" + tsConfigPath + "\"");
    }
    return tsConfigFile;
}
exports.getNgcConfig = getNgcConfig;
