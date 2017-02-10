var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
export * from '@ionic/cloud';
import { Observable } from 'rxjs';
import { Injectable, NgModule, OpaqueToken } from '@angular/core';
import { Auth as _Auth, FacebookAuth as _FacebookAuth, GoogleAuth as _GoogleAuth, Client as _Client, Config as _Config, Database as _Database, Deploy as _Deploy, DIContainer as _DIContainer, Insights as _Insights, Push as _Push, User as _User, } from '@ionic/cloud';
var Rx = (function () {
    function Rx(emitter) {
        this.emitter = emitter;
    }
    return Rx;
}());
export { Rx };
var PushRx = (function (_super) {
    __extends(PushRx, _super);
    function PushRx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PushRx.prototype.notification = function () {
        var _this = this;
        return Observable.fromEventPattern(function (h) {
            return _this.emitter.on('push:notification', function (data) {
                return h(data.message);
            });
        }, function (_) {
            // https://github.com/ReactiveX/rxjs/issues/1900
            // this.emitter.off(signal);
        });
    };
    return PushRx;
}(Rx));
export { PushRx };
var FacebookAuth = (function (_super) {
    __extends(FacebookAuth, _super);
    function FacebookAuth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FacebookAuth;
}(_FacebookAuth));
FacebookAuth = __decorate([
    Injectable()
], FacebookAuth);
export { FacebookAuth };
var GoogleAuth = (function (_super) {
    __extends(GoogleAuth, _super);
    function GoogleAuth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GoogleAuth;
}(_GoogleAuth));
GoogleAuth = __decorate([
    Injectable()
], GoogleAuth);
export { GoogleAuth };
var Auth = (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Auth;
}(_Auth));
Auth = __decorate([
    Injectable()
], Auth);
export { Auth };
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Client;
}(_Client));
Client = __decorate([
    Injectable()
], Client);
export { Client };
var Config = (function (_super) {
    __extends(Config, _super);
    function Config() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Config;
}(_Config));
Config = __decorate([
    Injectable()
], Config);
export { Config };
var Database = (function (_super) {
    __extends(Database, _super);
    function Database() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Database;
}(_Database));
Database = __decorate([
    Injectable()
], Database);
export { Database };
var Deploy = (function (_super) {
    __extends(Deploy, _super);
    function Deploy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Deploy;
}(_Deploy));
Deploy = __decorate([
    Injectable()
], Deploy);
export { Deploy };
var DIContainer = (function (_super) {
    __extends(DIContainer, _super);
    function DIContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DIContainer;
}(_DIContainer));
DIContainer = __decorate([
    Injectable()
], DIContainer);
export { DIContainer };
var Insights = (function (_super) {
    __extends(Insights, _super);
    function Insights() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Insights;
}(_Insights));
Insights = __decorate([
    Injectable()
], Insights);
export { Insights };
var Push = (function (_super) {
    __extends(Push, _super);
    function Push() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Push;
}(_Push));
Push = __decorate([
    Injectable()
], Push);
export { Push };
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(_User));
User = __decorate([
    Injectable()
], User);
export { User };
export var CloudSettingsToken = new OpaqueToken('CloudSettings');
export function provideContainer(settings) {
    var container = new DIContainer();
    container.config.register(settings);
    container.core.init();
    container.cordova.bootstrap();
    return container;
}
export function provideConfig(container) {
    return container.config;
}
export function provideAuth(container) {
    return container.auth;
}
export function provideClient(container) {
    return container.client;
}
export function provideDatabase(container) {
    return container.database;
}
export function provideDeploy(container) {
    return container.deploy;
}
export function provideUser(container) {
    return container.singleUserService.current();
}
export function providePush(container) {
    var push = container.push;
    push.rx = new PushRx(container.eventEmitter);
    return push;
}
export function provideFacebookAuth(container) {
    return container.facebookAuth;
}
export function provideGoogleAuth(container) {
    return container.googleAuth;
}
var CloudModule = CloudModule_1 = (function () {
    function CloudModule() {
    }
    CloudModule.forRoot = function (settings) {
        return {
            ngModule: CloudModule_1,
            providers: [
                { provide: CloudSettingsToken, useValue: settings },
                { provide: DIContainer, useFactory: provideContainer, deps: [CloudSettingsToken] },
                { provide: Auth, useFactory: provideAuth, deps: [DIContainer] },
                { provide: Client, useFactory: provideClient, deps: [DIContainer] },
                { provide: Config, useFactory: provideConfig, deps: [DIContainer] },
                { provide: Database, useFactory: provideDatabase, deps: [DIContainer] },
                { provide: Deploy, useFactory: provideDeploy, deps: [DIContainer] },
                { provide: Push, useFactory: providePush, deps: [DIContainer] },
                { provide: User, useFactory: provideUser, deps: [DIContainer] },
                { provide: FacebookAuth, useFactory: provideFacebookAuth, deps: [DIContainer] },
                { provide: GoogleAuth, useFactory: provideGoogleAuth, deps: [DIContainer] }
            ]
        };
    };
    return CloudModule;
}());
CloudModule = CloudModule_1 = __decorate([
    NgModule()
], CloudModule);
export { CloudModule };
var CloudModule_1;
