/**
 * contra.emitter - A sane event emitter component
 * @version v1.1.1
 * @link https://github.com/bevacqua/contra.emitter
 * @license MIT
 */
(function (Array) {
  'use strict';
  if (!Array.prototype.filter) {
    Array.prototype.filter = function (fn, ctx) {
      var f = [];
      this.forEach(function (v, i, t) {
        if (fn.call(ctx, v, i, t)) { f.push(v); }
      }, ctx);
      return f;
    };
  }
})(Array);
