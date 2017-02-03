(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../components/app/app', './dom', '../config/config'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var app_1 = require('../components/app/app');
    var dom_1 = require('./dom');
    var config_1 = require('../config/config');
    /**
     * @private
     */
    var ClickBlock = (function () {
        function ClickBlock(app, config, elementRef, renderer) {
            this.elementRef = elementRef;
            this.renderer = renderer;
            this._showing = false;
            app._clickBlock = this;
            var enabled = this.isEnabled = config.getBoolean('clickBlock', true);
            if (enabled) {
                this._setElementClass('click-block-enabled', true);
            }
        }
        ClickBlock.prototype.activate = function (shouldShow, expire) {
            if (expire === void 0) { expire = 100; }
            if (this.isEnabled) {
                dom_1.clearNativeTimeout(this._tmr);
                if (shouldShow) {
                    this._activate(true);
                }
                this._tmr = dom_1.nativeTimeout(this._activate.bind(this, false), expire);
            }
        };
        /** @internal */
        ClickBlock.prototype._activate = function (shouldShow) {
            if (this._showing !== shouldShow) {
                this._setElementClass('click-block-active', shouldShow);
                this._showing = shouldShow;
            }
        };
        ClickBlock.prototype._setElementClass = function (className, add) {
            this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
        };
        ClickBlock.decorators = [
            { type: core_1.Directive, args: [{
                        selector: '.click-block'
                    },] },
        ];
        /** @nocollapse */
        ClickBlock.ctorParameters = [
            { type: app_1.App, decorators: [{ type: core_1.Inject, args: [core_1.forwardRef(function () { return app_1.App; }),] },] },
            { type: config_1.Config, },
            { type: core_1.ElementRef, },
            { type: core_1.Renderer, },
        ];
        return ClickBlock;
    }());
    exports.ClickBlock = ClickBlock;
});
//# sourceMappingURL=click-block.js.map