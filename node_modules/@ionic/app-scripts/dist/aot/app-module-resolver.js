"use strict";
var fs_1 = require('fs');
var path_1 = require('path');
var typescript_1 = require('typescript');
var typescript_utils_1 = require('../util/typescript-utils');
function _recursiveSymbolExportLookup(sourceFile, symbolName, fileCache, host, program) {
    var hasSymbol = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ClassDeclaration, false)
        .some(function (cd) {
        return cd.name && cd.name.text === symbolName;
    });
    if (hasSymbol) {
        return sourceFile.fileName;
    }
    // We found the bootstrap variable, now we just need to get where it's imported.
    var exports = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ExportDeclaration, false)
        .map(function (node) { return node; });
    for (var _i = 0, exports_1 = exports; _i < exports_1.length; _i++) {
        var decl = exports_1[_i];
        if (!decl.moduleSpecifier || decl.moduleSpecifier.kind !== typescript_1.SyntaxKind.StringLiteral) {
            continue;
        }
        var modulePath = decl.moduleSpecifier.text;
        var resolvedModule = typescript_1.resolveModuleName(modulePath, sourceFile.fileName, program.getCompilerOptions(), host);
        if (!resolvedModule.resolvedModule || !resolvedModule.resolvedModule.resolvedFileName) {
            return null;
        }
        var module_1 = path_1.normalize(path_1.resolve(resolvedModule.resolvedModule.resolvedFileName));
        if (!decl.exportClause) {
            var file = fileCache.get(module_1);
            if (file) {
                var moduleSourceFile = typescript_utils_1.getTypescriptSourceFile(module_1, file.content, typescript_1.ScriptTarget.Latest, false);
                var maybeModule = _recursiveSymbolExportLookup(moduleSourceFile, symbolName, fileCache, host, program);
                if (maybeModule) {
                    return maybeModule;
                }
            }
        }
        var binding = decl.exportClause;
        for (var _a = 0, _b = binding.elements; _a < _b.length; _a++) {
            var specifier = _b[_a];
            if (specifier.name.text === symbolName) {
                // If it's a directory, load its index and recursively lookup.
                if (fs_1.statSync(module_1).isDirectory()) {
                    var indexModule = path_1.normalize(path_1.join(module_1, 'index.ts'));
                    if (fs_1.existsSync(indexModule)) {
                        var file_1 = fileCache.get(indexModule);
                        if (file_1) {
                            var moduleSourceFile_1 = typescript_utils_1.getTypescriptSourceFile(indexModule, file_1.content, typescript_1.ScriptTarget.Latest, false);
                            var maybeModule = _recursiveSymbolExportLookup(moduleSourceFile_1, symbolName, fileCache, host, program);
                            if (maybeModule) {
                                return maybeModule;
                            }
                        }
                    }
                }
                // Create the source and verify that the symbol is at least a class.
                var file = fileCache.get(module_1);
                var moduleSourceFile = typescript_utils_1.getTypescriptSourceFile(module_1, file.content, typescript_1.ScriptTarget.Latest, false);
                var hasSymbol_1 = typescript_utils_1.findNodes(moduleSourceFile, moduleSourceFile, typescript_1.SyntaxKind.ClassDeclaration)
                    .some(function (cd) {
                    return cd.name && cd.name.text === symbolName;
                });
                if (hasSymbol_1) {
                    return module_1;
                }
            }
        }
    }
    return null;
}
function _symbolImportLookup(sourceFile, symbolName, fileCache, host, program) {
    // We found the bootstrap variable, now we just need to get where it's imported.
    var imports = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ImportDeclaration)
        .map(function (node) { return node; });
    for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
        var decl = imports_1[_i];
        if (!decl.importClause || !decl.moduleSpecifier) {
            continue;
        }
        if (decl.moduleSpecifier.kind !== typescript_1.SyntaxKind.StringLiteral) {
            continue;
        }
        var resolvedModule = typescript_1.resolveModuleName(decl.moduleSpecifier.text, sourceFile.fileName, program.getCompilerOptions(), host);
        if (!resolvedModule.resolvedModule || !resolvedModule.resolvedModule.resolvedFileName) {
            return null;
        }
        var module_2 = path_1.normalize(path_1.resolve(resolvedModule.resolvedModule.resolvedFileName));
        if (decl.importClause.namedBindings.kind === typescript_1.SyntaxKind.NamespaceImport) {
            var binding = decl.importClause.namedBindings;
            if (binding.name.text === symbolName) {
                // This is a default export.
                return module_2;
            }
        }
        else if (decl.importClause.namedBindings.kind === typescript_1.SyntaxKind.NamedImports) {
            var binding = decl.importClause.namedBindings;
            for (var _a = 0, _b = binding.elements; _a < _b.length; _a++) {
                var specifier = _b[_a];
                if (specifier.name.text === symbolName) {
                    // Create the source and recursively lookup the import.
                    var file = fileCache.get(module_2);
                    if (file) {
                        var moduleSourceFile = typescript_utils_1.getTypescriptSourceFile(module_2, file.content, typescript_1.ScriptTarget.Latest, false);
                        var maybeModule = _recursiveSymbolExportLookup(moduleSourceFile, symbolName, fileCache, host, program);
                        if (maybeModule) {
                            return maybeModule;
                        }
                    }
                }
            }
        }
    }
    return null;
}
function resolveAppNgModuleFromMain(mainSourceFile, fileCache, host, program) {
    var bootstrap = typescript_utils_1.findNodes(mainSourceFile, mainSourceFile, typescript_1.SyntaxKind.CallExpression, false)
        .map(function (node) { return node; })
        .filter(function (call) {
        var access = call.expression;
        return access.kind === typescript_1.SyntaxKind.PropertyAccessExpression
            && access.name.kind === typescript_1.SyntaxKind.Identifier
            && (access.name.text === 'bootstrapModule'
                || access.name.text === 'bootstrapModuleFactory');
    }).map(function (node) { return node.arguments[0]; })
        .filter(function (node) { return node.kind === typescript_1.SyntaxKind.Identifier; });
    if (bootstrap.length !== 1) {
        throw new Error("Failed to find Angular bootstrapping code in " + mainSourceFile.fileName + ".\n                    Please update " + mainSourceFile.fileName + " to match the following:\n                    https://github.com/driftyco/ionic2-app-base/blob/master/src/app/main.ts");
    }
    var bootstrapSymbolName = bootstrap[0].text;
    var module = _symbolImportLookup(mainSourceFile, bootstrapSymbolName, fileCache, host, program);
    if (module) {
        return module + "#" + bootstrapSymbolName;
    }
    // shrug... something bad happened and we couldn't find the import statement.
    throw new Error("Failed to find Angular bootstrapping code in " + mainSourceFile.fileName + ".\n                    Please update " + mainSourceFile.fileName + " to match the following:\n                    https://github.com/driftyco/ionic2-app-base/blob/master/src/app/main.ts");
}
exports.resolveAppNgModuleFromMain = resolveAppNgModuleFromMain;
