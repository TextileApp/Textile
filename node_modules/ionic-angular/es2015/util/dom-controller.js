import { nativeRaf } from './dom';
import { removeArrayItem } from './util';
export class DomDebouncer {
    constructor(dom) {
        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    read(fn) {
        if (this.readTask) {
            return;
        }
        return this.readTask = this.dom.read((t) => {
            this.readTask = null;
            fn(t);
        });
    }
    write(fn, ctx) {
        if (this.writeTask) {
            return;
        }
        return this.writeTask = this.dom.write((t) => {
            this.writeTask = null;
            fn(t);
        });
    }
    cancel() {
        const writeTask = this.writeTask;
        writeTask && this.dom.cancelW(writeTask);
        this.writeTask = null;
        const readTask = this.readTask;
        readTask && this.dom.cancelR(readTask);
        this.readTask = null;
    }
}
export class DomController {
    constructor() {
        this.r = [];
        this.w = [];
    }
    debouncer() {
        return new DomDebouncer(this);
    }
    read(fn, ctx) {
        const task = !ctx ? fn : fn.bind(ctx);
        this.r.push(task);
        this.queue();
        return task;
    }
    write(fn, ctx) {
        const task = !ctx ? fn : fn.bind(ctx);
        this.w.push(task);
        this.queue();
        return task;
    }
    cancel(task) {
        return removeArrayItem(this.r, task) || removeArrayItem(this.w, task);
    }
    cancelW(task) {
        return removeArrayItem(this.w, task);
    }
    cancelR(task) {
        return removeArrayItem(this.r, task);
    }
    queue() {
        const self = this;
        if (!self.q) {
            self.q = true;
            nativeRaf(function rafCallback(timeStamp) {
                self.flush(timeStamp);
            });
        }
    }
    flush(timeStamp) {
        let err;
        try {
            dispatch(timeStamp, this.r, this.w);
        }
        catch (e) {
            err = e;
        }
        this.q = false;
        if (this.r.length || this.w.length) {
            this.queue();
        }
        if (err) {
            throw err;
        }
    }
}
function dispatch(timeStamp, r, w) {
    let task;
    // ******** DOM READS ****************
    while (task = r.shift()) {
        task(timeStamp);
    }
    // ******** DOM WRITES ****************
    while (task = w.shift()) {
        task(timeStamp);
    }
}
//# sourceMappingURL=dom-controller.js.map