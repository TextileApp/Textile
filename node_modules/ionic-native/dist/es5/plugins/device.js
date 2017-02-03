"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var plugin_1 = require('./plugin');
/**
 * @name Device
 * @description
 * Access information about the underlying device and platform.
 *
 * @usage
 * ```typescript
 * import { Device } from 'ionic-native';
 *
 *
 * console.log('Device UUID is: ' + Device.uuid);
 * ```
 */
var Device = (function () {
    function Device() {
    }
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "cordova", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "model", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "platform", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "uuid", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "version", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "manufacturer", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "isVirtual", void 0);
    __decorate([
        plugin_1.CordovaProperty
    ], Device, "serial", void 0);
    Device = __decorate([
        plugin_1.Plugin({
            pluginName: 'Device',
            plugin: 'cordova-plugin-device',
            pluginRef: 'device',
            repo: 'https://github.com/apache/cordova-plugin-device'
        })
    ], Device);
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=device.js.map