import { ComponentFactoryResolver, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { TransitionController } from '../../transitions/transition-controller';
import { DomController } from '../../util/dom-controller';
/**
 * @private
 */
export class OverlayPortal extends NavControllerBase {
    constructor(app, config, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, viewPort, domCtrl) {
        super(null, app, config, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl);
        this._isPortal = true;
        this._init = true;
        this.setViewport(viewPort);
        // on every page change make sure the portal has
        // dismissed any views that should be auto dismissed on page change
        app.viewDidLeave.subscribe(this.dismissPageChangeViews.bind(this));
    }
    set _overlayPortal(val) {
        this._zIndexOffset = (val || 0);
    }
}
OverlayPortal.decorators = [
    { type: Directive, args: [{
                selector: '[overlay-portal]',
            },] },
];
/** @nocollapse */
OverlayPortal.ctorParameters = [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
    { type: Config, },
    { type: Keyboard, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer, },
    { type: ComponentFactoryResolver, },
    { type: GestureController, },
    { type: TransitionController, },
    { type: DeepLinker, decorators: [{ type: Optional },] },
    { type: ViewContainerRef, },
    { type: DomController, },
];
OverlayPortal.propDecorators = {
    '_overlayPortal': [{ type: Input, args: ['overlay-portal',] },],
};
//# sourceMappingURL=overlay-portal.js.map