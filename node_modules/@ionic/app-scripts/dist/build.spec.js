"use strict";
var Constants = require('./util/constants');
var helpers = require('./util/helpers');
var clean = require('./clean');
var build = require('./build');
var bundle = require('./bundle');
var copy = require('./copy');
var minify = require('./minify');
var lint = require('./lint');
var ngc = require('./ngc');
var sass = require('./sass');
var transpile = require('./transpile');
describe('build', function () {
    beforeEach(function () {
        spyOn(clean, 'clean');
        spyOn(helpers, 'readFileAsync').and.callFake(function () {
            return Promise.resolve("{\n        \"compilerOptions\": {\n          \"sourceMap\": true\n        }\n      }\n      ");
        });
        spyOn(copy, 'copy').and.returnValue(Promise.resolve());
        spyOn(ngc, 'ngc').and.returnValue(Promise.resolve());
        spyOn(bundle, 'bundle').and.returnValue(Promise.resolve());
        spyOn(minify, 'minifyJs').and.returnValue(Promise.resolve());
        spyOn(sass, 'sass').and.returnValue(Promise.resolve());
        spyOn(minify, 'minifyCss').and.returnValue(Promise.resolve());
        spyOn(lint, 'lint').and.returnValue(Promise.resolve());
        spyOn(transpile, 'transpile').and.returnValue(Promise.resolve());
    });
    it('should do a prod build', function () {
        var context = {
            isProd: true,
            optimizeJs: true,
            runMinifyJs: true,
            runMinifyCss: true,
            runAot: true
        };
        return build.build(context).then(function () {
            expect(helpers.readFileAsync).toHaveBeenCalled();
            expect(copy.copy).toHaveBeenCalled();
            expect(ngc.ngc).toHaveBeenCalled();
            expect(bundle.bundle).toHaveBeenCalled();
            expect(minify.minifyJs).toHaveBeenCalled();
            expect(sass.sass).toHaveBeenCalled();
            expect(minify.minifyCss).toHaveBeenCalled();
            expect(lint.lint).toHaveBeenCalled();
            expect(transpile.transpile).not.toHaveBeenCalled();
        }).catch(function (err) {
            console.log("err.message: ", err.message);
            expect(true).toEqual(false);
        });
    });
    it('should do a dev build', function () {
        var context = {
            isProd: false,
            optimizeJs: false,
            runMinifyJs: false,
            runMinifyCss: false,
            runAot: false
        };
        return build.build(context).then(function () {
            expect(helpers.readFileAsync).toHaveBeenCalled();
            expect(copy.copy).toHaveBeenCalled();
            expect(transpile.transpile).toHaveBeenCalled();
            expect(bundle.bundle).toHaveBeenCalled();
            expect(sass.sass).toHaveBeenCalled();
            expect(lint.lint).toHaveBeenCalled();
            expect(ngc.ngc).not.toHaveBeenCalled();
            expect(minify.minifyJs).not.toHaveBeenCalled();
            expect(minify.minifyCss).not.toHaveBeenCalled();
        }).catch(function (err) {
            console.log("err.message: ", err.message);
            expect(true).toEqual(false);
        });
    });
});
describe('test project requirements before building', function () {
    it('should fail if APP_ENTRY_POINT file does not exist', function () {
        process.env[Constants.ENV_APP_ENTRY_POINT] = 'src/app/main.ts';
        process.env[Constants.ENV_TS_CONFIG] = 'tsConfig.js';
        var error = new Error('App entry point was not found');
        spyOn(helpers, 'readFileAsync').and.returnValue(Promise.reject(error));
        return build.build({}).catch(function (e) {
            expect(helpers.readFileAsync).toHaveBeenCalledTimes(2);
            expect(e).toEqual(error);
        });
    });
    it('should fail if IONIC_TS_CONFIG file does not exist', function () {
        process.env[Constants.ENV_APP_ENTRY_POINT] = 'src/app/main.ts';
        process.env[Constants.ENV_TS_CONFIG] = 'tsConfig.js';
        var error = new Error('App entry point was not found');
        spyOn(helpers, 'readFileAsync').and.callFake(function (filePath) {
            if (filePath === 'src/app/main.ts') {
                return Promise.resolve('allgood');
            }
            return Promise.reject(error);
        });
        return build.build({}).catch(function (e) {
            expect(helpers.readFileAsync).toHaveBeenCalledTimes(2);
            expect(e).toEqual(error);
        });
    });
    it('should fail fataly if IONIC_TS_CONFIG file does not contain valid JSON', function () {
        process.env[Constants.ENV_APP_ENTRY_POINT] = 'src/app/main.ts';
        process.env[Constants.ENV_TS_CONFIG] = 'tsConfig.js';
        spyOn(helpers, 'readFileAsync').and.callFake(function () {
            return Promise.resolve("{\n        \"compilerOptions\" {\n          \"sourceMap\": false\n        }\n      }\n      ");
        });
        return build.build({}).catch(function (e) {
            expect(helpers.readFileAsync).toHaveBeenCalledTimes(2);
            expect(e.isFatal).toBeTruthy();
        });
    });
    it('should fail fataly if IONIC_TS_CONFIG file does not contain compilerOptions.sourceMap === true', function () {
        process.env[Constants.ENV_APP_ENTRY_POINT] = 'src/app/main.ts';
        process.env[Constants.ENV_TS_CONFIG] = 'tsConfig.js';
        spyOn(helpers, 'readFileAsync').and.callFake(function () {
            return Promise.resolve("{\n        \"compilerOptions\": {\n          \"sourceMap\": false\n        }\n      }\n      ");
        });
        return build.build({}).catch(function (e) {
            expect(helpers.readFileAsync).toHaveBeenCalledTimes(2);
            expect(e.isFatal).toBeTruthy();
        });
    });
    it('should succeed if IONIC_TS_CONFIG file contains compilerOptions.sourceMap === true', function () {
        process.env[Constants.ENV_APP_ENTRY_POINT] = 'src/app/main.ts';
        process.env[Constants.ENV_TS_CONFIG] = 'tsConfig.js';
        spyOn(clean, 'clean');
        spyOn(copy, 'copy').and.returnValue(Promise.resolve());
        spyOn(ngc, 'ngc').and.returnValue(Promise.resolve());
        spyOn(bundle, 'bundle').and.returnValue(Promise.resolve());
        spyOn(minify, 'minifyJs').and.returnValue(Promise.resolve());
        spyOn(sass, 'sass').and.returnValue(Promise.resolve());
        spyOn(minify, 'minifyCss').and.returnValue(Promise.resolve());
        spyOn(lint, 'lint').and.returnValue(Promise.resolve());
        spyOn(transpile, 'transpile').and.returnValue(Promise.resolve());
        spyOn(helpers, 'readFileAsync').and.callFake(function () {
            return Promise.resolve("{\n        \"compilerOptions\": {\n          \"sourceMap\": true\n        }\n      }\n      ");
        });
        return build.build({}).then(function () {
            expect(helpers.readFileAsync).toHaveBeenCalledTimes(2);
        });
    });
});
