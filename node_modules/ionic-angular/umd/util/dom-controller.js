(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './dom', './util'], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Adopted from FastDom
     * https://github.com/wilsonpage/fastdom
     * MIT License
     */
    var dom_1 = require('./dom');
    var util_1 = require('./util');
    var DomDebouncer = (function () {
        function DomDebouncer(dom) {
            this.dom = dom;
            this.writeTask = null;
            this.readTask = null;
        }
        DomDebouncer.prototype.read = function (fn) {
            var _this = this;
            if (this.readTask) {
                return;
            }
            return this.readTask = this.dom.read(function (t) {
                _this.readTask = null;
                fn(t);
            });
        };
        DomDebouncer.prototype.write = function (fn, ctx) {
            var _this = this;
            if (this.writeTask) {
                return;
            }
            return this.writeTask = this.dom.write(function (t) {
                _this.writeTask = null;
                fn(t);
            });
        };
        DomDebouncer.prototype.cancel = function () {
            var writeTask = this.writeTask;
            writeTask && this.dom.cancelW(writeTask);
            this.writeTask = null;
            var readTask = this.readTask;
            readTask && this.dom.cancelR(readTask);
            this.readTask = null;
        };
        return DomDebouncer;
    }());
    exports.DomDebouncer = DomDebouncer;
    var DomController = (function () {
        function DomController() {
            this.r = [];
            this.w = [];
        }
        DomController.prototype.debouncer = function () {
            return new DomDebouncer(this);
        };
        DomController.prototype.read = function (fn, ctx) {
            var task = !ctx ? fn : fn.bind(ctx);
            this.r.push(task);
            this.queue();
            return task;
        };
        DomController.prototype.write = function (fn, ctx) {
            var task = !ctx ? fn : fn.bind(ctx);
            this.w.push(task);
            this.queue();
            return task;
        };
        DomController.prototype.cancel = function (task) {
            return util_1.removeArrayItem(this.r, task) || util_1.removeArrayItem(this.w, task);
        };
        DomController.prototype.cancelW = function (task) {
            return util_1.removeArrayItem(this.w, task);
        };
        DomController.prototype.cancelR = function (task) {
            return util_1.removeArrayItem(this.r, task);
        };
        DomController.prototype.queue = function () {
            var self = this;
            if (!self.q) {
                self.q = true;
                dom_1.nativeRaf(function rafCallback(timeStamp) {
                    self.flush(timeStamp);
                });
            }
        };
        DomController.prototype.flush = function (timeStamp) {
            var err;
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
        };
        return DomController;
    }());
    exports.DomController = DomController;
    function dispatch(timeStamp, r, w) {
        var task;
        // ******** DOM READS ****************
        while (task = r.shift()) {
            task(timeStamp);
        }
        // ******** DOM WRITES ****************
        while (task = w.shift()) {
            task(timeStamp);
        }
    }
});
//# sourceMappingURL=dom-controller.js.map