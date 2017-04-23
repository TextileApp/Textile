"use strict";
var errors_1 = require('./util/errors');
var config_1 = require('./util/config');
var path_1 = require('path');
var logger_1 = require('./logger/logger');
var worker_client_1 = require('./worker-client');
var helpers_1 = require('./util/helpers');
var uglify = require('uglify-js');
function uglifyjs(context, configFile) {
    configFile = config_1.getUserConfigFile(context, exports.taskInfo, configFile);
    var logger = new logger_1.Logger('uglifyjs');
    return worker_client_1.runWorker('uglifyjs', 'uglifyjsWorker', context, configFile)
        .then(function () {
        logger.finish();
    })
        .catch(function (err) {
        throw logger.fail(err);
    });
}
exports.uglifyjs = uglifyjs;
function uglifyjsWorker(context, configFile) {
    return new Promise(function (resolve, reject) {
        try {
            // provide a full path for the config options
            context = config_1.generateContext(context);
            var uglifyJsConfig = config_1.fillConfigDefaults(configFile, exports.taskInfo.defaultConfigFile);
            uglifyJsConfig.sourceFile = path_1.join(context.buildDir, uglifyJsConfig.sourceFile);
            uglifyJsConfig.inSourceMap = path_1.join(context.buildDir, uglifyJsConfig.inSourceMap);
            uglifyJsConfig.destFileName = path_1.join(context.buildDir, uglifyJsConfig.destFileName);
            var minifiedOutputPath = path_1.join(context.buildDir, uglifyJsConfig.outSourceMap);
            var minifyOutput = runUglifyInternal(uglifyJsConfig);
            var writeFilePromises = [
                helpers_1.writeFileAsync(uglifyJsConfig.destFileName, minifyOutput.code),
                helpers_1.writeFileAsync(minifiedOutputPath, minifyOutput.map)
            ];
            return Promise.all(writeFilePromises).then(function () {
                resolve();
            });
        }
        catch (e) {
            reject(new errors_1.BuildError(e));
        }
    });
}
exports.uglifyjsWorker = uglifyjsWorker;
function runUglifyInternal(uglifyJsConfig) {
    return uglify.minify(uglifyJsConfig.sourceFile, {
        compress: uglifyJsConfig.compress,
        mangle: uglifyJsConfig.mangle,
        outSourceMap: uglifyJsConfig.outSourceMap
    });
}
exports.taskInfo = {
    fullArg: '--uglifyjs',
    shortArg: '-u',
    envVar: 'IONIC_UGLIFYJS',
    packageConfig: 'ionic_uglifyjs',
    defaultConfigFile: 'uglifyjs.config'
};
