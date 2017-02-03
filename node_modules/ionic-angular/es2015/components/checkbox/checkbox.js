import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
export const CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Checkbox),
    multi: true
};
/**
 * @name Checkbox
 * @module ionic
 *
 * @description
 * The Checkbox is a simple component styled based on the mode. It can be
 * placed in an `ion-item` or used as a stand-alone checkbox.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/src/checkbox/
 * @see {@link /docs/v2/components#checkbox Checkbox Component Docs}
 */
export class Checkbox extends Ion {
    constructor(config, _form, _item, elementRef, renderer) {
        super(config, elementRef, renderer, 'checkbox');
        this._form = _form;
        this._item = _item;
        /** @private */
        this._checked = false;
        /** @private */
        this._disabled = false;
        /**
         * @output {Checkbox} expression to evaluate when the checkbox value changes
         */
        this.ionChange = new EventEmitter();
        _form.register(this);
        if (_item) {
            this.id = 'chk-' + _item.registerInput('checkbox');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-checkbox', true);
        }
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
    /**
     * @private
     */
    _click(ev) {
        (void 0) /* console.debug */;
        ev.preventDefault();
        ev.stopPropagation();
        this.onChange(!this._checked);
    }
    /**
     * @input {boolean} whether or not the checkbox is checked (defaults to false)
     */
    get checked() {
        return this._checked;
    }
    set checked(val) {
        this._setChecked(isTrueProperty(val));
        this.onChange(this._checked);
    }
    /**
     * @private
     */
    _setChecked(isChecked) {
        if (!this._disabled && isChecked !== this._checked) {
            this._checked = isChecked;
            if (this._init) {
                this.ionChange.emit(this);
            }
            this._item && this._item.setElementClass('item-checkbox-checked', isChecked);
        }
    }
    /**
     * @private
     */
    writeValue(val) {
        this._setChecked(isTrueProperty(val));
    }
    /**
     * @private
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = (isChecked) => {
            (void 0) /* console.debug */;
            fn(isChecked);
            this._setChecked(isChecked);
            this.onTouched();
        };
    }
    /**
     * @private
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @input {boolean} whether or not the checkbox is disabled or not.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = isTrueProperty(val);
        this._item && this._item.setElementClass('item-checkbox-disabled', this._disabled);
    }
    /**
     * @private
     */
    onChange(isChecked) {
        // used when this input does not have an ngModel or formControlName
        (void 0) /* console.debug */;
        this._setChecked(isChecked);
        this.onTouched();
    }
    /**
     * @private
     */
    initFocus() {
        this._elementRef.nativeElement.querySelector('button').focus();
    }
    /**
     * @private
     */
    onTouched() { }
    /**
     * @private
     */
    ngAfterContentInit() {
        this._init = true;
    }
    /**
     * @private
     */
    ngOnDestroy() {
        this._form.deregister(this);
    }
}
Checkbox.decorators = [
    { type: Component, args: [{
                selector: 'ion-checkbox',
                template: '<div class="checkbox-icon" [class.checkbox-checked]="_checked">' +
                    '<div class="checkbox-inner"></div>' +
                    '</div>' +
                    '<button role="checkbox" ' +
                    'type="button" ' +
                    'ion-button="item-cover" ' +
                    '[id]="id" ' +
                    '[attr.aria-checked]="_checked" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.aria-disabled]="_disabled" ' +
                    'class="item-cover"> ' +
                    '</button>',
                host: {
                    '[class.checkbox-disabled]': '_disabled'
                },
                providers: [CHECKBOX_VALUE_ACCESSOR],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
Checkbox.ctorParameters = [
    { type: Config, },
    { type: Form, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer, },
];
Checkbox.propDecorators = {
    'color': [{ type: Input },],
    'mode': [{ type: Input },],
    'ionChange': [{ type: Output },],
    '_click': [{ type: HostListener, args: ['click', ['$event'],] },],
    'checked': [{ type: Input },],
    'disabled': [{ type: Input },],
};
//# sourceMappingURL=checkbox.js.map