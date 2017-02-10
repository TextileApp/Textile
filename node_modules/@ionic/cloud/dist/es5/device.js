"use strict";
/**
 * @hidden
 */
var Device = (function () {
    function Device(deps) {
        this.deps = deps;
        this.native = this.deps.nativeDevice;
        this.emitter = this.deps.emitter;
        this.type = this.determineDeviceType();
        this.registerEventHandlers();
    }
    Device.prototype.isAndroid = function () {
        return this.type === 'android';
    };
    Device.prototype.isIOS = function () {
        return this.type === 'iphone' || this.type === 'ipad';
    };
    Device.prototype.isConnectedToNetwork = function (options) {
        if (options === void 0) { options = {}; }
        if (typeof navigator.connection === 'undefined' ||
            typeof navigator.connection.type === 'undefined' ||
            typeof Connection === 'undefined') {
            if (!options.strictMode) {
                return true;
            }
            return false;
        }
        switch (navigator.connection.type) {
            case Connection.ETHERNET:
            case Connection.WIFI:
            case Connection.CELL_2G:
            case Connection.CELL_3G:
            case Connection.CELL_4G:
            case Connection.CELL:
                return true;
            default:
                return false;
        }
    };
    /**
     * @private
     */
    Device.prototype.registerEventHandlers = function () {
        var _this = this;
        if (this.type === 'unknown') {
            this.emitter.emit('device:ready');
        }
        else {
            this.emitter.once('cordova:deviceready', function () {
                _this.emitter.emit('device:ready');
            });
        }
    };
    /**
     * @private
     */
    Device.prototype.determineDeviceType = function () {
        var agent = navigator.userAgent;
        var ipad = agent.match(/iPad/i);
        if (ipad && (ipad[0].toLowerCase() === 'ipad')) {
            return 'ipad';
        }
        var iphone = agent.match(/iPhone/i);
        if (iphone && (iphone[0].toLowerCase() === 'iphone')) {
            return 'iphone';
        }
        var android = agent.match(/Android/i);
        if (android && (android[0].toLowerCase() === 'android')) {
            return 'android';
        }
        return 'unknown';
    };
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=device.js.map