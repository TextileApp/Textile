"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var db_1 = require("@ionic/db");
var Database = (function (_super) {
    __extends(Database, _super);
    function Database(deps, settings) {
        var _this = _super.call(this, settings) || this;
        _this.deps = deps;
        _this.settings = settings;
        if (_this.settings.authType === 'authenticated') {
            _this.deps.emitter.on('auth:login', function (login) {
                if (login && login['token']) {
                    _this.setToken(login['token']);
                }
            });
            _this.deps.emitter.on('auth:logout', function () {
                _this.removeToken();
                _this.disconnect();
            });
        }
        return _this;
    }
    return Database;
}(db_1.IonicDB));
exports.Database = Database;
//# sourceMappingURL=database.js.map