"use strict";
var ionic_environment_plugin_1 = require('./ionic-environment-plugin');
var source_mapper_1 = require('./source-mapper');
var helpers_1 = require('../util/helpers');
function getIonicEnvironmentPlugin() {
    var context = helpers_1.getContext();
    return new ionic_environment_plugin_1.IonicEnvironmentPlugin(context.fileCache);
}
exports.getIonicEnvironmentPlugin = getIonicEnvironmentPlugin;
function getSourceMapperFunction() {
    return source_mapper_1.provideCorrectSourcePath;
}
exports.getSourceMapperFunction = getSourceMapperFunction;
