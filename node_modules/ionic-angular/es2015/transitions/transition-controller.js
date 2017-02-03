import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { isPresent } from '../util/util';
import { createTransition } from './transition-registry';
/**
 * @private
 */
export class TransitionController {
    constructor(_config) {
        this._config = _config;
        this._ids = 0;
        this._trns = {};
    }
    getRootTrnsId(nav) {
        let parent = nav.parent;
        while (parent) {
            if (isPresent(parent._trnsId)) {
                return parent._trnsId;
            }
            parent = parent.parent;
        }
        return null;
    }
    nextId() {
        return this._ids++;
    }
    get(trnsId, enteringView, leavingView, opts) {
        const trns = createTransition(this._config, opts.animation, enteringView, leavingView, opts);
        trns.trnsId = trnsId;
        if (!this._trns[trnsId]) {
            // we haven't created the root transition yet
            this._trns[trnsId] = trns;
        }
        else {
            // we already have a root transition created
            // add this new transition as a child to the root
            this._trns[trnsId].add(trns);
        }
        return trns;
    }
    destroy(trnsId) {
        if (this._trns[trnsId]) {
            this._trns[trnsId].destroy();
            delete this._trns[trnsId];
        }
    }
}
TransitionController.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TransitionController.ctorParameters = [
    { type: Config, },
];
//# sourceMappingURL=transition-controller.js.map