'use strict';

exports.__esModule = true;
exports.IonicDBSocket = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.tryCatch = tryCatch;

var _AsyncSubject = require('rxjs/AsyncSubject');

var _BehaviorSubject = require('rxjs/BehaviorSubject');

var _WebSocketSubject2 = require('rxjs/observable/dom/WebSocketSubject');

var _Observable = require('rxjs/Observable');

var _Subscription = require('rxjs/Subscription');

require('rxjs/add/observable/merge');

require('rxjs/add/observable/timer');

require('rxjs/add/operator/filter');

require('rxjs/add/operator/first');

require('rxjs/add/operator/share');

require('rxjs/add/operator/ignoreElements');

require('rxjs/add/operator/concat');

require('rxjs/add/operator/takeWhile');

require('rxjs/add/operator/publish');

require('rxjs/add/operator/switchMap');

var _serialization = require('./serialization.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorObject = { e: undefined };

var tryCatchTarget = void 0;

function tryCatcher(t) {
  try {
    return tryCatchTarget.apply(t, arguments);
  } catch (e) {
    errorObject.e = e;
    return errorObject;
  }
}

function tryCatch(fn) {
  tryCatchTarget = fn;
  return tryCatcher;
};

var PROTOCOL_VERSION = 'ionicdb-v0';

// Before connecting the first time
var STATUS_UNCONNECTED = { type: 'unconnected' };
// After the websocket is opened and handshake is completed
var STATUS_CONNECTED = { type: 'connected' };
// After unconnected, maybe before or after connected. Any socket level error
var STATUS_ERROR = { type: 'error' };
// Occurs when the socket closes
var STATUS_DISCONNECTED = { type: 'disconnected' };
// Occurs when attempting to reconnect
var STATUS_RECONNECTING = { type: 'reconnecting' };

var ProtocolError = function (_Error) {
  (0, _inherits3.default)(ProtocolError, _Error);

  function ProtocolError(msg, errorCode) {
    (0, _classCallCheck3.default)(this, ProtocolError);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Error.call(this, msg));

    _this.errorCode = errorCode;
    return _this;
  }

  ProtocolError.prototype.toString = function toString() {
    return this.message + ' (Code: ' + this.errorCode + ')';
  };

  return ProtocolError;
}(Error);

// Wraps native websockets with a Subject, which is both an Subscriber
// and an Observable (it is bi-directional after all!). This version
// is based on the rxjs.observable.dom.WebSocketSubject implementation.


