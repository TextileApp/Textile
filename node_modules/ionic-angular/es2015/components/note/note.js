import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
  * @private
  */
export class Note extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'note');
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
Note.decorators = [
    { type: Directive, args: [{
                selector: 'ion-note'
            },] },
];
/** @nocollapse */
Note.ctorParameters = [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
Note.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
};
//# sourceMappingURL=note.js.map