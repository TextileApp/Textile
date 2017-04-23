"use strict";
var logger_1 = require('../logger/logger');
var hybrid_file_system_factory_1 = require('../util/hybrid-file-system-factory');
var watch_memory_system_1 = require('./watch-memory-system');
var IonicEnvironmentPlugin = (function () {
    function IonicEnvironmentPlugin(fileCache) {
        this.fileCache = fileCache;
    }
    IonicEnvironmentPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('environment', function (otherCompiler, callback) {
            logger_1.Logger.debug('[IonicEnvironmentPlugin] apply: creating environment plugin');
            var hybridFileSystem = hybrid_file_system_factory_1.getInstance();
            hybridFileSystem.setFileSystem(compiler.inputFileSystem);
            compiler.inputFileSystem = hybridFileSystem;
            compiler.watchFileSystem = new watch_memory_system_1.WatchMemorySystem(_this.fileCache);
            // do a bunch of webpack specific stuff here, so cast to an any
            // populate the content of the file system with any virtual files
            // inspired by populateWebpackResolver method in Angular's webpack plugin
            var webpackFileSystem = hybridFileSystem;
            var fileStatsDictionary = hybridFileSystem.getAllFileStats();
            var dirStatsDictionary = hybridFileSystem.getAllDirStats();
            _this.initializeWebpackFileSystemCaches(webpackFileSystem);
            for (var _i = 0, _a = Object.keys(fileStatsDictionary); _i < _a.length; _i++) {
                var filePath = _a[_i];
                var stats = fileStatsDictionary[filePath];
                webpackFileSystem._statStorage.data[filePath] = [null, stats];
                webpackFileSystem._readFileStorage.data[filePath] = [null, stats.content];
            }
            for (var _b = 0, _c = Object.keys(dirStatsDictionary); _b < _c.length; _b++) {
                var dirPath = _c[_b];
                var stats = dirStatsDictionary[dirPath];
                var fileNames = hybridFileSystem.getFileNamesInDirectory(dirPath);
                var dirNames = hybridFileSystem.getSubDirs(dirPath);
                webpackFileSystem._statStorage.data[dirPath] = [null, stats];
                webpackFileSystem._readdirStorage.data[dirPath] = [null, fileNames.concat(dirNames)];
            }
        });
    };
    IonicEnvironmentPlugin.prototype.initializeWebpackFileSystemCaches = function (webpackFileSystem) {
        if (!webpackFileSystem._statStorage) {
            webpackFileSystem._statStorage = {};
        }
        if (!webpackFileSystem._statStorage.data) {
            webpackFileSystem._statStorage.data = [];
        }
        if (!webpackFileSystem._readFileStorage) {
            webpackFileSystem._readFileStorage = {};
        }
        if (!webpackFileSystem._readFileStorage.data) {
            webpackFileSystem._readFileStorage.data = [];
        }
        if (!webpackFileSystem._readdirStorage) {
            webpackFileSystem._readdirStorage = {};
        }
        if (!webpackFileSystem._readdirStorage.data) {
            webpackFileSystem._readdirStorage.data = [];
        }
    };
    return IonicEnvironmentPlugin;
}());
exports.IonicEnvironmentPlugin = IonicEnvironmentPlugin;