var IonicDBSocket = exports.IonicDBSocket = function (_WebSocketSubject) {
  (0, _inherits3.default)(IonicDBSocket, _WebSocketSubject);

  // Deserializes a message from a string. Overrides the version
  // implemented in WebSocketSubject
  IonicDBSocket.prototype.resultSelector = function resultSelector(e) {
    return (0, _serialization.deserialize)(JSON.parse(e.data));
  };

  // We're overriding the next defined in AnonymousSubject so we
  // always serialize the value. When this is called a message will be
  // sent over the socket to the server.


  IonicDBSocket.prototype.next = function next(value) {
    var request = JSON.stringify((0, _serialization.serialize)(value));
    _WebSocketSubject.prototype.next.call(this, request);
  };

  function IonicDBSocket() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        url = _ref.url,
        handshakeMaker = _ref.handshakeMaker,
        _ref$keepalive = _ref.keepalive,
        keepalive = _ref$keepalive === undefined ? 60 : _ref$keepalive,
        _ref$retry = _ref.retry,
        retry = _ref$retry === undefined ? 5 : _ref$retry,
        _ref$WebSocketCtor = _ref.WebSocketCtor,
        WebSocketCtor = _ref$WebSocketCtor === undefined ? WebSocket : _ref$WebSocketCtor;

    (0, _classCallCheck3.default)(this, IonicDBSocket);

    // Completes or errors based on handshake success. Buffers
    // handshake response for later subscribers (like a Promise)
    var _this2 = (0, _possibleConstructorReturn3.default)(this, _WebSocketSubject.call(this, {
      url: url,
      protocol: PROTOCOL_VERSION,
      WebSocketCtor: WebSocketCtor,
      openObserver: {
        next: function next() {
          return _this2.sendHandshake();
        }
      },
      closeObserver: {
        next: function next(e) {
          // If we didn't close cleanly we should reconnect
          // else we close up shop
          if (e.code !== 1000) {
            var reason = e.reason || 'Unexpected disconnect with error code ' + e.code + '.';
            console.error("Connection Failed: ", reason);
            if (_this2._autoreconnect) {
              console.error("Retrying in " + retry + " seconds.");
              _this2.status.next(STATUS_RECONNECTING);
              _this2.handshake = new _AsyncSubject.AsyncSubject();
              _this2._reconnecting = true;
              setTimeout(function () {
                if (_this2._autoreconnect) {
                  _this2.sendHandshake();
                } else {
                  _this2.status.next(STATUS_DISCONNECTED);
                  if (_this2._handshakeSub) {
                    _this2._handshakeSub.unsubscribe();
                    _this2._handshakeSub = null;
                  }
                }
              }, retry * 1000);
            } else {
              _this2.status.next(STATUS_DISCONNECTED);
              if (_this2._handshakeSub) {
                _this2._handshakeSub.unsubscribe();
                _this2._handshakeSub = null;
              }
            }
          } else {
            _this2.status.next(STATUS_DISCONNECTED);
            if (_this2._handshakeSub) {
              _this2._handshakeSub.unsubscribe();
              _this2._handshakeSub = null;
            }
          }
        }
      }
    }));

    _this2.handshake = new _AsyncSubject.AsyncSubject();
    _this2._handshakeMaker = handshakeMaker;
    _this2._handshakeSub = null;
    _this2._reconnecting = false;
    _this2._autoreconnect = true;

    _this2.keepalive = _Observable.Observable.timer(keepalive * 1000, keepalive * 1000).map(function (n) {
      return _this2.hzRequest({ type: 'keepalive' }).subscribe();
    }).publish();

    // This is used to emit status changes that others can hook into.
    _this2.status = new _BehaviorSubject.BehaviorSubject(STATUS_UNCONNECTED);
    // Keep track of subscribers so we's can decide when to
    // unsubscribe.
    _this2.requestCounter = 0;
    // A map from request_ids to an object with metadata about the
    // request. Eventually, this should allow re-sending requests when
    // reconnecting.
    _this2.activeRequests = new Map();
    _this2.activeSubscriptions = new Map();
    _this2._output.subscribe({
      // This emits if the entire socket errors (usually due to
      // failure to connect)
      error: function error() {
        _this2.status.next(STATUS_ERROR);
      }
    });
    return _this2;
  }

  IonicDBSocket.prototype.disconnect = function disconnect() {
    this._autoreconnect = false;
    for (var _iterator = this.activeSubscriptions.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var sub = _ref2;

      sub.complete();
    }
    this.complete();
    if (this._handshakeSub) {
      this._handshakeSub.unsubscribe();
      this._handshakeSub = null;
    }
  };

  IonicDBSocket.prototype.multiplex = function multiplex(subMsg, unsubMsg, messageFilter, state) {
    var _this3 = this;

    return new _Observable.Observable(function (observer) {
      // If we are reconnecting let everyone
      // down the line know so that they know
      // the changefeed is going to rebuild and
      // can respond appropriately
      if (state === STATUS_RECONNECTING) {
        observer.next({ state: state.type });
      }

      var result = tryCatch(subMsg)();
      if (result === errorObject) {
        observer.error(errorObject.e);
      } else {
        if (result.method) {
          _this3.next(result);
        } else {
          _this3.status.first(function (x) {
            return x === STATUS_CONNECTED;
          }).subscribe(function () {
            return _this3.next(result);
          });
        }
      }

      var subscription = _this3.subscribe(function (x) {
        var result = tryCatch(messageFilter)(x);
        if (result === errorObject) {
          observer.error(errorObject.e);
        } else if (result) {
          if (state.type === "keepalive" && x.state === "complete") {
            observer.complete();
          } else {
            observer.next(x);
          }
        }
      }, function (err) {
        // We need to eat errors here so that reconnect works
        // and the observers don't unsubscribe themselves
        // if the entire socket errors
      }, function () {
        return observer.complete();
      });

      return function () {
        var result = tryCatch(unsubMsg)();
        if (result === errorObject) {
          observer.error(errorObject.e);
        } else {
          _this3.next(result);
        }
        subscription.unsubscribe();
      };
    });
  };

  IonicDBSocket.prototype.deactivateRequest = function deactivateRequest(req) {
    var _this4 = this;

    return function () {
      _this4.activeRequests.delete(req.request_id);
      _this4.activeSubscriptions.delete(req.request_id);
      return { request_id: req.request_id, type: 'end_subscription' };
    };
  };

  IonicDBSocket.prototype.activateRequest = function activateRequest(req) {
    var _this5 = this;

    return function () {
      _this5.activeRequests.set(req.request_id, req);
      return req;
    };
  };

  IonicDBSocket.prototype.filterRequest = function filterRequest(req) {
    return function (resp) {
      return resp.request_id === req.request_id;
    };
  };

  IonicDBSocket.prototype.getRequest = function getRequest(request) {
    return Object.assign({ request_id: this.requestCounter++ }, request);
  };

  // This is a trimmed-down version of multiplex that only listens for
  // the handshake requestId. It also starts the keepalive observable
  // and cleans up after it when the handshake is cleaned up.


  IonicDBSocket.prototype.sendHandshake = function sendHandshake() {
    var _this6 = this;

    if (!this._handshakeSub || this._reconnecting) {
      (function () {
        var oldHandshakeSub = _this6._handshakeSub;
        var isReconnect = _this6._reconnecting;
        _this6._reconnecting = false;
        _this6._handshakeSub = _this6.makeRequest(_this6._handshakeMaker()).subscribe({
          next: function next(n) {
            if (n.error) {
              _this6.status.next(STATUS_ERROR);
              _this6.handshake.error(new ProtocolError(n.error, n.error_code));
            } else {
              _this6.status.next(STATUS_CONNECTED);
              _this6._autoreconnect = true; // Renable autoreconnect
              if (isReconnect) {
                for (var _iterator2 = _this6.activeSubscriptions.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                  var _ref3;

                  if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref3 = _iterator2[_i2++];
                  } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref3 = _i2.value;
                  }

                  var sub = _ref3;

                  sub.next(STATUS_RECONNECTING);
                }
              }
              _this6.handshake.next(n);
              _this6.handshake.complete();
            }
          },
          error: function error(e) {
            _this6.status.next(STATUS_ERROR);
            _this6.handshake.error(e);
          }
        });

        // Start the keepalive and make sure it's
        // killed when the handshake is cleaned up
        _this6._handshakeSub.add(_this6.keepalive.connect());

        // clean up in the case of reconnect
        if (oldHandshakeSub) {
          oldHandshakeSub.unsubscribe();
        }
      })();
    }
    return this.handshake;
  };

  // Incorporates shared logic between the inital handshake request and
  // all subsequent requests.
  // * Generates a request id and filters by it
  // * Send `end_subscription` when observable is unsubscribed


  IonicDBSocket.prototype.makeRequest = function makeRequest(rawRequest) {
    var request = this.getRequest(rawRequest);

    if (request.type === 'subscribe') {
      return this._sub_query(request);
    } else {
      return this.multiplex(this.activateRequest(request), this.deactivateRequest(request), this.filterRequest(request), request);
    }
  };

  // Creates a subscription query that can survive reconnects


  IonicDBSocket.prototype._sub_query = function _sub_query(request) {
    var _this7 = this;

    var sub = new _BehaviorSubject.BehaviorSubject(STATUS_CONNECTED);
    this.activeSubscriptions.set(request.request_id, sub);

    return sub.switchMap(function (state) {
      return _this7.multiplex(_this7.activateRequest(request), _this7.deactivateRequest(request), _this7.filterRequest(request), state);
    });
  };

  // Wrapper around the makeRequest with the following additional
  // features we need for horizon's protocol:
  // * Sends handshake on subscription if it hasn't happened already
  // * Wait for the handshake to complete before sending the request
  // * Errors when a document with an `error` field is received
  // * Completes when `state: complete` is received
  // * Emits `state: synced` as a separate document for easy filtering
  // * Reference counts subscriptions


  IonicDBSocket.prototype.hzRequest = function hzRequest(rawRequest) {
    return this.sendHandshake().ignoreElements().concat(this.makeRequest(rawRequest)).concatMap(function (resp) {
      if (resp.error !== undefined) {
        throw new ProtocolError(resp.error, resp.error_code);
      }
      var data = resp.data || [];

      if (resp.state !== undefined) {
        // Create a little dummy object for sync notifications
        data.push({
          type: 'state',
          state: resp.state
        });
      }

      return data;
    }).share();
  };

  return IonicDBSocket;
}(_WebSocketSubject2.WebSocketSubject);
//# sourceMappingURL=socket.js.map