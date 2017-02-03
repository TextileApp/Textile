import { Directive, ElementRef } from '@angular/core';
import { CSS, rafFrames } from '../../util/dom';
/**
 * @private
 */
export class TabHighlight {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
    select(tab) {
        rafFrames(3, () => {
            const d = tab.btn.getDimensions();
            const ele = this._elementRef.nativeElement;
            ele.style[CSS.transform] = `translate3d(${d.left}px,0,0) scaleX(${d.width})`;
            if (!this._init) {
                this._init = true;
                rafFrames(6, () => {
                    ele.classList.add('animate');
                });
            }
        });
    }
}
TabHighlight.decorators = [
    { type: Directive, args: [{
                selector: '.tab-highlight'
            },] },
];
/** @nocollapse */
TabHighlight.ctorParameters = [
    { type: ElementRef, },
];
//# sourceMappingURL=tab-highlight.js.map