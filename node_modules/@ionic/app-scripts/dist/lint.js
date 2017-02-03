"use strict";
var fs_1 = require('fs');
var errors_1 = require('./util/errors');
var tslint_1 = require('tslint');
var config_1 = require('./util/config');
var path_1 = require('path');
var logger_1 = require('./logger/logger');
var logger_diagnostics_1 = require('./logger/logger-diagnostics');
var logger_tslint_1 = require('./logger/logger-tslint');
var worker_client_1 = require('./worker-client');
var Linter = require('tslint');
var fs = require('fs');
function lint(context, configFile) {
    return worker_client_1.runWorker('lint', 'lintWorker', context, configFile)
        .catch(function (err) {
        throw new errors_1.BuildError(err);
    });
}
exports.lint = lint;
function lintWorker(context, configFile) {
    return getLintConfig(context, configFile).then(function (configFile) {
        // there's a valid tslint config, let's continue
        return lintApp(context, configFile);
    }).catch(function () { });
}
exports.lintWorker = lintWorker;
function lintUpdate(changedFiles, context) {
    var changedTypescriptFiles = changedFiles.filter(function (changedFile) { return changedFile.ext === '.ts'; });
    return new Promise(function (resolve) {
        // throw this in a promise for async fun, but don't let it hang anything up
        var workerConfig = {
            configFile: config_1.getUserConfigFile(context, taskInfo, null),
            filePaths: changedTypescriptFiles.map(function (changedTypescriptFile) { return changedTypescriptFile.filePath; })
        };
        worker_client_1.runWorker('lint', 'lintUpdateWorker', context, workerConfig);
        resolve();
    });
}
exports.lintUpdate = lintUpdate;
function lintUpdateWorker(context, workerConfig) {
    return getLintConfig(context, workerConfig.configFile).then(function (configFile) {
        // there's a valid tslint config, let's continue (but be quiet about it!)
        var program = tslint_1.createProgram(configFile, context.srcDir);
        return lintFiles(context, program, workerConfig.filePaths);
    }).catch(function () {
    });
}
exports.lintUpdateWorker = lintUpdateWorker;
function lintApp(context, configFile) {
    var program = tslint_1.createProgram(configFile, context.srcDir);
    var files = tslint_1.getFileNames(program);
    var promises = files.map(function (file) {
        return lintFile(context, program, file);
    });
    return Promise.all(promises);
}
function lintFiles(context, program, filePaths) {
    var promises = [];
    for (var _i = 0, filePaths_1 = filePaths; _i < filePaths_1.length; _i++) {
        var filePath = filePaths_1[_i];
        promises.push(lintFile(context, program, filePath));
    }
    return Promise.all(promises);
}
function lintFile(context, program, filePath) {
    return new Promise(function (resolve) {
        if (isMpegFile(filePath)) {
            // silly .ts files actually being video files
            resolve();
            return;
        }
        fs.readFile(filePath, 'utf8', function (err, contents) {
            if (err) {
                // don't care if there was an error
                // let's just move on with our lives
                resolve();
                return;
            }
            try {
                var configuration = tslint_1.findConfiguration(null, filePath);
                var linter = new Linter(filePath, contents, {
                    configuration: configuration,
                    formatter: null,
                    formattersDirectory: null,
                    rulesDirectory: null,
                }, program);
                var lintResult = linter.lint();
                if (lintResult && lintResult.failures) {
                    var diagnostics = logger_tslint_1.runTsLintDiagnostics(context, lintResult.failures);
                    logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TsLint, diagnostics, true, false);
                }
            }
            catch (e) {
                logger_1.Logger.debug("Linter " + e);
            }
            resolve();
        });
    });
}
function getLintConfig(context, configFile) {
    return new Promise(function (resolve, reject) {
        configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
        if (!configFile) {
            configFile = path_1.join(context.rootDir, 'tslint.json');
        }
        logger_1.Logger.debug("tslint config: " + configFile);
        fs_1.access(configFile, function (err) {
            if (err) {
                // if the tslint.json file cannot be found that's fine, the
                // dev may not want to run tslint at all and to do that they
                // just don't have the file
                reject();
                return;
            }
            resolve(configFile);
        });
    });
}
function isMpegFile(file) {
    var buffer = new Buffer(256);
    buffer.fill(0);
    var fd = fs.openSync(file, 'r');
    try {
        fs.readSync(fd, buffer, 0, 256, null);
        if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
            logger_1.Logger.debug("tslint: " + file + ": ignoring MPEG transport stream");
            return true;
        }
    }
    finally {
        fs.closeSync(fd);
    }
    return false;
}
var taskInfo = {
    fullArg: '--tslint',
    shortArg: '-i',
    envVar: 'ionic_tslint',
    packageConfig: 'IONIC_TSLINT',
    defaultConfigFile: '../tslint'
};
