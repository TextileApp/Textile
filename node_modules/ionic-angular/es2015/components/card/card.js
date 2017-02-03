import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
  * @private
  */
export class Card extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card');
    }
    /**
     * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
     */
    set color(val) {
        this._setColor(val);
    }
    /**
     * @input {string} The mode to apply to this component.
     */
    set mode(val) {
        this._setMode(val);
    }
}
Card.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card'
            },] },
];
/** @nocollapse */
Card.ctorParameters = [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
Card.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * @private
 */
export class CardContent extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-content');
    }
    /**
     * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
     */
    set color(val) {
        this._setColor(val);
    }
    /**
     * @input {string} The mode to apply to this component.
     */
    set mode(val) {
        this._setMode(val);
    }
}
CardContent.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-content'
            },] },
];
/** @nocollapse */
CardContent.ctorParameters = [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
CardContent.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * @private
 */
export class CardHeader extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-header');
    }
    /**
     * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
     */
    set color(val) {
        this._setColor(val);
    }
    /**
     * @input {string} The mode to apply to this component.
     */
    set mode(val) {
        this._setMode(val);
    }
}
CardHeader.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-header'
            },] },
];
/** @nocollapse */
CardHeader.ctorParameters = [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
CardHeader.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
};
/**
 * @private
 */
export class CardTitle extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-title');
    }
    /**
     * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
     */
    set color(val) {
        this._setColor(val);
    }
    /**
     * @input {string} The mode to apply to this component.
     */
    set mode(val) {
        this._setMode(val);
    }
}
CardTitle.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-title'
            },] },
];
/** @nocollapse */
CardTitle.ctorParameters = [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
CardTitle.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
};
//# sourceMappingURL=card.js.map