(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.emitter = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.Promise = Promise;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var noop = function noop() {
    return false;
  };

  var defaultMaxListeners = 10;

  var EventEmitter = (function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this._events = this._events || {};
      this._maxListeners = this._maxListeners || defaultMaxListeners;
    }

    _createClass(EventEmitter, [{
      key: 'setMaxListeners',
      value: function setMaxListeners(n) {
        if (typeof n !== 'number' || n < 0) throw TypeError('n must be a positive number');
        this._maxListeners = n;
      }
    }, {
      key: 'emit',
      value: function emit(type) {
        var er, handler, len, args, i, listeners;

        if (!this._events) this._events = {};

        // If there is no 'error' event listener then throw.
        if (type === 'error') {
          if (!this._events.error || typeof this._events.error === 'object' && !this._events.error.length) {
            er = arguments[1];
            if (this.domain) {
              if (!er) er = new TypeError('Uncaught, unspecified "error" event.');
            } else if (er instanceof Error) {
              throw er; // Unhandled 'error' event
            } else {
                throw TypeError('Uncaught, unspecified "error" event.');
              }
            return false;
          }
        }

        handler = this._events[type];

        if (typeof handler === 'undefined') return false;

        if (typeof handler === 'function') {
          switch (arguments.length) {
            // fast cases
            case 1:
              handler.call(this);
              break;
            case 2:
              handler.call(this, arguments[1]);
              break;
            case 3:
              handler.call(this, arguments[1], arguments[2]);
              break;
            // slower
            default:
              len = arguments.length;
              args = new Array(len - 1);
              for (i = 1; i < len; i++) args[i - 1] = arguments[i];
              handler.apply(this, args);
          }
        } else if (typeof handler === 'object') {
          len = arguments.length;
          args = new Array(len - 1);
          for (i = 1; i < len; i++) args[i - 1] = arguments[i];

          listeners = handler.slice();
          len = listeners.length;
          for (i = 0; i < len; i++) listeners[i].apply(this, args);
        }

        return true;
      }
    }, {
      key: 'addListener',
      value: function addListener(type, listener) {
        var m;

        if (typeof listener !== 'function') throw TypeError('listener must be a function');

        if (!this._events) this._events = {};

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener) this.emit('newListener', type, typeof listener.listener === 'function' ? listener.listener : listener);

        if (!this._events[type])
          // Optimize the case of one listener. Don't need the extra array object.
          this._events[type] = listener;else if (typeof this._events[type] === 'object')
          // If we've already got an array, just append.
          this._events[type].push(listener);else
          // Adding the second element, need to change to array.
          this._events[type] = [this._events[type], listener];

        // Check for listener leak
        if (typeof this._events[type] === 'object' && !this._events[type].warned) {
          m = this._maxListeners;
          if (m && m > 0 && this._events[type].length > m) {
            this._events[type].warned = true;
            console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
            console.trace();
          }
        }

        return this;
      }
    }, {
      key: 'on',
      value: function on() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.addListener.apply(this, args);
      }
    }, {
      key: 'once',
      value: function once(type, listener) {
        if (typeof listener !== 'function') throw TypeError('listener must be a function');

        function g() {
          this.removeListener(type, g);
          listener.apply(this, arguments);
        }

        g.listener = listener;
        this.on(type, g);

        return this;
      }
    }, {
      key: 'removeListener',
      value: function removeListener(type, listener) {
        var list, position, length, i;

        if (typeof listener !== 'function') throw TypeError('listener must be a function');

        if (!this._events || !this._events[type]) return this;

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener || typeof list.listener === 'function' && list.listener === listener) {
          this._events[type] = undefined;
          if (this._events.removeListener) this.emit('removeListener', type, listener);
        } else if (typeof list === 'object') {
          for (i = length; i-- > 0;) {
            if (list[i] === listener || list[i].listener && list[i].listener === listener) {
              position = i;
              break;
            }
          }

          if (position < 0) return this;

          if (list.length === 1) {
            list.length = 0;
            this._events[type] = undefined;
          } else {
            list.splice(position, 1);
          }

          if (this._events.removeListener) this.emit('removeListener', type, listener);
        }

        return this;
      }
    }, {
      key: 'removeAllListeners',
      value: function removeAllListeners(type) {
        var key, listeners;

        if (!this._events) return this;

        // not listening for removeListener, no need to emit
        if (!this._events.removeListener) {
          if (arguments.length === 0) this._events = {};else if (this._events[type]) this._events[type] = undefined;
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(this._events);

          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = {};
          return this;
        }

        listeners = this._events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else {
          // LIFO order
          while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
        }
        this._events[type] = undefined;

        return this;
      }
    }, {
      key: 'listeners',
      value: function listeners(type) {
        var ret;
        if (!this._events || !this._events[type]) ret = [];else if (typeof this._events[type] === 'function') ret = [this._events[type]];else ret = this._events[type].slice();
        return ret;
      }
    }], [{
      key: 'listenerCount',
      value: function listenerCount(emitter, type) {
        var ret;
        if (!emitter._events || !emitter._events[type]) ret = 0;else if (typeof emitter._events[type] === 'function') ret = 1;else ret = emitter._events[type].length;
        return ret;
      }
    }, {
      key: 'inherits',
      value: function inherits(ctor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    }, {
      key: 'extend',
      value: function extend(target) {
        return _extend(target, new EventEmitter(), EventEmitter.prototype);
      }
    }]);

    return EventEmitter;
  })();

  exports.EventEmitter = EventEmitter;

  function _extend(target) {
    for (var _len2 = arguments.length, objs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      objs[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0, l = objs.length; i < l; i++) {
      var keys = Object.getOwnPropertyNames(objs[i] || {});

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          target[key] = objs[i][key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return target;
  }

  var _Promise = (function () {
    function _Promise() {
      var resolver = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

      _classCallCheck(this, _Promise);

      this._settled = false;
      this._success = false;
      this._args = [];
      this._callbacks = [];
      this._onReject = noop;

      resolver(this.resolve.bind(this), this.reject.bind(this));
    }

    _createClass(_Promise, [{
      key: 'then',
      value: function then(onResolve) {
        var _this = this;

        var onReject = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

        var promise = new _Promise();

        this._onReject = onReject;
        this._callbacks.push(function () {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          var ret = onResolve.apply(_this, args);

          if (ret && typeof ret.then == 'function') {
            ret.then(promise.resolve.bind(promise), promise.reject.bind(promise));
          }
        });

        if (this._settled) {
          if (this._success) {
            this.resolve.apply(this, this._args);
          } else {
            this.onReject.apply(this, this._args);
          }
        }

        return promise;
      }
    }, {
      key: 'catch',
      value: function _catch(onReject) {
        this._onReject = onReject;

        return this;
      }
    }, {
      key: 'resolve',
      value: function resolve() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        try {
          for (var _iterator2 = this._callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var handler = _step2.value;

            handler.apply(this, args);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this._args = args;
        this._settled = true;
        this._success = true;
      }
    }, {
      key: 'reject',
      value: function reject() {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        this._onReject.apply(this, args);

        this._args = args;
        this._settled = true;
      }
    }]);

    return _Promise;
  })();

  var nativePromise = ('undefined' !== typeof global ? global : window).Promise || null;

  function Promise(resolver) {
    var promise = null;
    var resolve = noop;
    var reject = noop;
    resolver = resolver || noop;

    if (nativePromise) {
      promise = new nativePromise(function (_1, _2) {
        resolve = _1;
        reject = _2;

        resolver(_1, _2);
      });
      promise.resolve = function () {
        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        resolve.apply(promise, args);
      };
      promise.reject = function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        reject.apply(promise, args);
      };
    } else {
      promise = new _Promise(resolver);
    }

    return promise;
  }
});
//# sourceMappingURL=maps/emitter.js.map
