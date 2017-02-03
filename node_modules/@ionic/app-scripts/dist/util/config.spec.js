"use strict";
var config = require('./config');
var Constants = require('./constants');
var path_1 = require('path');
describe('config', function () {
    describe('config.config.generateContext', function () {
        it('should set isWatch true with isWatch true context', function () {
            var context = config.generateContext({
                isWatch: true
            });
            expect(context.isWatch).toEqual(true);
        });
        it('should set isWatch false by default', function () {
            var context = config.generateContext();
            expect(context.isWatch).toEqual(false);
        });
        it('should set isProd false with isProd false context', function () {
            var context = config.generateContext({
                isProd: false
            });
            expect(context.isProd).toEqual(false);
        });
        it('should set default bundler when invalid value', function () {
            var context = config.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set default bundler when not set', function () {
            var context = config.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set isProd by default', function () {
            var context = config.generateContext();
            expect(context.isProd).toEqual(false);
        });
        it('should create an object when passed nothing', function () {
            var context = config.generateContext();
            expect(context).toBeDefined();
        });
        it('should set default prod specific build flag defaults to false', function () {
            // arrange
            var fakeConfig = {};
            config.setProcessEnv(fakeConfig);
            // act
            var context = config.generateContext({
                isProd: false
            });
            // assert
            expect(context.isProd).toEqual(false);
            expect(context.runAot).toEqual(false);
            expect(context.runMinifyJs).toEqual(false);
            expect(context.runMinifyCss).toEqual(false);
            expect(context.optimizeJs).toEqual(false);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ENV]).toEqual(Constants.ENV_VAR_DEV);
        });
        it('should set default prod specific build flags to true when isProd is true', function () {
            // arrange
            // arrange
            var fakeConfig = {};
            config.setProcessEnv(fakeConfig);
            // act
            var context = config.generateContext({
                isProd: true
            });
            // assert
            expect(context.isProd).toEqual(true);
            expect(context.runAot).toEqual(true);
            expect(context.runMinifyJs).toEqual(true);
            expect(context.runMinifyCss).toEqual(true);
            expect(context.optimizeJs).toEqual(true);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ENV]).toEqual(Constants.ENV_VAR_PROD);
        });
    });
    describe('config.replacePathVars', function () {
        it('should interpolated value when string', function () {
            var context = {
                srcDir: 'src',
            };
            var rtn = config.replacePathVars(context, '{{SRC}}');
            expect(rtn).toEqual('src');
        });
        it('should interpolated values in string array', function () {
            var context = {
                wwwDir: 'www',
                srcDir: 'src',
            };
            var filePaths = ['{{SRC}}', '{{WWW}}'];
            var rtn = config.replacePathVars(context, filePaths);
            expect(rtn).toEqual(['src', 'www']);
        });
        it('should interpolated values in key value pair', function () {
            var context = {
                wwwDir: 'www',
                srcDir: 'src',
            };
            var filePaths = {
                src: '{{SRC}}',
                www: '{{WWW}}'
            };
            var rtn = config.replacePathVars(context, filePaths);
            expect(rtn).toEqual({
                src: 'src',
                www: 'www'
            });
        });
    });
    describe('config.getConfigValue', function () {
        it('should get arg full value', function () {
            config.addArgv('--full');
            config.addArgv('fullArgValue');
            config.addArgv('-s');
            config.addArgv('shortArgValue');
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('fullArgValue');
        });
        it('should get arg short value', function () {
            config.addArgv('-s');
            config.addArgv('shortArgValue');
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('shortArgValue');
        });
        it('should get envVar value', function () {
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myProcessEnvVar');
        });
        it('should get package.json config value', function () {
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myPackageConfigVal');
        });
        it('should get default value', function () {
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('defaultValue');
        });
    });
    describe('config.bundlerStrategy', function () {
        it('should get rollup by full arg', function () {
            config.addArgv('--rollup');
            config.addArgv('my.rollup.confg.js');
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by short arg', function () {
            config.addArgv('-r');
            config.addArgv('my.rollup.confg.js');
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by bundler arg', function () {
            config.addArgv('--bundler');
            config.addArgv('rollup');
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by env var', function () {
            config.setProcessEnv({
                ionic_bundler: 'rollup'
            });
            config.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by package.json config', function () {
            config.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get webpack with invalid env var', function () {
            config.setProcessEnv({
                ionic_bundler: 'bobsBundler'
            });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
        it('should get rollup by env var', function () {
            config.setProcessEnv({
                ionic_bundler: 'rollup'
            });
            config.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by package.json config', function () {
            config.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get webpack by default', function () {
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
    });
    describe('config.getUserConfigFile', function () {
        it('should get config from package.json config', function () {
            config.setAppPackageJsonData({
                config: { ionic_config: 'myconfig.js' }
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from env var', function () {
            config.setProcessEnv({
                IONIC_CONFIG: 'myconfig.js'
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from short arg', function () {
            config.addArgv('-s');
            config.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from full arg', function () {
            config.addArgv('--full');
            config.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get userConfigFile', function () {
            var userConfigFile = 'myconfig.js';
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should not get a user config', function () {
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(null);
        });
    });
    describe('config.hasArg function', function () {
        it('should return false when a match is not found', function () {
            var result = config.hasArg('--full', '-f');
            expect(result).toBeFalsy();
        });
        it('should match on a fullname arg', function () {
            config.addArgv('--full');
            var result = config.hasArg('--full');
            expect(result).toBeTruthy();
        });
        it('should match on a shortname arg', function () {
            config.addArgv('-f');
            var result = config.hasArg('--full', '-f');
            expect(result).toBeTruthy();
        });
        it('should compare fullnames as case insensitive', function () {
            config.addArgv('--full');
            config.addArgv('--TEST');
            var result = config.hasArg('--Full');
            var result2 = config.hasArg('--test');
            expect(result).toBeTruthy();
            expect(result2).toBeTruthy();
        });
        it('should compare shortnames as case insensitive', function () {
            config.addArgv('-f');
            config.addArgv('-T');
            var result = config.hasArg('-F');
            var result2 = config.hasArg('-t');
            expect(result).toBeTruthy();
            expect(result2).toBeTruthy();
        });
    });
    var context;
    beforeEach(function () {
        config.setProcessArgs(['node', 'ionic-app-scripts']);
        config.setProcessEnv({});
        config.setCwd('');
        config.setAppPackageJsonData(null);
        context = config.generateContext({});
    });
});
