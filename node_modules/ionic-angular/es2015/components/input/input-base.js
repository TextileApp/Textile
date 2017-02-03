import { ElementRef, Renderer, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { App } from '../app/app';
import { copyInputAttributes, hasPointerMoved, pointerCoord } from '../../util/dom';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DomController } from '../../util/dom-controller';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NavController } from '../../navigation/nav-controller';
import { Platform } from '../../platform/platform';
/**
 * @private
 * Hopefully someday a majority of the auto-scrolling tricks can get removed.
 */
export class InputBase extends Ion {
    constructor(config, _form, _item, _app, _platform, elementRef, renderer, _content, nav, ngControl, _dom) {
        super(config, elementRef, renderer, 'input');
        this._form = _form;
        this._item = _item;
        this._app = _app;
        this._platform = _platform;
        this._content = _content;
        this._dom = _dom;
        this._disabled = false;
        this._type = 'text';
        this._value = '';
        this._nav = nav;
        this._useAssist = config.getBoolean('scrollAssist', false);
        this._usePadding = config.getBoolean('scrollPadding', this._useAssist);
        this._keyboardHeight = config.getNumber('keyboardHeight');
        this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
        this._autoComplete = config.get('autocomplete', 'off');
        this._autoCorrect = config.get('autocorrect', 'off');
        if (ngControl) {
            ngControl.valueAccessor = this;
            this.inputControl = ngControl;
        }
        _form.register(this);
        // only listen to content scroll events if there is content
        if (_content) {
            this._scrollStart = _content.ionScrollStart.subscribe((ev) => {
                this.scrollHideFocus(ev, true);
            });
            this._scrollEnd = _content.ionScrollEnd.subscribe((ev) => {
                this.scrollHideFocus(ev, false);
            });
        }
    }
    scrollHideFocus(ev, shouldHideFocus) {
        // do not continue if there's no nav, or it's transitioning
        if (!this._nav)
            return;
        // DOM READ: check if this input has focus
        if (this.hasFocus()) {
            // if it does have focus, then do the dom write
            this._dom.write(() => {
                this._native.hideFocus(shouldHideFocus);
            });
        }
    }
    setItemInputControlCss() {
        let item = this._item;
        let nativeInput = this._native;
        let inputControl = this.inputControl;
        // Set the control classes on the item
        if (item && inputControl) {
            this.setControlCss(item, inputControl);
        }
        // Set the control classes on the native input
        if (nativeInput && inputControl) {
            this.setControlCss(nativeInput, inputControl);
        }
    }
    setControlCss(element, control) {
        element.setElementClass('ng-untouched', control.untouched);
        element.setElementClass('ng-touched', control.touched);
        element.setElementClass('ng-pristine', control.pristine);
        element.setElementClass('ng-dirty', control.dirty);
        element.setElementClass('ng-valid', control.valid);
        element.setElementClass('ng-invalid', !control.valid);
    }
    setValue(val) {
        this._value = val;
        this.checkHasValue(val);
    }
    setType(val) {
        this._type = 'text';
        if (val) {
            val = val.toLowerCase();
            if (/password|email|number|search|tel|url|date|month|time|week/.test(val)) {
                this._type = val;
            }
        }
    }
    setDisabled(val) {
        this._disabled = isTrueProperty(val);
        this._item && this._item.setElementClass('item-input-disabled', this._disabled);
        this._native && this._native.isDisabled(this._disabled);
    }
    setClearOnEdit(val) {
        this._clearOnEdit = isTrueProperty(val);
    }
    /**
    * Check if we need to clear the text input if clearOnEdit is enabled
    * @private
    */
    checkClearOnEdit(inputValue) {
        if (!this._clearOnEdit) {
            return;
        }
        // Did the input value change after it was blurred and edited?
        if (this._didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.clearTextInput();
        }
        // Reset the flag
        this._didBlurAfterEdit = false;
    }
    /**
     * Overriden in child input
     * @private
     */
    clearTextInput() { }
    /**
     * @private
     */
    setNativeInput(nativeInput) {
        this._native = nativeInput;
        if (this._item && this._item.labelId !== null) {
            nativeInput.labelledBy(this._item.labelId);
        }
        nativeInput.valueChange.subscribe((inputValue) => {
            this.onChange(inputValue);
        });
        nativeInput.keydown.subscribe((inputValue) => {
            this.onKeydown(inputValue);
        });
        this.focusChange(this.hasFocus());
        nativeInput.focusChange.subscribe((textInputHasFocus) => {
            this.focusChange(textInputHasFocus);
            this.checkHasValue(nativeInput.getValue());
            if (!textInputHasFocus) {
                this.onTouched(textInputHasFocus);
            }
        });
        this.checkHasValue(nativeInput.getValue());
        this.setDisabled(this._disabled);
        var ionInputEle = this._elementRef.nativeElement;
        let nativeInputEle = nativeInput.element();
        // copy ion-input attributes to the native input element
        copyInputAttributes(ionInputEle, nativeInputEle);
        if (ionInputEle.hasAttribute('autofocus')) {
            // the ion-input element has the autofocus attributes
            ionInputEle.removeAttribute('autofocus');
            if (this._autoFocusAssist === 'immediate') {
                // config says to immediate focus on the input
                // works best on android devices
                nativeInputEle.focus();
            }
            else if (this._autoFocusAssist === 'delay') {
                // config says to chill out a bit and focus on the input after transitions
                // works best on desktop
                setTimeout(() => {
                    nativeInputEle.focus();
                }, 650);
            }
        }
        // by default set autocomplete="off" unless specified by the input
        if (ionInputEle.hasAttribute('autocomplete')) {
            this._autoComplete = ionInputEle.getAttribute('autocomplete');
        }
        nativeInputEle.setAttribute('autocomplete', this._autoComplete);
        // by default set autocorrect="off" unless specified by the input
        if (ionInputEle.hasAttribute('autocorrect')) {
            this._autoCorrect = ionInputEle.getAttribute('autocorrect');
        }
        nativeInputEle.setAttribute('autocorrect', this._autoCorrect);
    }
    /**
     * @private
     */
    setNextInput(nextInput) {
        if (nextInput) {
            nextInput.focused.subscribe(() => {
                this._form.tabFocus(this);
            });
        }
    }
    /**
     * @private
     * Angular2 Forms API method called by the model (Control) on change to update
     * the checked value.
     * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
     */
    writeValue(val) {
        this._value = val;
        this.checkHasValue(val);
    }
    /**
     * @private
     */
    onChange(val) {
        this.checkHasValue(val);
    }
    /**
     * onKeydown handler for clearOnEdit
     * @private
     */
    onKeydown(val) {
        if (this._clearOnEdit) {
            this.checkClearOnEdit(val);
        }
    }
    /**
     * @private
     */
    onTouched(val) { }
    /**
     * @private
     */
    hasFocus() {
        // check if an input has focus or not
        return this._native.hasFocus();
    }
    /**
     * @private
     */
    hasValue() {
        let inputValue = this._value;
        return (inputValue !== null && inputValue !== undefined && inputValue !== '');
    }
    /**
     * @private
     */
    checkHasValue(inputValue) {
        if (this._item) {
            let hasValue = (inputValue !== null && inputValue !== undefined && inputValue !== '');
            this._item.setElementClass('input-has-value', hasValue);
        }
    }
    /**
     * @private
     */
    focusChange(inputHasFocus) {
        if (this._item) {
            (void 0) /* console.debug */;
            this._item.setElementClass('input-has-focus', inputHasFocus);
        }
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this._clearOnEdit && !inputHasFocus && this.hasValue()) {
            this._didBlurAfterEdit = true;
        }
    }
    pointerStart(ev) {
        // input cover touchstart
        if (ev.type === 'touchstart') {
            this._isTouch = true;
        }
        if ((this._isTouch || (!this._isTouch && ev.type === 'mousedown')) && this._app.isEnabled()) {
            // remember where the touchstart/mousedown started
            this._coord = pointerCoord(ev);
        }
        (void 0) /* console.debug */;
    }
    pointerEnd(ev) {
        // input cover touchend/mouseup
        (void 0) /* console.debug */;
        if ((this._isTouch && ev.type === 'mouseup') || !this._app.isEnabled()) {
            // the app is actively doing something right now
            // don't try to scroll in the input
            ev.preventDefault();
            ev.stopPropagation();
        }
        else if (this._coord) {
            // get where the touchend/mouseup ended
            let endCoord = pointerCoord(ev);
            // focus this input if the pointer hasn't moved XX pixels
            // and the input doesn't already have focus
            if (!hasPointerMoved(8, this._coord, endCoord) && !this.hasFocus()) {
                ev.preventDefault();
                ev.stopPropagation();
                // begin the input focus process
                this.initFocus();
            }
        }
        this._coord = null;
    }
    /**
     * @private
     */
    initFocus() {
        // begin the process of setting focus to the inner input element
        const content = this._content;
        (void 0) /* console.debug */;
        if (content) {
            // this input is inside of a scroll view
            // find out if text input should be manually scrolled into view
            // get container of this input, probably an ion-item a few nodes up
            let ele = this._elementRef.nativeElement;
            ele = ele.closest('ion-item,[ion-item]') || ele;
            const scrollData = getScrollData(ele.offsetTop, ele.offsetHeight, content.getContentDimensions(), this._keyboardHeight, this._platform.height());
            if (Math.abs(scrollData.scrollAmount) < 4) {
                // the text input is in a safe position that doesn't
                // require it to be scrolled into view, just set focus now
                this.setFocus();
                // all good, allow clicks again
                this._app.setEnabled(true);
                this._nav && this._nav.setTransitioning(false);
                if (this._usePadding) {
                    content.clearScrollPaddingFocusOut();
                }
                return;
            }
            if (this._usePadding) {
                // add padding to the bottom of the scroll view (if needed)
                content.addScrollPadding(scrollData.scrollPadding);
            }
            // manually scroll the text input to the top
            // do not allow any clicks while it's scrolling
            const scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
            this._app.setEnabled(false, scrollDuration);
            this._nav && this._nav.setTransitioning(true);
            // temporarily move the focus to the focus holder so the browser
            // doesn't freak out while it's trying to get the input in place
            // at this point the native text input still does not have focus
            this._native.beginFocus(true, scrollData.inputSafeY);
            // scroll the input into place
            content.scrollTo(0, scrollData.scrollTo, scrollDuration, () => {
                (void 0) /* console.debug */;
                // the scroll view is in the correct position now
                // give the native text input focus
                this._native.beginFocus(false, 0);
                // ensure this is the focused input
                this.setFocus();
                // all good, allow clicks again
                this._app.setEnabled(true);
                this._nav && this._nav.setTransitioning(false);
                if (this._usePadding) {
                    content.clearScrollPaddingFocusOut();
                }
            });
        }
        else {
            // not inside of a scroll view, just focus it
            this.setFocus();
        }
    }
    /**
     * @private
     */
    setFocus() {
        // immediately set focus
        this._form.setAsFocused(this);
        // set focus on the actual input element
        (void 0) /* console.debug */;
        this._native.setFocus();
        // ensure the body hasn't scrolled down
        document.body.scrollTop = 0;
    }
    /**
     * @private
     * Angular2 Forms API method called by the view (formControlName) to register the
     * onChange event handler that updates the model (Control).
     * @param {Function} fn  the onChange event handler.
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @private
     * Angular2 Forms API method called by the view (formControlName) to register
     * the onTouched event handler that marks model (Control) as touched.
     * @param {Function} fn  onTouched event handler.
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    focusNext() {
        this._form.tabFocus(this);
    }
}
/** @nocollapse */
InputBase.ctorParameters = [
    { type: Config, },
    { type: Form, },
    { type: Item, },
    { type: App, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Content, decorators: [{ type: Optional },] },
    { type: NavController, },
    { type: NgControl, },
    { type: DomController, },
];
/**
 * @private
 */
