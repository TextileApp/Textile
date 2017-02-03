"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var plugin_1 = require('./plugin');
/**
 * @name Image Picker
 * @description
 * Cordova Plugin For Multiple Image Selection
 *
 * Requires Cordova plugin: `cordova-plugin-image-picker`.
 * For more info, please see the https://github.com/wymsee/cordova-imagePicker
 *
 * @usage
 * ```typescript
 * import { ImagePicker } from 'ionic-native';
 *
 *
 *
 * ImagePicker.getPictures(options).then((results) => {
 *   for (var i = 0; i < results.length; i++) {
 *       console.log('Image URI: ' + results[i]);
 *   }
 * }, (err) => { });
 * ```
 * @interfaces
 * ImagePickerOptions
 */
var ImagePicker = (function () {
    function ImagePicker() {
    }
    /**
     * Pick pictures from the library.
     * @param {ImagePickerOptions} options
     * @returns {Promise<any>} Returns a Promise that resolves the image file URI
     * otherwise rejects with an error.
     */
    ImagePicker.getPictures = function (options) { return; };
    /**
     * Check if we have permission to read images
     * @returns {Promise<boolean>} Returns a promise that resolves with a boolean that indicates whether we have permission
     */
    ImagePicker.hasReadPermission = function () { return; };
    /**
     * Request permission to read images
     * @returns {Promise<any>}
     */
    ImagePicker.requestReadPermission = function () { return; };
    __decorate([
        plugin_1.Cordova({
            callbackOrder: 'reverse'
        })
    ], ImagePicker, "getPictures", null);
    __decorate([
        plugin_1.Cordova({
            platforms: ['Android']
        })
    ], ImagePicker, "hasReadPermission", null);
    __decorate([
        plugin_1.Cordova({
            platforms: ['Android']
        })
    ], ImagePicker, "requestReadPermission", null);
    ImagePicker = __decorate([
        plugin_1.Plugin({
            pluginName: 'ImagePicker',
            plugin: 'https://github.com/Telerik-Verified-Plugins/ImagePicker',
            pluginRef: 'window.imagePicker',
            repo: 'https://github.com/Telerik-Verified-Plugins/ImagePicker'
        })
    ], ImagePicker);
    return ImagePicker;
}());
exports.ImagePicker = ImagePicker;
//# sourceMappingURL=imagepicker.js.map