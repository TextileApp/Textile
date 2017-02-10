"use strict";
/**
 * @hidden
 */
var Config = (function () {
    function Config() {
        /**
         * @private
         */
        this.urls = {
            'api': 'https://api.ionic.io',
            'web': 'https://web.ionic.io'
        };
    }
    /**
     * Register a new config.
     */
    Config.prototype.register = function (settings) {
        this.settings = settings;
    };
    /**
     * Get a value from the core settings. You should use `settings` attribute
     * directly for core settings and other settings.
     *
     * @deprecated
     *
     * @param name - The settings key to get.
     */
    Config.prototype.get = function (name) {
        if (!this.settings || !this.settings.core) {
            return undefined;
        }
        return this.settings.core[name];
    };
    /**
     * @hidden
     */
    Config.prototype.getURL = function (name) {
        var urls = (this.settings && this.settings.core && this.settings.core.urls) || {};
        if (urls[name]) {
            return urls[name];
        }
        return this.urls[name];
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map