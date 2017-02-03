var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../../config/config', '../ion'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var config_1 = require('../../config/config');
    var ion_1 = require('../ion');
    /**
      * @name Badge
      * @module ionic
      * @description
      * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
      * @see {@link /docs/v2/components/#badges Badges Component Docs}
     */
    var Badge = (function (_super) {
        __extends(Badge, _super);
        function Badge(config, elementRef, renderer) {
            _super.call(this, config, elementRef, renderer, 'badge');
        }
        Object.defineProperty(Badge.prototype, "color", {
            /**
             * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
             */
            set: function (val) {
                this._setColor(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Badge.prototype, "mode", {
            /**
             * @input {string} The mode to apply to this component.
             */
            set: function (val) {
                this._setMode(val);
            },
            enumerable: true,
            configurable: true
        });
        Badge.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-badge'
                    },] },
        ];
        /** @nocollapse */
        Badge.ctorParameters = [
            { type: config_1.Config, },
            { type: core_1.ElementRef, },
            { type: core_1.Renderer, },
        ];
        Badge.propDecorators = {
            'color': [{ type: core_1.Input },],
            'mode': [{ type: core_1.Input },],
        };
        return Badge;
    }(ion_1.Ion));
    exports.Badge = Badge;
});
//# sourceMappingURL=badge.js.map