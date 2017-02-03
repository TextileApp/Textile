import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/v2/demos/src/select/
 */
export class Option {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        this._selected = false;
        this._disabled = false;
        /**
         * @input {any} Event to evaluate when option is selected
         */
        this.ionSelect = new EventEmitter();
    }
    /**
     * @input {boolean} Whether or not the option is already selected
     */
    get selected() {
        return this._selected;
    }
    set selected(val) {
        this._selected = isTrueProperty(val);
    }
    /**
     * @input {any} The value of the option
     */
    get value() {
        if (isPresent(this._value)) {
            return this._value;
        }
        return this.text;
    }
    set value(val) {
        this._value = val;
    }
    /**
     * @input {boolean} Whether or not the option is disabled
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * @private
     */
    get text() {
        return this._elementRef.nativeElement.textContent;
    }
}
Option.decorators = [
    { type: Directive, args: [{
                selector: 'ion-option'
            },] },
];
/** @nocollapse */
Option.ctorParameters = [
    { type: ElementRef, },
];
Option.propDecorators = {
    'ionSelect': [{ type: Output },],
    'selected': [{ type: Input },],
    'value': [{ type: Input },],
    'disabled': [{ type: Input },],
};
//# sourceMappingURL=option.js.map