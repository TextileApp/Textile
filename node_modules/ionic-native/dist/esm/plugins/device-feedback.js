var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Plugin, Cordova } from './plugin';
/**
 * @name DeviceFeedback
 * @description
 *
 * Plugin that lets you provide haptic or acoustic feedback on Android devices.
 *
 * @usage
 * ```
 * import { DeviceFeedback } from 'ionic-native';
 *
 * DeviceFeedback.acoustic();
 *
 * DeviceFeedback.haptic(0);
 *
 * DeviceFeedback.isFeedbackEnabled()
 *   .then((feedback) => {
 *     console.log(feedback);
 *     // {
 *     //   acoustic: true,
 *     //   haptic: true
 *     // }
 *   });
 *
 * ```
 */
export var DeviceFeedback = (function () {
    function DeviceFeedback() {
    }
    /**
     * Provide sound feedback to user, nevertheless respect user's settings and current active device profile as native feedback do.
     */
    DeviceFeedback.acoustic = function () { };
    /**
     * Provide vibrate feedback to user, nevertheless respect user's tactile feedback setting as native feedback do.
     * @param type {Number} Specify type of vibration feedback. 0 for long press, 1 for virtual key, or 3 for keyboard tap.
     */
    DeviceFeedback.haptic = function (type) { };
    /**
     * Check if haptic and acoustic feedback is enabled by user settings.
     * @returns {Promise<any>}
     */
    DeviceFeedback.isFeedbackEnabled = function () { return; };
    __decorate([
        Cordova({ sync: true })
    ], DeviceFeedback, "acoustic", null);
    __decorate([
        Cordova({ sync: true })
    ], DeviceFeedback, "haptic", null);
    __decorate([
        Cordova()
    ], DeviceFeedback, "isFeedbackEnabled", null);
    DeviceFeedback = __decorate([
        Plugin({
            pluginName: 'DeviceFeedback',
            plugin: 'cordova-plugin-velda-devicefeedback',
            pluginRef: 'plugins.deviceFeedback',
            repo: 'https://github.com/VVelda/device-feedback',
            platforms: ['Android']
        })
    ], DeviceFeedback);
    return DeviceFeedback;
}());
//# sourceMappingURL=device-feedback.js.map