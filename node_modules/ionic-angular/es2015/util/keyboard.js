import { Injectable, NgZone } from '@angular/core';
import { Config } from '../config/config';
import { DomController } from './dom-controller';
import { focusOutActiveElement, hasFocusedTextInput, nativeTimeout, clearNativeTimeout } from './dom';
import { Key } from './key';
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
export class Keyboard {
    constructor(config, _zone, _dom) {
        this._zone = _zone;
        this._dom = _dom;
        _zone.runOutsideAngular(() => {
            this.focusOutline(config.get('focusOutline'), document);
            window.addEventListener('native.keyboardhide', () => {
                clearNativeTimeout(this._tmr);
                this._tmr = nativeTimeout(() => {
                    // this custom cordova plugin event fires when the keyboard will hide
                    // useful when the virtual keyboard is closed natively
                    // https://github.com/driftyco/ionic-plugin-keyboard
                    if (hasFocusedTextInput()) {
                        focusOutActiveElement();
                    }
                }, 80);
            });
            window.addEventListener('native.keyboardshow', () => {
                clearNativeTimeout(this._tmr);
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
    isOpen() {
        return hasFocusedTextInput();
    }
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
    onClose(callback, pollingInternval = KEYBOARD_CLOSE_POLLING, pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX) {
        (void 0) /* console.debug */;
        const self = this;
        let checks = 0;
        let promise = null;
        if (!callback) {
            // a callback wasn't provided, so let's return a promise instead
            promise = new Promise(resolve => { callback = resolve; });
        }
        function checkKeyboard() {
            (void 0) /* console.debug */;
            if (!self.isOpen() || checks > pollingChecksMax) {
                nativeTimeout(function () {
                    self._zone.run(function () {
                        (void 0) /* console.debug */;
                        callback();
                    });
                }, 400);
            }
            else {
                nativeTimeout(checkKeyboard, pollingInternval);
            }
            checks++;
        }
        nativeTimeout(checkKeyboard, pollingInternval);
        return promise;
    }
    /**
     * Programmatically close the keyboard.
     */
    close() {
        this._dom.read(() => {
            if (hasFocusedTextInput()) {
                // only focus out when a text input has focus
                (void 0) /* console.debug */;
                this._dom.write(() => {
                    focusOutActiveElement();
                });
            }
        });
    }
    /**
     * @private
     */
    focusOutline(setting, document) {
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
        const self = this;
        let isKeyInputEnabled = false;
        function cssClass() {
            self._dom.write(() => {
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
            if (!isKeyInputEnabled && ev.keyCode === Key.TAB) {
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
            self._zone.runOutsideAngular(() => {
                document.removeEventListener('mousedown', pointerDown);
                document.removeEventListener('touchstart', pointerDown);
                if (isKeyInputEnabled) {
                    document.addEventListener('mousedown', pointerDown);
                    document.addEventListener('touchstart', pointerDown);
                }
            });
        }
        document.addEventListener('keydown', keyDown);
    }
}
Keyboard.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Keyboard.ctorParameters = [
    { type: Config, },
    { type: NgZone, },
    { type: DomController, },
];
const KEYBOARD_CLOSE_POLLING = 150;
const KEYBOARD_POLLING_CHECKS_MAX = 100;
//# sourceMappingURL=keyboard.js.map