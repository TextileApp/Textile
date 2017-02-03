(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../util/dom', './activator-base'], factory);
    }
})(function (require, exports) {
    "use strict";
    var dom_1 = require('../../util/dom');
    var activator_base_1 = require('./activator-base');
    var Activator = (function () {
        function Activator(app, config) {
            this.app = app;
            this._queue = [];
            this._active = [];
            this.activatedDelay = ADD_ACTIVATED_DEFERS;
            this.clearDelay = CLEAR_STATE_DEFERS;
            this._css = config.get('activatedClass') || 'activated';
        }
        Activator.prototype.clickAction = function (ev, activatableEle, startCoord) {
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
        };
        Activator.prototype.downAction = function (ev, activatableEle, startCoord) {
            var _this = this;
            // the user just pressed down
            if (activator_base_1.isActivatedDisabled(ev, activatableEle)) {
                return;
            }
            this.unscheduleClear();
            this.deactivate(true);
            // queue to have this element activated
            this._queue.push(activatableEle);
            this._activeRafDefer = dom_1.rafFrames(this.activatedDelay, function () {
                var activatableEle;
                for (var i = 0; i < _this._queue.length; i++) {
                    activatableEle = _this._queue[i];
                    _this._active.push(activatableEle);
                    activatableEle.classList.add(_this._css);
                }
                _this._queue.length = 0;
                _this._clearDeferred();
            });
        };
        // the user was pressing down, then just let up
        Activator.prototype.upAction = function (ev, activatableEle, startCoord) {
            this._scheduleClear();
        };
        Activator.prototype._scheduleClear = function () {
            var _this = this;
            if (this._clearRafDefer) {
                return;
            }
            this._clearRafDefer = dom_1.rafFrames(this.clearDelay, function () {
                _this.clearState(true);
                _this._clearRafDefer = null;
            });
        };
        Activator.prototype.unscheduleClear = function () {
            if (this._clearRafDefer) {
                this._clearRafDefer();
                this._clearRafDefer = null;
            }
        };
        // all states should return to normal
        Activator.prototype.clearState = function (animated) {
            var _this = this;
            if (!this.app.isEnabled()) {
                // the app is actively disabled, so don't bother deactivating anything.
                // this makes it easier on the GPU so it doesn't have to redraw any
                // buttons during a transition. This will retry in XX milliseconds.
                dom_1.nativeTimeout(function () {
                    _this.clearState(animated);
                }, 600);
            }
            else {
                // not actively transitioning, good to deactivate any elements
                this.deactivate(animated);
            }
        };
        // remove the active class from all active elements
        Activator.prototype.deactivate = function (animated) {
            this._clearDeferred();
            this._queue.length = 0;
            var ele;
            for (var i = 0; i < this._active.length; i++) {
                ele = this._active[i];
                ele.style[dom_1.CSS.transition] = animated ? '' : 'none';
                ele.classList.remove(this._css);
            }
            this._active.length = 0;
        };
        Activator.prototype._clearDeferred = function () {
            // Clear any active deferral
            if (this._activeRafDefer) {
                this._activeRafDefer();
                this._activeRafDefer = null;
            }
        };
        return Activator;
    }());
    exports.Activator = Activator;
    var ADD_ACTIVATED_DEFERS = 6;
    var CLEAR_STATE_DEFERS = 6;
});
//# sourceMappingURL=activator.js.map