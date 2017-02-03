import { GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/drag-gesture';
import { pointerCoord } from '../../util/dom';
/**
 * @private
 */
export class ToggleGesture extends PanGesture {
    constructor(toogle, gestureCtrl, domCtrl) {
        super(toogle.getNativeElement(), {
            threshold: 0,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_TOGGLE,
                priority: 30 /* Toggle */,
            })
        });
        this.toogle = toogle;
    }
    canStart(ev) {
        return true;
    }
    onDragStart(ev) {
        ev.preventDefault();
        this.toogle._onDragStart(pointerCoord(ev).x);
    }
    onDragMove(ev) {
        ev.preventDefault();
        this.toogle._onDragMove(pointerCoord(ev).x);
    }
    onDragEnd(ev) {
        ev.preventDefault();
        this.toogle._onDragEnd(pointerCoord(ev).x);
    }
}
//# sourceMappingURL=toggle-gesture.js.map