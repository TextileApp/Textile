(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    /**
      * @private
      * @name Grid
      * @module ionic
      * @description
     */
    var Grid = (function () {
        function Grid() {
        }
        Grid.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-grid'
                    },] },
        ];
        /** @nocollapse */
        Grid.ctorParameters = [];
        return Grid;
    }());
    exports.Grid = Grid;
    /**
      * @private
      * @name Row
      * @module ionic
      * @description
     */
    var Row = (function () {
        function Row() {
        }
        Row.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-row'
                    },] },
        ];
        /** @nocollapse */
        Row.ctorParameters = [];
        return Row;
    }());
    exports.Row = Row;
    /**
      * @private
      * @name Column
      * @module ionic
      * @description
     */
    var Col = (function () {
        function Col() {
        }
        Col.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-col'
                    },] },
        ];
        /** @nocollapse */
        Col.ctorParameters = [];
        return Col;
    }());
    exports.Col = Col;
});
//# sourceMappingURL=grid.js.map