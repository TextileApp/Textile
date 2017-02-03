import { Directive, ElementRef, forwardRef, Inject, Renderer } from '@angular/core';
import { App } from '../components/app/app';
import { clearNativeTimeout, nativeTimeout } from './dom';
import { Config } from '../config/config';
/**
 * @private
 */
export class ClickBlock {
    constructor(app, config, elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._showing = false;
        app._clickBlock = this;
        const enabled = this.isEnabled = config.getBoolean('clickBlock', true);
        if (enabled) {
            this._setElementClass('click-block-enabled', true);
        }
    }
    activate(shouldShow, expire = 100) {
        if (this.isEnabled) {
            clearNativeTimeout(this._tmr);
            if (shouldShow) {
                this._activate(true);
            }
            this._tmr = nativeTimeout(this._activate.bind(this, false), expire);
        }
    }
    /** @internal */
    _activate(shouldShow) {
        if (this._showing !== shouldShow) {
            this._setElementClass('click-block-active', shouldShow);
            this._showing = shouldShow;
        }
    }
    _setElementClass(className, add) {
        this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
    }
}
ClickBlock.decorators = [
    { type: Directive, args: [{
                selector: '.click-block'
            },] },
];
/** @nocollapse */
ClickBlock.ctorParameters = [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=click-block.js.map