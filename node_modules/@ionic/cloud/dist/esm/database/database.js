import * as Horizon from '@horizon/client';
export var Database = (function () {
    function Database(deps, settings) {
        this.settings = settings;
        this.config = deps.config;
        this.client = deps.client;
        this.storage = deps.storage;
        this.emitter = deps.emitter;
        var authType = 'anonymous';
        switch (settings.authType) {
            case 'unauthenticated':
                authType = 'unauthenticated';
                break;
            case 'ionic':
                authType = 'token';
                break;
            case 'token':
                authType = 'token';
                break;
        }
        this._hz_settings = {
            lazyWrites: settings.lazyWrites || false,
            authType: authType,
            host: settings.host || 'db.ionic.io',
            path: settings.path || 'horizon/' + this.config.get('app_id') + '/horizon',
            secure: true
        };
        if (settings.secure !== undefined) {
            this._hz_settings.secure = settings.secure;
        }
        this.settings.retries = settings.retries || 10;
        this._curr_retry = 0;
    }
    Database.prototype.connect = function () {
        var _this = this;
        this.horizon = Horizon(this._hz_settings);
        this._registerListeners();
        if (this.settings.authType === 'ionic') {
            this.client.post('/db/login')
                .end(function (err, res) {
                if (err) {
                    throw err;
                }
                else {
                    _this.storage.set('horizon-jwt', res.body.data);
                    _this._retrying = false;
                    _this.horizon.connect();
                }
            });
        }
        else {
            this._retrying = false;
            this.horizon.connect();
        }
    };
    Database.prototype._registerListeners = function () {
        var _this = this;
        this.horizon.onReady(function () {
            _this._curr_retry = 0;
            _this.emitter.emit('db:connected', _this.horizon);
        });
        this.horizon.onDisconnected(function () {
            if (!_this._retrying) {
                _this._reconnect();
            }
        });
    };
    Database.prototype._reconnect = function () {
        var _this = this;
        this._retrying = true;
        this._curr_retry++;
        var shouldRetry = this._curr_retry <= this.settings.retries;
        var message = '';
        var remain = 0;
        var delay = 0;
        if (!shouldRetry) {
            message = 'Retry Limit Reached. Failed to connect to DB.';
            this.emitter.emit('db:connection-failed', { 'message': message,
                'retrying': false
            });
        }
        else {
            remain = this.settings.retries - this._curr_retry;
            message = 'Retrying connection. Remaining attempts: ' + remain;
            delay = 50 * Math.pow(2, this._curr_retry);
            this.emitter.emit('db:disconnected', { 'retrying': shouldRetry,
                'message': message,
                'attempts-remaining': remain,
                'delay': delay
            });
            setTimeout(function () {
                _this.connect();
            }, delay);
        }
    };
    return Database;
}());
