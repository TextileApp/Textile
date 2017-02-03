"use strict";
var errors_1 = require('./errors');
describe('Errors', function () {
    describe('BuildError', function () {
        it('should create BuildError from err object in constructor', function () {
            var buildError = new errors_1.BuildError();
            buildError.hasBeenLogged = false;
            buildError.message = 'message1';
            buildError.name = 'name1';
            buildError.stack = 'stack1';
            var buildErrorCopy = new errors_1.BuildError(buildError);
            var json = buildErrorCopy.toJson();
            expect(json.hasBeenLogged).toEqual(buildError.hasBeenLogged);
            expect(json.message).toEqual(buildError.message);
            expect(json.name).toEqual(buildError.name);
            expect(json.stack).toEqual(buildError.stack);
        });
        it('should create json object', function () {
            var buildError = new errors_1.BuildError();
            buildError.hasBeenLogged = false;
            buildError.message = 'message';
            buildError.name = 'name';
            buildError.stack = 'stack';
            var json = buildError.toJson();
            expect(json.hasBeenLogged).toEqual(buildError.hasBeenLogged);
            expect(json.message).toEqual(buildError.message);
            expect(json.name).toEqual(buildError.name);
            expect(json.stack).toEqual(buildError.stack);
        });
    });
});
