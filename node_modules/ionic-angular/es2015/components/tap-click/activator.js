import { CSS, nativeTimeout, rafFrames } from '../../util/dom';
import { isActivatedDisabled } from './activator-base';
export class Activator {
    constructor(app, config) {
        this.app = app;
        this._queue = [];
        this._active = [];
        this.activatedDelay = ADD_ACTIVATED_DEFERS;
        this.clearDelay = CLEAR_STATE_DEFERS;
        this._css = config.get('activatedClass') || 'activated';
    }
    clickAction(ev, activatableEle, startCoord) {
        // a click happened, so immediately deactive all activated elements
        this._scheduleClear();
        this._queue.length = 0;
        for (var i = 0; i < this._active.length; i++) {
            this._active[i].classList.remove(this._css);
        }
        this._active.length = 0;
        // then immediately activate this element
        if (activatableEle && activatableEle.parentNode) {
            this._active.push(activatableEle);
            activatableEle.classList.add(this._css);
        }
    }
    downAction(ev, activatableEle, startCoord) {
        // the user just pressed down
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        this.unscheduleClear();
        this.deactivate(true);
        // queue to have this element activated
        this._queue.push(activatableEle);
        this._activeRafDefer = rafFrames(this.activatedDelay, () => {
            let activatableEle;
            for (let i = 0; i < this._queue.length; i++) {
                activatableEle = this._queue[i];
                this._active.push(activatableEle);
                activatableEle.classList.add(this._css);
            }
            this._queue.length = 0;
            this._clearDeferred();
        });
    }
    // the user was pressing down, then just let up
    upAction(ev, activatableEle, startCoord) {
        this._scheduleClear();
    }
    _scheduleClear() {
        if (this._clearRafDefer) {
            return;
        }
        this._clearRafDefer = rafFrames(this.clearDelay, () => {
            this.clearState(true);
            this._clearRafDefer = null;
        });
    }
    unscheduleClear() {
        if (this._clearRafDefer) {
            this._clearRafDefer();
            this._clearRafDefer = null;
        }
    }
    // all states should return to normal
    clearState(animated) {
        if (!this.app.isEnabled()) {
            // the app is actively disabled, so don't bother deactivating anything.
            // this makes it easier on the GPU so it doesn't have to redraw any
            // buttons during a transition. This will retry in XX milliseconds.
            nativeTimeout(() => {
                this.clearState(animated);
            }, 600);
        }
        else {
            // not actively transitioning, good to deactivate any elements
            this.deactivate(animated);
        }
    }
    // remove the active class from all active elements
    deactivate(animated) {
        this._clearDeferred();
        this._queue.length = 0;
        let ele;
        for (var i = 0; i < this._active.length; i++) {
            ele = this._active[i];
            ele.style[CSS.transition] = animated ? '' : 'none';
            ele.classList.remove(this._css);
        }
        this._active.length = 0;
    }
    _clearDeferred() {
        // Clear any active deferral
        if (this._activeRafDefer) {
            this._activeRafDefer();
            this._activeRafDefer = null;
        }
    }
}
const ADD_ACTIVATED_DEFERS = 6;
const CLEAR_STATE_DEFERS = 6;
//# sourceMappingURL=activator.js.map