"use strict";
var path_1 = require('path');
var errors_1 = require('./errors');
var fs_extra_1 = require('fs-extra');
var osName = require('os-name');
var _context;
var cachedAppScriptsPackageJson;
function getAppScriptsPackageJson() {
    if (!cachedAppScriptsPackageJson) {
        try {
            cachedAppScriptsPackageJson = fs_extra_1.readJsonSync(path_1.join(__dirname, '..', '..', 'package.json'));
        }
        catch (e) { }
    }
    return cachedAppScriptsPackageJson;
}
exports.getAppScriptsPackageJson = getAppScriptsPackageJson;
function getAppScriptsVersion() {
    var appScriptsPackageJson = getAppScriptsPackageJson();
    return (appScriptsPackageJson && appScriptsPackageJson.version) ? appScriptsPackageJson.version : '';
}
exports.getAppScriptsVersion = getAppScriptsVersion;
function getUserPackageJson(userRootDir) {
    try {
        return fs_extra_1.readJsonSync(path_1.join(userRootDir, 'package.json'));
    }
    catch (e) { }
    return null;
}
function getSystemInfo(userRootDir) {
    var d = [];
    var ionicAppScripts = getAppScriptsVersion();
    var ionicFramework = null;
    var ionicNative = null;
    var angularCore = null;
    var angularCompilerCli = null;
    try {
        var userPackageJson = getUserPackageJson(userRootDir);
        if (userPackageJson) {
            var userDependencies = userPackageJson.dependencies;
            if (userDependencies) {
                ionicFramework = userDependencies['ionic-angular'];
                ionicNative = userDependencies['ionic-native'];
                angularCore = userDependencies['@angular/core'];
                angularCompilerCli = userDependencies['@angular/compiler-cli'];
            }
        }
    }
    catch (e) { }
    d.push("Ionic Framework: " + ionicFramework);
    if (ionicNative) {
        d.push("Ionic Native: " + ionicNative);
    }
    d.push("Ionic App Scripts: " + ionicAppScripts);
    d.push("Angular Core: " + angularCore);
    d.push("Angular Compiler CLI: " + angularCompilerCli);
    d.push("Node: " + process.version.replace('v', ''));
    d.push("OS Platform: " + osName());
    return d;
}
exports.getSystemInfo = getSystemInfo;
function splitLineBreaks(sourceText) {
    if (!sourceText)
        return [];
    sourceText = sourceText.replace(/\\r/g, '\n');
    return sourceText.split('\n');
}
exports.splitLineBreaks = splitLineBreaks;
exports.objectAssign = (Object.assign) ? Object.assign : function (target, source) {
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
};
function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.titleCase = titleCase;
function writeFileAsync(filePath, content) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.writeFile(filePath, content, function (err) {
            if (err) {
                return reject(new errors_1.BuildError(err));
            }
            return resolve();
        });
    });
}
exports.writeFileAsync = writeFileAsync;
function readFileAsync(filePath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.readFile(filePath, 'utf-8', function (err, buffer) {
            if (err) {
                return reject(new errors_1.BuildError(err));
            }
            return resolve(buffer);
        });
    });
}
exports.readFileAsync = readFileAsync;
function unlinkAsync(filePath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.unlink(filePath, function (err) {
            if (err) {
                return reject(new errors_1.BuildError(err));
            }
            return resolve();
        });
    });
}
exports.unlinkAsync = unlinkAsync;
function rimRafAsync(directoryPath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.remove(directoryPath, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
exports.rimRafAsync = rimRafAsync;
function copyFileAsync(srcPath, destPath) {
    return new Promise(function (resolve, reject) {
        var writeStream = fs_extra_1.createWriteStream(destPath);
        writeStream.on('error', function (err) {
            reject(err);
        });
        writeStream.on('close', function () {
            resolve();
        });
        fs_extra_1.createReadStream(srcPath).pipe(writeStream);
    });
}
exports.copyFileAsync = copyFileAsync;
function createFileObject(filePath) {
    var content = fs_extra_1.readFileSync(filePath).toString();
    return {
        content: content,
        path: filePath,
        timestamp: Date.now()
    };
}
exports.createFileObject = createFileObject;
function setContext(context) {
    _context = context;
}
exports.setContext = setContext;
function getContext() {
    return _context;
}
exports.getContext = getContext;
function transformSrcPathToTmpPath(originalPath, context) {
    return originalPath.replace(context.srcDir, context.tmpDir);
}
exports.transformSrcPathToTmpPath = transformSrcPathToTmpPath;
function transformTmpPathToSrcPath(originalPath, context) {
    return originalPath.replace(context.tmpDir, context.srcDir);
}
exports.transformTmpPathToSrcPath = transformTmpPathToSrcPath;
function changeExtension(filePath, newExtension) {
    var dir = path_1.dirname(filePath);
    var extension = path_1.extname(filePath);
    var extensionlessfileName = path_1.basename(filePath, extension);
    var newFileName = extensionlessfileName + newExtension;
    return path_1.join(dir, newFileName);
}
exports.changeExtension = changeExtension;
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
exports.escapeHtml = escapeHtml;
function rangeReplace(source, startIndex, endIndex, newContent) {
    return source.substring(0, startIndex) + newContent + source.substring(endIndex);
}
exports.rangeReplace = rangeReplace;
function stringSplice(source, startIndex, numToDelete, newContent) {
    return source.slice(0, startIndex) + newContent + source.slice(startIndex + Math.abs(numToDelete));
}
exports.stringSplice = stringSplice;
function toUnixPath(filePath) {
    return filePath.replace(/\\/g, '/');
}
exports.toUnixPath = toUnixPath;
