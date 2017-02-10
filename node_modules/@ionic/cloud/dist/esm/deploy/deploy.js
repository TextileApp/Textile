import { DeferredPromise } from '../promise';
var NO_PLUGIN = new Error('Missing deploy plugin: `ionic-plugin-deploy`');
/**
 * `Deploy` handles live deploys of the app. Downloading, extracting, and
 * rolling back snapshots.
 *
 * @featured
 */
var Deploy = (function () {
    function Deploy(deps, 
        /**
         * @hidden
         */
        options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.options = options;
        /**
         * The active deploy channel. Set this to change the channel on which
         * `Deploy` operates.
         */
        this.channel = 'production';
        this.config = deps.config;
        this.emitter = deps.emitter;
        this.logger = deps.logger;
        this.emitter.once('device:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.init(_this.config.get('app_id'), _this.config.getURL('api'));
            }
            _this.emitter.emit('deploy:ready');
        });
    }
    /**
     * Check for updates on the active channel.
     *
     * The promise resolves with a boolean. When `true`, a new snapshot exists on
     * the channel.
     */
    Deploy.prototype.check = function () {
        var _this = this;
        var deferred = new DeferredPromise();
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.check(_this.config.get('app_id'), _this.channel, function (result) {
                    if (result && result === 'true') {
                        _this.logger.info('Ionic Deploy: an update is available');
                        deferred.resolve(true);
                    }
                    else {
                        _this.logger.info('Ionic Deploy: no updates available');
                        deferred.resolve(false);
                    }
                }, function (error) {
                    _this.logger.error('Ionic Deploy: encountered an error while checking for updates');
                    deferred.reject(error);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * Download the available snapshot.
     *
     * This should be used in conjunction with
     * [`extract()`](/api/client/deploy/#extract).
     *
     * @param options
     *  Options for this download, such as a progress callback.
     */
    Deploy.prototype.download = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var deferred = new DeferredPromise();
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.download(_this.config.get('app_id'), function (result) {
                    if (result === 'true') {
                        _this.logger.info('Ionic Deploy: download complete');
                        deferred.resolve();
                    }
                    else if (result === 'false') {
                        deferred.reject(new Error('Ionic Deploy: Download has failed: see native logs.'));
                    }
                    else {
                        if (options.onProgress) {
                            options.onProgress(result);
                        }
                    }
                }, function (error) {
                    deferred.reject(error);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * Extract the downloaded snapshot.
     *
     * This should be called after [`download()`](/api/client/deploy/#download)
     * successfully resolves.
     *
     * @param options
     */
    Deploy.prototype.extract = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var deferred = new DeferredPromise();
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.extract(_this.config.get('app_id'), function (result) {
                    if (result === 'done') {
                        _this.logger.info('Ionic Deploy: extraction complete');
                        deferred.resolve();
                    }
                    else {
                        if (options.onProgress) {
                            options.onProgress(result);
                        }
                    }
                }, function (error) {
                    deferred.reject(error);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * Immediately reload the app with the latest deployed snapshot.
     *
     * This is only necessary to call if you have downloaded and extracted a
     * snapshot and wish to instantly reload the app with the latest deploy. The
     * latest deploy will automatically be loaded when the app is started.
     */
    Deploy.prototype.load = function () {
        var _this = this;
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.redirect(_this.config.get('app_id'));
            }
        });
    };
    /**
     * Get information about the current snapshot.
     *
     * The promise is resolved with an object that has key/value pairs pertaining
     * to the currently deployed snapshot.
     */
    Deploy.prototype.info = function () {
        var _this = this;
        var deferred = new DeferredPromise(); // TODO
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.info(_this.config.get('app_id'), function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * List the snapshots that have been installed on this device.
     *
     * The promise is resolved with an array of snapshot UUIDs.
     */
    Deploy.prototype.getSnapshots = function () {
        var _this = this;
        var deferred = new DeferredPromise(); // TODO
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.getVersions(_this.config.get('app_id'), function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * Remove a snapshot from this device.
     *
     * @param uuid
     *  The snapshot UUID to remove from the device.
     */
    Deploy.prototype.deleteSnapshot = function (uuid) {
        var _this = this;
        var deferred = new DeferredPromise(); // TODO
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.deleteVersion(_this.config.get('app_id'), uuid, function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * Fetches the metadata for a given snapshot. If no UUID is given, it will
     * attempt to grab the metadata for the most recently known snapshot.
     *
     * @param uuid
     *  The snapshot from which to grab metadata.
     */
    Deploy.prototype.getMetadata = function (uuid) {
        var _this = this;
        var deferred = new DeferredPromise(); // TODO
        this.emitter.once('deploy:ready', function () {
            if (_this._getPlugin()) {
                _this.plugin.getMetadata(_this.config.get('app_id'), uuid, function (result) {
                    deferred.resolve(result.metadata);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else {
                deferred.reject(NO_PLUGIN);
            }
        });
        return deferred.promise;
    };
    /**
     * @private
     */
    Deploy.prototype._getPlugin = function () {
        if (typeof window.IonicDeploy === 'undefined') {
            this.logger.warn('Ionic Deploy: Disabled! Deploy plugin is not installed or has not loaded. Have you run `ionic plugin add ionic-plugin-deploy` yet?');
            return;
        }
        if (!this.plugin) {
            this.plugin = window.IonicDeploy;
        }
        return this.plugin;
    };
    return Deploy;
}());
export { Deploy };
