"use strict";
var config_1 = require('./util/config');
var logger_1 = require('./logger/logger');
var worker_client_1 = require('./worker-client');
function closure(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    var logger = new logger_1.Logger('closure');
    return worker_client_1.runWorker('closure', 'closureWorker', context, configFile)
        .then(function () {
        logger.finish();
    })
        .catch(function (err) {
        throw logger.fail(err);
    });
}
exports.closure = closure;
function closureWorker(context, configFile) {
    return new Promise(function (resolve, reject) {
        context = config_1.generateContext(context);
        logger_1.Logger.warn('Closer Compiler unsupported at this time.');
        resolve();
    });
}
exports.closureWorker = closureWorker;
function isClosureSupported(context) {
    /*const config = getClosureConfig(context, '');
    try {
      execSync(`${config.pathToJavaExecutable} --version`);
      return true;
    } catch (ex) {
      Logger.debug('[Closure] isClosureSupported: Failed to execute java command');
      return false;
    }
    */
    return false;
}
exports.isClosureSupported = isClosureSupported;
function getClosureConfig(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    return config_1.fillConfigDefaults(configFile, taskInfo.defaultConfigFile);
}
var taskInfo = {
    fullArg: '--closure',
    shortArg: '-l',
    envVar: 'IONIC_CLOSURE',
    packageConfig: 'ionic_closure',
    defaultConfigFile: 'closure.config'
};