export function getScrollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, keyboardHeight, plaformHeight) {
    // compute input's Y values relative to the body
    let inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
    let inputBottom = (inputTop + inputOffsetHeight);
    // compute the safe area which is the viewable content area when the soft keyboard is up
    let safeAreaTop = scrollViewDimensions.contentTop;
    let safeAreaHeight = (plaformHeight - keyboardHeight - safeAreaTop) / 2;
    let safeAreaBottom = safeAreaTop + safeAreaHeight;
    // figure out if each edge of teh input is within the safe area
    let inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
    let inputTopAboveSafeArea = (inputTop < safeAreaTop);
    let inputTopBelowSafeArea = (inputTop > safeAreaBottom);
    let inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
    let inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);
    /*
    Text Input Scroll To Scenarios
    ---------------------------------------
    1) Input top within safe area, bottom within safe area
    2) Input top within safe area, bottom below safe area, room to scroll
    3) Input top above safe area, bottom within safe area, room to scroll
    4) Input top below safe area, no room to scroll, input smaller than safe area
    5) Input top within safe area, bottom below safe area, no room to scroll, input smaller than safe area
    6) Input top within safe area, bottom below safe area, no room to scroll, input larger than safe area
    7) Input top below safe area, no room to scroll, input larger than safe area
    */
    const scrollData = {
        scrollAmount: 0,
        scrollTo: 0,
        scrollPadding: 0,
        inputSafeY: 0
    };
    if (inputTopWithinSafeArea && inputBottomWithinSafeArea) {
        // Input top within safe area, bottom within safe area
        // no need to scroll to a position, it's good as-is
        return scrollData;
    }
    // looks like we'll have to do some auto-scrolling
    if (inputTopBelowSafeArea || inputBottomBelowSafeArea || inputTopAboveSafeArea) {
        // Input top or bottom below safe area
        // auto scroll the input up so at least the top of it shows
        if (safeAreaHeight > inputOffsetHeight) {
            // safe area height is taller than the input height, so we
            // can bring up the input just enough to show the input bottom
            scrollData.scrollAmount = Math.round(safeAreaBottom - inputBottom);
        }
        else {
            // safe area height is smaller than the input height, so we can
            // only scroll it up so the input top is at the top of the safe area
            // however the input bottom will be below the safe area
            scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);
        }
        scrollData.inputSafeY = -(inputTop - safeAreaTop) + 4;
        if (inputTopAboveSafeArea && scrollData.scrollAmount > inputOffsetHeight) {
            // the input top is above the safe area and we're already scrolling it into place
            // don't let it scroll more than the height of the input
            scrollData.scrollAmount = inputOffsetHeight;
        }
    }
    // figure out where it should scroll to for the best position to the input
    scrollData.scrollTo = (scrollViewDimensions.scrollTop - scrollData.scrollAmount);
    // when auto-scrolling, there also needs to be enough
    // content padding at the bottom of the scroll view
    // always add scroll padding when a text input has focus
    // this allows for the content to scroll above of the keyboard
    // content behind the keyboard would be blank
    // some cases may not need it, but when jumping around it's best
    // to have the padding already rendered so there's no jank
    scrollData.scrollPadding = keyboardHeight;
    // var safeAreaEle: HTMLElement = (<any>window).safeAreaEle;
    // if (!safeAreaEle) {
    //   safeAreaEle = (<any>window).safeAreaEle  = document.createElement('div');
    //   safeAreaEle.style.cssText = 'position:absolute; padding:1px 5px; left:0; right:0; font-weight:bold; font-size:10px; font-family:Courier; text-align:right; background:rgba(0, 128, 0, 0.8); text-shadow:1px 1px white; pointer-events:none;';
    //   document.body.appendChild(safeAreaEle);
    // }
    // safeAreaEle.style.top = safeAreaTop + 'px';
    // safeAreaEle.style.height = safeAreaHeight + 'px';
    // safeAreaEle.innerHTML = `
    //   <div>scrollTo: ${scrollData.scrollTo}</div>
    //   <div>scrollAmount: ${scrollData.scrollAmount}</div>
    //   <div>scrollPadding: ${scrollData.scrollPadding}</div>
    //   <div>inputSafeY: ${scrollData.inputSafeY}</div>
    //   <div>scrollHeight: ${scrollViewDimensions.scrollHeight}</div>
    //   <div>scrollTop: ${scrollViewDimensions.scrollTop}</div>
    //   <div>contentHeight: ${scrollViewDimensions.contentHeight}</div>
    //   <div>plaformHeight: ${plaformHeight}</div>
    // `;
    return scrollData;
}
const SCROLL_ASSIST_SPEED = 0.3;
function getScrollAssistDuration(distanceToScroll) {
    distanceToScroll = Math.abs(distanceToScroll);
    let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
    return Math.min(400, Math.max(150, duration));
}
//# sourceMappingURL=input-base.js.map