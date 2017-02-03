"use strict";
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
        spyOn(helpers, 'readFileAsync').and.returnValue(Promise.resolve());
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
    it('should do a dev build', function (done) {
        var context = {
            isProd: false,
            optimizeJs: false,
            runMinifyJs: false,
            runMinifyCss: false,
            runAot: false
        };
        build.build(context).then(function () {
            expect(helpers.readFileAsync).toHaveBeenCalled();
            expect(copy.copy).toHaveBeenCalled();
            expect(transpile.transpile).toHaveBeenCalled();
            expect(bundle.bundle).toHaveBeenCalled();
            expect(sass.sass).toHaveBeenCalled();
            expect(lint.lint).toHaveBeenCalled();
            expect(ngc.ngc).not.toHaveBeenCalled();
            expect(minify.minifyJs).not.toHaveBeenCalled();
            expect(minify.minifyCss).not.toHaveBeenCalled();
            done();
        }).catch(function (err) {
            console.log("err.message: ", err.message);
            expect(true).toEqual(false);
        });
    });
});
