(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../config/config', './dom-controller', './dom', './key'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var config_1 = require('../config/config');
    var dom_controller_1 = require('./dom-controller');
    var dom_1 = require('./dom');
    var key_1 = require('./key');
    /**
     * @name Keyboard
     * @description
     * The `Keyboard` class allows you to work with the keyboard events provided
     * by the Ionic keyboard plugin.
     *
     * @usage
     * ```ts
     * export class MyClass {
     *   constructor(public keyboard: Keyboard) {
     *
     *   }
     * }
     * ```
     */
    var Keyboard = (function () {
        function Keyboard(config, _zone, _dom) {
            var _this = this;
            this._zone = _zone;
            this._dom = _dom;
            _zone.runOutsideAngular(function () {
                _this.focusOutline(config.get('focusOutline'), document);
                window.addEventListener('native.keyboardhide', function () {
                    dom_1.clearNativeTimeout(_this._tmr);
                    _this._tmr = dom_1.nativeTimeout(function () {
                        // this custom cordova plugin event fires when the keyboard will hide
                        // useful when the virtual keyboard is closed natively
                        // https://github.com/driftyco/ionic-plugin-keyboard
                        if (dom_1.hasFocusedTextInput()) {
                            dom_1.focusOutActiveElement();
                        }
                    }, 80);
                });
                window.addEventListener('native.keyboardshow', function () {
                    dom_1.clearNativeTimeout(_this._tmr);
                });
            });
        }
        /**
         * Check to see if the keyboard is open or not.
         *
         * ```ts
         * export class MyClass {
         *   constructor(public keyboard: Keyboard) {
         *
         *   }
         *
         *   keyboardCheck() {
         *     console.log('The keyboard is open:', this.keyboard.isOpen());
         *   }
         * }
         * ```
         *
         * @return {boolean} returns a true or false value if the keyboard is open or not.
         */
        Keyboard.prototype.isOpen = function () {
            return dom_1.hasFocusedTextInput();
        };
        /**
         * When the keyboard is closed, call any methods you want.
         *
         * ```ts
         * export class MyClass {
         *   constructor(public keyboard: Keyboard) {
         *     this.keyboard.onClose(this.closeCallback);
         *   }
         *   closeCallback() {
         *     // call what ever functionality you want on keyboard close
         *     console.log('Closing time');
         *   }
         * }
         * ```
         *
         * @param {function} callback method you want to call when the keyboard has been closed.
         * @return {function} returns a callback that gets fired when the keyboard is closed.
         */
        Keyboard.prototype.onClose = function (callback, pollingInternval, pollingChecksMax) {
            if (pollingInternval === void 0) { pollingInternval = KEYBOARD_CLOSE_POLLING; }
            if (pollingChecksMax === void 0) { pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX; }
            (void 0) /* console.debug */;
            var self = this;
            var checks = 0;
            var promise = null;
            if (!callback) {
                // a callback wasn't provided, so let's return a promise instead
                promise = new Promise(function (resolve) { callback = resolve; });
            }
            function checkKeyboard() {
                (void 0) /* console.debug */;
                if (!self.isOpen() || checks > pollingChecksMax) {
                    dom_1.nativeTimeout(function () {
                        self._zone.run(function () {
                            (void 0) /* console.debug */;
                            callback();
                        });
                    }, 400);
                }
                else {
                    dom_1.nativeTimeout(checkKeyboard, pollingInternval);
                }
                checks++;
            }
            dom_1.nativeTimeout(checkKeyboard, pollingInternval);
            return promise;
        };
        /**
         * Programmatically close the keyboard.
         */
        Keyboard.prototype.close = function () {
            var _this = this;
            this._dom.read(function () {
                if (dom_1.hasFocusedTextInput()) {
                    // only focus out when a text input has focus
                    (void 0) /* console.debug */;
                    _this._dom.write(function () {
                        dom_1.focusOutActiveElement();
                    });
                }
            });
        };
        /**
         * @private
         */
        Keyboard.prototype.focusOutline = function (setting, document) {
            /* Focus Outline
             * --------------------------------------------------
             * By default, when a keydown event happens from a tab key, then
             * the 'focus-outline' css class is added to the body element
             * so focusable elements have an outline. On a mousedown or
             * touchstart event, then the 'focus-outline' css class is removed.
             *
             * Config default overrides:
             * focusOutline: true     - Always add the focus-outline
             * focusOutline: false    - Do not add the focus-outline
             */
            var self = this;
            var isKeyInputEnabled = false;
            function cssClass() {
                self._dom.write(function () {
                    document.body.classList[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
                });
            }
            if (setting === true) {
                isKeyInputEnabled = true;
                return cssClass();
            }
            else if (setting === false) {
                return;
            }
            // default is to add the focus-outline when the tab key is used
            function keyDown(ev) {
                if (!isKeyInputEnabled && ev.keyCode === key_1.Key.TAB) {
                    isKeyInputEnabled = true;
                    enableKeyInput();
                }
            }
            function pointerDown() {
                isKeyInputEnabled = false;
                enableKeyInput();
            }
            function enableKeyInput() {
                cssClass();
                self._zone.runOutsideAngular(function () {
                    document.removeEventListener('mousedown', pointerDown);
                    document.removeEventListener('touchstart', pointerDown);
                    if (isKeyInputEnabled) {
                        document.addEventListener('mousedown', pointerDown);
                        document.addEventListener('touchstart', pointerDown);
                    }
                });
            }
            document.addEventListener('keydown', keyDown);
        };
        Keyboard.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        Keyboard.ctorParameters = [
            { type: config_1.Config, },
            { type: core_1.NgZone, },
            { type: dom_controller_1.DomController, },
        ];
        return Keyboard;
    }());
    exports.Keyboard = Keyboard;
    var KEYBOARD_CLOSE_POLLING = 150;
    var KEYBOARD_POLLING_CHECKS_MAX = 100;
});
//# sourceMappingURL=keyboard.js.map