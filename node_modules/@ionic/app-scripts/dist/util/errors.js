"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BuildError = (function (_super) {
    __extends(BuildError, _super);
    function BuildError(err) {
        _super.call(this);
        this.hasBeenLogged = false;
        this.isFatal = false;
        if (err) {
            if (err.message) {
                this.message = err.message;
            }
            else if (err) {
                this.message = err;
            }
            if (err.stack) {
                this.stack = err.stack;
            }
            if (err.name) {
                this.name = err.name;
            }
            if (typeof err.hasBeenLogged === 'boolean') {
                this.hasBeenLogged = err.hasBeenLogged;
            }
            if (err.hasOwnProperty('isFatal')) {
                this.isFatal = err.isFatal;
            }
        }
    }
    BuildError.prototype.toJson = function () {
        return {
            message: this.message,
            name: this.name,
            stack: this.stack,
            hasBeenLogged: this.hasBeenLogged
        };
    };
    return BuildError;
}(Error));
exports.BuildError = BuildError;
/* There are special cases where strange things happen where we don't want any logging, etc.
 * For our sake, it is much easier to get off the happy path of code and just throw an exception
 * and do nothing with it
 */
var IgnorableError = (function (_super) {
    __extends(IgnorableError, _super);
    function IgnorableError(msg) {
        _super.call(this, msg);
    }
    return IgnorableError;
}(Error));
exports.IgnorableError = IgnorableError;
