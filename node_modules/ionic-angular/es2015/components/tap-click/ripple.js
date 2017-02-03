import { isActivatedDisabled } from './activator-base';
import { Activator } from './activator';
import { CSS, hasPointerMoved, pointerCoord, rafFrames } from '../../util/dom';
/**
 * @private
 */
export class RippleActivator {
    constructor(app, config) {
        this._queue = [];
        this._active = [];
        this.highlight = new Activator(app, config);
    }
    clickAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.clickAction(ev, activatableEle, startCoord);
        // Ripple
        this._clickAction(ev, activatableEle, startCoord);
    }
    downAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.downAction(ev, activatableEle, startCoord);
        // Ripple
        this._downAction(ev, activatableEle, startCoord);
    }
    upAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.upAction(ev, activatableEle, startCoord);
        // Ripple
        this._upAction(ev, activatableEle, startCoord);
    }
    clearState(animated) {
        // Highlight
        this.highlight && this.highlight.clearState(animated);
    }
    _downAction(ev, activatableEle, startCoord) {
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        this._active.push(activatableEle);
        var j = activatableEle.childElementCount;
        while (j--) {
            var rippleEle = activatableEle.children[j];
            if (rippleEle.classList.contains('button-effect')) {
                // DOM READ
                var clientRect = activatableEle.getBoundingClientRect();
                rippleEle.$top = clientRect.top;
                rippleEle.$left = clientRect.left;
                rippleEle.$width = clientRect.width;
                rippleEle.$height = clientRect.height;
                break;
            }
        }
    }
    _upAction(ev, activatableEle, startCoord) {
        if (!hasPointerMoved(6, startCoord, pointerCoord(ev))) {
            let i = activatableEle.childElementCount;
            while (i--) {
                var rippleEle = activatableEle.children[i];
                if (rippleEle.classList.contains('button-effect')) {
                    // DOM WRITE
                    this.startRippleEffect(rippleEle, activatableEle, startCoord);
                    break;
                }
            }
        }
    }
    _clickAction(ev, activatableEle, startCoord) {
        // NOTHING
    }
    startRippleEffect(rippleEle, activatableEle, startCoord) {
        if (!startCoord) {
            return;
        }
        let clientPointerX = (startCoord.x - rippleEle.$left);
        let clientPointerY = (startCoord.y - rippleEle.$top);
        let x = Math.max(Math.abs(rippleEle.$width - clientPointerX), clientPointerX) * 2;
        let y = Math.max(Math.abs(rippleEle.$height - clientPointerY), clientPointerY) * 2;
        let diameter = Math.min(Math.max(Math.hypot(x, y), 64), 240);
        if (activatableEle.hasAttribute('ion-item')) {
            diameter = Math.min(diameter, 140);
        }
        clientPointerX -= diameter / 2;
        clientPointerY -= diameter / 2;
        clientPointerX = Math.round(clientPointerX);
        clientPointerY = Math.round(clientPointerY);
        diameter = Math.round(diameter);
        // Reset ripple
        // DOM WRITE
        rippleEle.style.opacity = '';
        rippleEle.style[CSS.transform] = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(0.001)`;
        rippleEle.style[CSS.transition] = '';
        // Start ripple animation
        let radius = Math.sqrt(rippleEle.$width + rippleEle.$height);
        let scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5, 260);
        let opacityTransitionDuration = Math.round(scaleTransitionDuration * 0.7);
        let opacityTransitionDelay = Math.round(scaleTransitionDuration - opacityTransitionDuration);
        scaleTransitionDuration = Math.round(scaleTransitionDuration);
        let transform = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(1)`;
        let transition = `transform ${scaleTransitionDuration}ms,opacity ${opacityTransitionDuration}ms ${opacityTransitionDelay}ms`;
        rafFrames(2, () => {
            // DOM WRITE
            rippleEle.style.width = rippleEle.style.height = diameter + 'px';
            rippleEle.style.opacity = '0';
            rippleEle.style[CSS.transform] = transform;
            rippleEle.style[CSS.transition] = transition;
        });
    }
}
const TOUCH_DOWN_ACCEL = 300;
//# sourceMappingURL=ripple.js.map