'use strict';

exports.__esModule = true;
exports.IonicDB = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

require('rxjs/add/observable/of');

require('rxjs/add/observable/from');

require('rxjs/add/operator/catch');

require('rxjs/add/operator/concatMap');

require('rxjs/add/operator/map');

require('rxjs/add/operator/filter');

require('rxjs/add/operator/do');

var _ast = require('./ast');

var _socket = require('./socket');

var _auth = require('./auth');

var _model = require('./model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IonicDB = exports.IonicDB = function IonicDB() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$host = _ref.host,
      host = _ref$host === undefined ? 'api.ionic.io' : _ref$host,
      _ref$secure = _ref.secure,
      secure = _ref$secure === undefined ? true : _ref$secure,
      _ref$path = _ref.path,
      path = _ref$path === undefined ? 'ionicdb' : _ref$path,
      _ref$lazyWrites = _ref.lazyWrites,
      lazyWrites = _ref$lazyWrites === undefined ? false : _ref$lazyWrites,
      _ref$app_id = _ref.app_id,
      app_id = _ref$app_id === undefined ? undefined : _ref$app_id,
      _ref$authType = _ref.authType,
      authType = _ref$authType === undefined ? 'unauthenticated' : _ref$authType,
      _ref$keepalive = _ref.keepalive,
      keepalive = _ref$keepalive === undefined ? 50 : _ref$keepalive,
      _ref$retry = _ref.retry,
      retry = _ref$retry === undefined ? 5 : _ref$retry,
      _ref$WebSocketCtor = _ref.WebSocketCtor,
      WebSocketCtor = _ref$WebSocketCtor === undefined ? WebSocket : _ref$WebSocketCtor;

  (0, _classCallCheck3.default)(this, IonicDB);


  if (app_id) {
    path = path + '/' + app_id;
  }
  if (authType === 'authenticated') {
    authType = 'token';
  } else {
    authType = 'unauthenticated';
  }

  var tokenStorage = new _auth.TokenStorage({ authType: authType, path: path });
  tokenStorage.setAuthFromQueryParams();

  var url = 'ws' + (secure ? 's' : '') + '://' + host + '/' + path;
  var socket = new _socket.IonicDBSocket({
    url: url,
    handshakeMaker: tokenStorage.handshake.bind(tokenStorage),
    keepalive: keepalive,
    retry: retry,
    WebSocketCtor: WebSocketCtor
  });

  // Store whatever token we get back from the server when we get a
  // handshake response
  socket.handshake.subscribe({
    next: function next(handshake) {
      if (authType !== 'unauthenticated') {
        tokenStorage.set(handshake.token);
      }
    },
    error: function error(err) {
      if (/JsonWebTokenError|TokenExpiredError/.test(err.message)) {
        console.error('IonicDB: clearing token storage since auth failed');
        tokenStorage.remove();
      }
    }
  });

  // This is the object returned by the IonicDB function. It's a
  // function so we can construct a collection simply by calling it
  // like this.collection('my_collection')

  this.collection = function (name) {
    return new _ast.Collection(sendRequest, name, lazyWrites, _this._digest);
  };

  this.currentUser = function () {
    return new _ast.UserDataTerm(_this, socket.handshake, socket);
  };

  this.disconnect = function () {
    socket.disconnect();
  };

  // Dummy subscription to force it to connect to the
  // server. Optionally provide an error handling function if the
  // socket experiences an error.
  // Note: Users of the Observable interface shouldn't need this
  this.connect = function () {
    var onError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (err) {
      console.error('Received an error: ' + err);
    };

    socket.subscribe(function () {}, onError);
  };

  // Either subscribe to status updates, or return an observable with
  // the current status and all subsequent status changes.
  this.status = function () {
    return socket.status.do(_this._digest);
  };

  // Convenience method for finding out when disconnected
  this.onDisconnected = function () {
    return _this.status().filter(function (x) {
      return x.type === 'disconnected';
    });
  };

  // Convenience method for finding out when ready
  this.onConnected = function () {
    return _this.status().filter(function (x) {
      return x.type === 'connected';
    });
  };

  // Convenience method for finding out when an error occurs
  this.onSocketError = function () {
    return _this.status().filter(function (x) {
      return x.type === 'error';
    });
  };

  // Convenience method for finding out when ready
  this.onReconnecting = function () {
    return _this.status().filter(function (x) {
      return x.type === 'reconnecting';
    });
  };

  this.utensils = {
    sendRequest: sendRequest,
    tokenStorage: tokenStorage,
    handshake: socket.handshake
  };
  Object.freeze(this.utensils);

  this._authMethods = null;
  this._root = 'http' + (secure ? 's' : '') + '://' + host;
  this._thisPath = this._root + '/' + path;
  this.hasAuthToken = tokenStorage.hasAuthToken.bind(tokenStorage);
  this.setToken = tokenStorage.set.bind(tokenStorage);
  this.removeToken = tokenStorage.remove.bind(tokenStorage);
  this.aggregate = _model.aggregate;
  this.model = _model.model;

  // Sends a this protocol request to the server, and pulls the data
  // portion of the response out.
  function sendRequest(type, options) {
    // Both remove and removeAll use the type 'remove' in the protocol
    var normalizedType = type === 'removeAll' ? 'remove' : type;
    return socket.hzRequest({ type: normalizedType, options: options }) // send the raw request
    .takeWhile(function (resp) {
      return resp.state !== 'complete';
    });
  }
};

IonicDB.Socket = _socket.IonicDBSocket;
IonicDB.clearAuthTokens = _auth.clearAuthTokens;
//# sourceMappingURL=index.js.map