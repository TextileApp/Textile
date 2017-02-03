import { Injectable, NgZone } from '@angular/core';
import { Activator } from './activator';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { hasPointerMoved, pointerCoord } from '../../util/dom';
import { RippleActivator } from './ripple';
import { UIEventManager } from '../../util/ui-event-manager';
import { GestureController } from '../../gestures/gesture-controller';
/**
 * @private
 */
export class TapClick {
    constructor(config, app, zone, gestureCtrl) {
        this.app = app;
        this.gestureCtrl = gestureCtrl;
        this.disableClick = 0;
        this.events = new UIEventManager(false);
        let activator = config.get('activator');
        if (activator === 'ripple') {
            this.activator = new RippleActivator(app, config);
        }
        else if (activator === 'highlight') {
            this.activator = new Activator(app, config);
        }
        this.usePolyfill = config.getBoolean('tapPolyfill');
        (void 0) /* console.debug */;
        this.events.listen(document, 'click', this.click.bind(this), true);
        this.pointerEvents = this.events.pointerEvents({
            element: document,
            pointerDown: this.pointerStart.bind(this),
            pointerMove: this.pointerMove.bind(this),
            pointerUp: this.pointerEnd.bind(this),
            passive: true
        });
        this.pointerEvents.mouseWait = DISABLE_NATIVE_CLICK_AMOUNT;
    }
    pointerStart(ev) {
        if (this.startCoord) {
            return false;
        }
        if (!this.app.isEnabled()) {
            return false;
        }
        this.lastTouchEnd = 0;
        this.dispatchClick = true;
        let activatableEle = getActivatableTarget(ev.target);
        if (!activatableEle) {
            this.startCoord = null;
            return false;
        }
        this.startCoord = pointerCoord(ev);
        this.activator && this.activator.downAction(ev, activatableEle, this.startCoord);
        return true;
    }
    pointerMove(ev) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        if (this.shouldCancelEvent(ev)) {
            this.pointerCancel(ev);
        }
    }
    pointerEnd(ev, type) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        (void 0) /* runInDev */;
        if (!this.startCoord) {
            return;
        }
        if (this.activator) {
            let activatableEle = getActivatableTarget(ev.target);
            if (activatableEle) {
                this.activator.upAction(ev, activatableEle, this.startCoord);
            }
        }
        if (this.usePolyfill && type === 2 /* TOUCH */ && this.app.isEnabled()) {
            this.handleTapPolyfill(ev);
        }
        this.startCoord = null;
    }
    pointerCancel(ev) {
        (void 0) /* console.debug */;
        this.startCoord = null;
        this.dispatchClick = false;
        this.activator && this.activator.clearState(false);
        this.pointerEvents.stop();
    }
    shouldCancelEvent(ev) {
        return (this.app.isScrolling() ||
            this.gestureCtrl.isCaptured() ||
            hasPointerMoved(POINTER_TOLERANCE, this.startCoord, pointerCoord(ev)));
    }
    click(ev) {
        if (this.shouldCancelClick(ev)) {
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }
        if (this.activator) {
            // cool, a click is gonna happen, let's tell the activator
            // so the element can get the given "active" style
            const activatableEle = getActivatableTarget(ev.target);
            if (activatableEle) {
                this.activator.clickAction(ev, activatableEle, this.startCoord);
            }
        }
        (void 0) /* runInDev */;
    }
    shouldCancelClick(ev) {
        if (this.usePolyfill) {
            if (!ev.isIonicTap && this.isDisabledNativeClick()) {
                (void 0) /* console.debug */;
                return true;
            }
        }
        else if (!this.dispatchClick) {
            (void 0) /* console.debug */;
            return true;
        }
        if (!this.app.isEnabled()) {
            (void 0) /* console.debug */;
            return true;
        }
        if (this.gestureCtrl.isCaptured()) {
            (void 0) /* console.debug */;
            return true;
        }
        return false;
    }
    profileClickDelay(ev) {
        if (this.lastTouchEnd) {
            let diff = Date.now() - this.lastTouchEnd;
            if (diff < 100) {
                (void 0) /* console.debug */;
            }
            else {
                console.warn(`SLOW click dispatched. Delay(ms):`, diff, ev);
            }
            this.lastTouchEnd = null;
        }
        else {
            (void 0) /* console.debug */;
        }
    }
    handleTapPolyfill(ev) {
        (void 0) /* assert */;
        // only dispatch mouse click events from a touchend event
        // when tapPolyfill config is true, and the startCoordand endCoord
        // are not too far off from each other
        let endCoord = pointerCoord(ev);
        if (hasPointerMoved(POINTER_TOLERANCE, this.startCoord, endCoord)) {
            (void 0) /* console.debug */;
            return;
        }
        // prevent native mouse click events for XX amount of time
        this.disableClick = Date.now() + DISABLE_NATIVE_CLICK_AMOUNT;
        if (this.app.isScrolling()) {
            // do not fire off a click event while the app was scrolling
            (void 0) /* console.debug */;
        }
        else {
            // dispatch a mouse click event
            (void 0) /* console.debug */;
            let clickEvent = document.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
            clickEvent.isIonicTap = true;
            ev.target.dispatchEvent(clickEvent);
        }
    }
    isDisabledNativeClick() {
        return this.disableClick > Date.now();
    }
}
TapClick.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TapClick.ctorParameters = [
    { type: Config, },
    { type: App, },
    { type: NgZone, },
    { type: GestureController, },
];
function getActivatableTarget(ele) {
    let targetEle = ele;
    for (let x = 0; x < 10; x++) {
        if (!targetEle)
            break;
        if (isActivatable(targetEle))
            return targetEle;
        targetEle = targetEle.parentElement;
    }
    return null;
}
/**
 * @private
 */
export const isActivatable = function (ele) {
    if (ACTIVATABLE_ELEMENTS.indexOf(ele.tagName) > -1) {
        return true;
    }
    for (let i = 0, l = ACTIVATABLE_ATTRIBUTES.length; i < l; i++) {
        if (ele.hasAttribute(ACTIVATABLE_ATTRIBUTES[i])) {
            return true;
        }
    }
    return false;
};
const ACTIVATABLE_ELEMENTS = ['A', 'BUTTON'];
const ACTIVATABLE_ATTRIBUTES = ['tappable', 'ion-button'];
const POINTER_TOLERANCE = 100;
const DISABLE_NATIVE_CLICK_AMOUNT = 2500;
export function setupTapClick(config, app, zone, gestureCtrl) {
    return function () {
        return new TapClick(config, app, zone, gestureCtrl);
    };
}
//# sourceMappingURL=tap-click.js.map