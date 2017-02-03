"use strict";
var ModuleRoute = (function () {
    function ModuleRoute(path, className) {
        if (className === void 0) { className = null; }
        this.path = path;
        this.className = className;
    }
    ModuleRoute.prototype.toString = function () {
        return this.path + "#" + this.className;
    };
    ModuleRoute.fromString = function (entry) {
        var split = entry.split('#');
        return new ModuleRoute(split[0], split[1]);
    };
    return ModuleRoute;
}());
exports.ModuleRoute = ModuleRoute;
