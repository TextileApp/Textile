/**
 * @hidden
 */
var Cordova = (function () {
    function Cordova(deps, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.app = deps.appStatus;
        this.device = deps.device;
        this.emitter = deps.emitter;
        this.logger = deps.logger;
        this.registerEventHandlers();
    }
    Cordova.prototype.bootstrap = function () {
        var _this = this;
        var events = ['pause', 'resume'];
        document.addEventListener('deviceready', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.emitter.emit('cordova:deviceready', { 'args': args });
            var _loop_1 = function (e) {
                document.addEventListener(e, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.emitter.emit('cordova:' + e, { 'args': args });
                }, false);
            };
            for (var _a = 0, events_1 = events; _a < events_1.length; _a++) {
                var e = events_1[_a];
                _loop_1(e);
            }
        }, false);
    };
    /**
     * @private
     */
    Cordova.prototype.registerEventHandlers = function () {
        var _this = this;
        this.emitter.on('cordova:pause', function () {
            _this.app.closed = true;
        });
        this.emitter.on('cordova:resume', function () {
            _this.app.closed = false;
        });
    };
    return Cordova;
}());
export { Cordova };
