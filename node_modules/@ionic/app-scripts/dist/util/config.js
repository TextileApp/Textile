"use strict";
var fs_extra_1 = require('fs-extra');
var path_1 = require('path');
var helpers_1 = require('./helpers');
var file_cache_1 = require('./file-cache');
var Constants = require('./constants');
/**
 * Create a context object which is used by all the build tasks.
 * Filling the config data uses the following hierarchy, which will
 * keep going down the list until it, or if it, finds data.
 *
 * 1) Get from the passed in context variable
 * 2) Get from the config file set using the command-line args
 * 3) Get from environment variable
 * 4) Get from package.json config property
 * 5) Get environment variables
 *
 * Lastly, Ionic's default configs will always fill in any data
 * which is missing from the user's data.
 */
function generateContext(context) {
    if (!context) {
        context = {};
        context.fileCache = new file_cache_1.FileCache();
    }
    context.isProd = [
        context.isProd,
        hasArg('--prod')
    ].find(function (val) { return typeof val === 'boolean'; });
    setProcessEnvVar(Constants.ENV_VAR_IONIC_ENV, (context.isProd ? Constants.ENV_VAR_PROD : Constants.ENV_VAR_DEV));
    // If context is prod then the following flags must be set to true
    context.runAot = [
        context.runAot,
        context.isProd || hasArg('--aot'),
    ].find(function (val) { return typeof val === 'boolean'; });
    context.runMinifyJs = [
        context.runMinifyJs,
        context.isProd || hasArg('--minifyJs')
    ].find(function (val) { return typeof val === 'boolean'; });
    context.runMinifyCss = [
        context.runMinifyCss,
        context.isProd || hasArg('--minifyCss')
    ].find(function (val) { return typeof val === 'boolean'; });
    context.optimizeJs = [
        context.optimizeJs,
        context.isProd || hasArg('--optimizeJs')
    ].find(function (val) { return typeof val === 'boolean'; });
    if (typeof context.isWatch !== 'boolean') {
        context.isWatch = hasArg('--watch');
    }
    context.rootDir = path_1.resolve(context.rootDir || getConfigValue(context, '--rootDir', null, Constants.ENV_VAR_ROOT_DIR, Constants.ENV_VAR_ROOT_DIR.toLowerCase(), processCwd));
    setProcessEnvVar(Constants.ENV_VAR_ROOT_DIR, context.rootDir);
    context.srcDir = path_1.resolve(context.srcDir || getConfigValue(context, '--srcDir', null, Constants.ENV_VAR_SRC_DIR, Constants.ENV_VAR_SRC_DIR.toLowerCase(), path_1.join(context.rootDir, Constants.SRC_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_SRC_DIR, context.srcDir);
    context.wwwDir = path_1.resolve(context.wwwDir || getConfigValue(context, '--wwwDir', null, Constants.ENV_VAR_WWW_DIR, Constants.ENV_VAR_WWW_DIR.toLowerCase(), path_1.join(context.rootDir, Constants.WWW_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_WWW_DIR, context.wwwDir);
    context.wwwIndex = path_1.join(context.wwwDir, Constants.WWW_INDEX_FILENAME);
    context.buildDir = path_1.resolve(context.buildDir || getConfigValue(context, '--buildDir', null, Constants.ENV_VAR_BUILD_DIR, Constants.ENV_VAR_BUILD_DIR.toLowerCase(), path_1.join(context.wwwDir, Constants.BUILD_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_BUILD_DIR, context.buildDir);
    setProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR, path_1.join(__dirname, '..', '..'));
    var generateSourceMap = getConfigValue(context, '--generateSourceMap', null, Constants.ENV_VAR_GENERATE_SOURCE_MAP, Constants.ENV_VAR_GENERATE_SOURCE_MAP.toLowerCase(), context.isProd || context.runMinifyJs ? null : 'true');
    setProcessEnvVar(Constants.ENV_VAR_GENERATE_SOURCE_MAP, generateSourceMap);
    var sourceMapTypeValue = getConfigValue(context, '--sourceMapType', null, Constants.ENV_VAR_SOURCE_MAP_TYPE, Constants.ENV_VAR_SOURCE_MAP_TYPE.toLowerCase(), Constants.SOURCE_MAP_TYPE_EXPENSIVE);
    setProcessEnvVar(Constants.ENV_VAR_SOURCE_MAP_TYPE, sourceMapTypeValue);
    var tsConfigPathValue = path_1.resolve(getConfigValue(context, '--tsconfig', null, Constants.ENV_TS_CONFIG, Constants.ENV_TS_CONFIG.toLowerCase(), path_1.join(context.rootDir, 'tsconfig.json')));
    setProcessEnvVar(Constants.ENV_TS_CONFIG, tsConfigPathValue);
    var appEntryPointPathValue = path_1.resolve(getConfigValue(context, '--appEntryPoint', null, Constants.ENV_APP_ENTRY_POINT, Constants.ENV_APP_ENTRY_POINT.toLowerCase(), path_1.join(context.srcDir, 'app', 'main.ts')));
    setProcessEnvVar(Constants.ENV_APP_ENTRY_POINT, appEntryPointPathValue);
    setProcessEnvVar(Constants.ENV_GLOB_UTIL, path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'util', 'glob-util.js'));
    var cleanBeforeCopy = getConfigValue(context, '--cleanBeforeCopy', null, Constants.ENV_CLEAN_BEFORE_COPY, Constants.ENV_CLEAN_BEFORE_COPY.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_CLEAN_BEFORE_COPY, cleanBeforeCopy);
    setProcessEnvVar(Constants.ENV_CLOSURE_JAR, path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'bin', 'closure-compiler.jar'));
    var outputJsFileName = getConfigValue(context, '--outputJsFileName', null, Constants.ENV_OUTPUT_JS_FILE_NAME, Constants.ENV_OUTPUT_JS_FILE_NAME.toLowerCase(), 'main.js');
    setProcessEnvVar(Constants.ENV_OUTPUT_JS_FILE_NAME, outputJsFileName);
    var outputJsMapFileName = getConfigValue(context, '--outputJsMapFileName', null, Constants.ENV_OUTPUT_JS_MAP_FILE_NAME, Constants.ENV_OUTPUT_JS_MAP_FILE_NAME.toLowerCase(), 'main.js.map');
    setProcessEnvVar(Constants.ENV_OUTPUT_JS_MAP_FILE_NAME, outputJsMapFileName);
    var outputCssFileName = getConfigValue(context, '--outputCssFileName', null, Constants.ENV_OUTPUT_CSS_FILE_NAME, Constants.ENV_OUTPUT_CSS_FILE_NAME.toLowerCase(), 'main.css');
    setProcessEnvVar(Constants.ENV_OUTPUT_CSS_FILE_NAME, outputCssFileName);
    var outputCssMapFileName = getConfigValue(context, '--outputCssMapFileName', null, Constants.ENV_OUTPUT_CSS_MAP_FILE_NAME, Constants.ENV_OUTPUT_CSS_MAP_FILE_NAME.toLowerCase(), 'main.css.map');
    setProcessEnvVar(Constants.ENV_OUTPUT_CSS_MAP_FILE_NAME, outputCssMapFileName);
    setProcessEnvVar(Constants.ENV_WEBPACK_FACTORY, path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'webpack', 'ionic-webpack-factory.js'));
    setProcessEnvVar(Constants.ENV_WEBPACK_LOADER, path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'webpack', 'loader.js'));
    if (!isValidBundler(context.bundler)) {
        context.bundler = bundlerStrategy(context);
    }
    context.inlineTemplates = true;
    checkDebugMode();
    return context;
}
exports.generateContext = generateContext;
function getUserConfigFile(context, task, userConfigFile) {
    if (!context) {
        context = generateContext(context);
    }
    if (userConfigFile) {
        return path_1.resolve(userConfigFile);
    }
    var defaultConfig = getConfigValue(context, task.fullArg, task.shortArg, task.envVar, task.packageConfig, null);
    if (defaultConfig) {
        return path_1.join(context.rootDir, defaultConfig);
    }
    return null;
}
exports.getUserConfigFile = getUserConfigFile;
function fillConfigDefaults(userConfigFile, defaultConfigFile) {
    var userConfig = null;
    if (userConfigFile) {
        try {
            // check if exists first, so we can print a more specific error message
            // since required config could also throw MODULE_NOT_FOUND
            fs_extra_1.statSync(userConfigFile);
            // create a fresh copy of the config each time
            userConfig = require(userConfigFile);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                console.error("Config file \"" + userConfigFile + "\" not found. Using defaults instead.");
            }
            else {
                console.error("There was an error in config file \"" + userConfigFile + "\". Using defaults instead.");
                console.error(e);
            }
        }
    }
    var defaultConfig = require(path_1.join('..', '..', 'config', defaultConfigFile));
    // create a fresh copy of the config each time
    // always assign any default values which were not already supplied by the user
    return helpers_1.objectAssign({}, defaultConfig, userConfig);
}
exports.fillConfigDefaults = fillConfigDefaults;
function bundlerStrategy(context) {
    // 1) User provided a rollup config via cmd line args
    var val = getArgValue('--rollup', '-r');
    if (val) {
        return Constants.BUNDLER_ROLLUP;
    }
    // 2) User provided both a rollup config and webpack config in package.json config
    val = getPackageJsonConfig(context, 'ionic_rollup');
    var webpackVal = getPackageJsonConfig(context, 'ionic_webpack');
    if (val && webpackVal) {
        var bundler = getPackageJsonConfig(context, 'ionic_bundler');
        if (isValidBundler(bundler)) {
            return bundler;
        }
    }
    // 3) User provided a rollup config env var
    val = getProcessEnvVar('ionic_rollup');
    if (val) {
        return Constants.BUNDLER_ROLLUP;
    }
    // 4) User provided a rollup config in package.json config
    val = getPackageJsonConfig(context, 'ionic_rollup');
    if (val) {
        return Constants.BUNDLER_ROLLUP;
    }
    // 5) User set bundler through full arg
    val = getArgValue('--bundler', null);
    if (isValidBundler(val)) {
        return val;
    }
    // 6) User set bundler through package.json config
    val = getPackageJsonConfig(context, 'ionic_bundler');
    if (isValidBundler(val)) {
        return val;
    }
    // 7) User set to use rollup at the bundler
    val = getProcessEnvVar('ionic_bundler');
    if (isValidBundler(val)) {
        return val;
    }
    // 8) Default to use webpack
    return Constants.BUNDLER_WEBPACK;
}
exports.bundlerStrategy = bundlerStrategy;
function isValidBundler(bundler) {
    return (bundler === Constants.BUNDLER_ROLLUP || bundler === Constants.BUNDLER_WEBPACK);
}
function getConfigValue(context, argFullName, argShortName, envVarName, packageConfigProp, defaultValue) {
    if (!context) {
        context = generateContext(context);
    }
    // first see if the value was set in the command-line args
    var argVal = getArgValue(argFullName, argShortName);
    if (argVal !== null) {
        return argVal;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return envVar;
    }
    var packageConfig = getPackageJsonConfig(context, packageConfigProp);
    if (packageConfig !== null) {
        return packageConfig;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.getConfigValue = getConfigValue;
function getArgValue(fullName, shortName) {
    for (var i = 2; i < processArgv.length; i++) {
        var arg = processArgv[i];
        if (arg === fullName || (shortName && arg === shortName)) {
            var val = processArgv[i + 1];
            if (val !== undefined && val !== '') {
                return val;
            }
        }
    }
    return null;
}
function hasConfigValue(context, argFullName, argShortName, envVarName, defaultValue) {
    if (!context) {
        context = generateContext(context);
    }
    if (hasArg(argFullName, argShortName)) {
        return true;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return true;
    }
    var packageConfig = getPackageJsonConfig(context, envVarName);
    if (packageConfig !== null) {
        return true;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.hasConfigValue = hasConfigValue;
function hasArg(fullName, shortName) {
    if (shortName === void 0) { shortName = null; }
    return !!(processArgv.some(function (a) { return a.toLowerCase() === fullName.toLowerCase(); }) ||
        (shortName !== null && processArgv.some(function (a) { return a.toLowerCase() === shortName.toLowerCase(); })));
}
exports.hasArg = hasArg;
function replacePathVars(context, filePath) {
    if (Array.isArray(filePath)) {
        return filePath.map(function (f) { return replacePathVars(context, f); });
    }
    if (typeof filePath === 'object') {
        var clonedFilePaths = Object.assign({}, filePath);
        for (var key in clonedFilePaths) {
            clonedFilePaths[key] = replacePathVars(context, clonedFilePaths[key]);
        }
        return clonedFilePaths;
    }
    return filePath.replace('{{SRC}}', context.srcDir)
        .replace('{{WWW}}', context.wwwDir)
        .replace('{{TMP}}', context.tmpDir)
        .replace('{{ROOT}}', context.rootDir)
        .replace('{{BUILD}}', context.buildDir);
}
exports.replacePathVars = replacePathVars;
function getNodeBinExecutable(context, cmd) {
    var cmdPath = path_1.join(context.rootDir, 'node_modules', '.bin', cmd);
    try {
        fs_extra_1.accessSync(cmdPath);
    }
    catch (e) {
        cmdPath = null;
    }
    return cmdPath;
}
exports.getNodeBinExecutable = getNodeBinExecutable;
var checkedDebug = false;
function checkDebugMode() {
    if (!checkedDebug) {
        if (hasArg('--debug') || getProcessEnvVar('ionic_debug_mode') === 'true') {
            processEnv.ionic_debug_mode = 'true';
        }
        checkedDebug = true;
    }
}
function isDebugMode() {
    return (processEnv.ionic_debug_mode === 'true');
}
exports.isDebugMode = isDebugMode;
var processArgv;
function setProcessArgs(argv) {
    processArgv = argv;
}
exports.setProcessArgs = setProcessArgs;
setProcessArgs(process.argv);
function addArgv(value) {
    processArgv.push(value);
}
exports.addArgv = addArgv;
var processEnv;
function setProcessEnv(env) {
    processEnv = env;
}
exports.setProcessEnv = setProcessEnv;
setProcessEnv(process.env);
function setProcessEnvVar(key, value) {
    if (key && value) {
        processEnv[key] = value;
    }
}
exports.setProcessEnvVar = setProcessEnvVar;
function getProcessEnvVar(key) {
    var val = processEnv[key];
    if (val !== undefined) {
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }
        return val;
    }
    return null;
}
exports.getProcessEnvVar = getProcessEnvVar;
var processCwd;
function setCwd(cwd) {
    processCwd = cwd;
}
exports.setCwd = setCwd;
setCwd(process.cwd());
function getPackageJsonConfig(context, key) {
    var packageJsonData = getAppPackageJsonData(context);
    if (packageJsonData && packageJsonData.config) {
        var val = packageJsonData.config[key];
        if (val !== undefined) {
            if (val === 'true') {
                return true;
            }
            if (val === 'false') {
                return false;
            }
            return val;
        }
    }
    return null;
}
exports.getPackageJsonConfig = getPackageJsonConfig;
var appPackageJsonData = null;
function setAppPackageJsonData(data) {
    appPackageJsonData = data;
}
exports.setAppPackageJsonData = setAppPackageJsonData;
function getAppPackageJsonData(context) {
    if (!appPackageJsonData) {
        try {
            appPackageJsonData = fs_extra_1.readJSONSync(path_1.join(context.rootDir, 'package.json'));
        }
        catch (e) { }
    }
    return appPackageJsonData;
}
