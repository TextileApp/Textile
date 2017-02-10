"use strict";
/**
 * Simple console logger.
 */
var Logger = (function () {
    function Logger(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        /**
         * The function to use to log info level messages.
         */
        this.infofn = console.log.bind(console);
        /**
         * The function to use to log warn level messages.
         */
        this.warnfn = console.warn.bind(console);
        /**
         * The function to use to log error level messages.
         */
        this.errorfn = console.error.bind(console);
    }
    /**
     * Send a log at info level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    Logger.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.options.silent) {
            this.infofn.apply(this, [message].concat(optionalParams));
        }
    };
    /**
     * Send a log at warn level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    Logger.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.options.silent) {
            this.warnfn.apply(this, [message].concat(optionalParams));
        }
    };
    /**
     * Send a log at error level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    Logger.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.errorfn.apply(this, [message].concat(optionalParams));
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map