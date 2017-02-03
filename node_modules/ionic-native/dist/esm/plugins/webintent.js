var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Cordova, CordovaProperty, Plugin } from './plugin';
/**
 * @name WebIntent
 * @description
 * @usage
 * For usage information please refer to the plugin's Github repo.
 *
 * ```typescript
 * import {WebIntent} from 'ionic-native';
 *
 * WebIntent.startActivity(options).then(onSuccess, onError);
 *
 * ```
 */
export var WebIntent = (function () {
    function WebIntent() {
    }
    /**
     * @param options {Object} { action: any, url: string, type?: string }
     * @returns {Promise<any>}
     */
    WebIntent.startActivity = function (options) { return; };
    /**
     * @param extra {any}
     * @returns {Promise<any>}
     */
    WebIntent.hasExtra = function (extra) { return; };
    /**
     * @param extra {any}
     * @returns {Promise<any>}
     */
    WebIntent.getExtra = function (extra) { return; };
    /**
     * @returns {Promise<any>}
     */
    WebIntent.getUri = function () { return; };
    ;
    /**
     * @returns {Promise<string>}
     */
    WebIntent.onNewIntent = function () { return; };
    ;
    /**
     * @param options {Object} { action: string, extras?: { option: boolean } }
     * @returns {Promise<any>}
     */
    WebIntent.sendBroadcast = function (options) { return; };
    __decorate([
        CordovaProperty
    ], WebIntent, "ACTION_VIEW", void 0);
    __decorate([
        CordovaProperty
    ], WebIntent, "EXTRA_TEXT", void 0);
    __decorate([
        Cordova()
    ], WebIntent, "startActivity", null);
    __decorate([
        Cordova()
    ], WebIntent, "hasExtra", null);
    __decorate([
        Cordova()
    ], WebIntent, "getExtra", null);
    __decorate([
        Cordova()
    ], WebIntent, "getUri", null);
    __decorate([
        Cordova()
    ], WebIntent, "onNewIntent", null);
    __decorate([
        Cordova()
    ], WebIntent, "sendBroadcast", null);
    WebIntent = __decorate([
        Plugin({
            pluginName: 'WebIntent',
            plugin: 'https://github.com/Initsogar/cordova-webintent.git',
            pluginRef: 'window.plugins.webintent',
            repo: 'https://github.com/Initsogar/cordova-webintent.git',
            platforms: ['Android']
        })
    ], WebIntent);
    return WebIntent;
}());
//# sourceMappingURL=webintent.js.map