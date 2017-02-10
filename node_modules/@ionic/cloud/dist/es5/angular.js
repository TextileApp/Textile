"use strict";
var di_1 = require("./di");
var events_1 = require("./events");
var promise_1 = require("./promise");
/**
 * Angular 1 modules and factories for the bundle
 */
function bootstrapAngular1() {
    if (typeof angular === 'undefined') {
        return; // No global angular--this is not an AngularJS project.
    }
    var container = new di_1.Container();
    angular.element(document).ready(function () {
        container.core.init();
        container.cordova.bootstrap();
    });
    angular.module('ionic.cloud', [])
        .provider('$ionicCloudConfig', function () {
        var config = container.config;
        this.register = function (settings) {
            config.register(settings);
        };
        this.$get = function () {
            return config;
        };
    })
        .provider('$ionicCloud', ['$ionicCloudConfigProvider', function ($ionicCloudConfigProvider) {
            this.init = function (value) {
                $ionicCloudConfigProvider.register(value);
            };
            this.$get = [function () {
                    return container.core;
                }];
        }])
        .factory('$ionicCloudClient', [function () {
            return container.client;
        }])
        .factory('$ionicUser', [function () {
            return container.singleUserService.current();
        }])
        .factory('$ionicAuth', [function () {
            return container.auth;
        }])
        .factory('$ionicFacebookAuth', [function () {
            return container.facebookAuth;
        }])
        .factory('$ionicGoogleAuth', [function () {
            return container.googleAuth;
        }])
        .factory('$ionicPush', [function () {
            return container.push;
        }])
        .factory('$ionicDeploy', [function () {
            return container.deploy;
        }])
        .factory('$ionicDB', ['$timeout', function ($timeout) {
            container.database._digest = function () { return $timeout(function () { return; }, 0); };
            return container.database;
        }])
        .run(['$window', '$q', '$rootScope', function ($window, $q, $rootScope) {
            if (typeof $window.Promise === 'undefined') {
                $window.Promise = $q;
            }
            else {
                var init = promise_1.DeferredPromise.prototype.init;
                promise_1.DeferredPromise.prototype.init = function () {
                    init.apply(this, arguments);
                    this.promise = $q.when(this.promise);
                };
            }
            var emit = events_1.EventEmitter.prototype.emit;
            events_1.EventEmitter.prototype.emit = function (name, data) {
                $rootScope.$broadcast('cloud:' + name, data);
                return emit.apply(this, arguments);
            };
        }]);
}
exports.bootstrapAngular1 = bootstrapAngular1;
//# sourceMappingURL=angular.js.map