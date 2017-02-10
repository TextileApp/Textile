export * from '@ionic/cloud';
import { Observable } from 'rxjs';
import { ModuleWithProviders, OpaqueToken } from '@angular/core';
import { Auth as _Auth, FacebookAuth as _FacebookAuth, GoogleAuth as _GoogleAuth, Client as _Client, CloudSettings, Config as _Config, Database as _Database, Deploy as _Deploy, DIContainer as _DIContainer, IEventEmitter, IAuth, IClient, IConfig, IDeploy, IFacebookAuth, IGoogleAuth, IPush as _IPush, IPushMessage, IUser, Insights as _Insights, Push as _Push, User as _User } from '@ionic/cloud';
export declare class Rx {
    protected emitter: IEventEmitter;
    constructor(emitter: IEventEmitter);
}
export declare class PushRx extends Rx {
    notification(): Observable<IPushMessage>;
}
export interface IPush extends _IPush {
    rx: PushRx;
}
export declare class FacebookAuth extends _FacebookAuth {
}
export declare class GoogleAuth extends _GoogleAuth {
}
export declare class Auth extends _Auth {
}
export declare class Client extends _Client {
}
export declare class Config extends _Config {
}
export declare class Database extends _Database {
}
export declare class Deploy extends _Deploy {
}
export declare class DIContainer extends _DIContainer {
}
export declare class Insights extends _Insights {
}
export declare class Push extends _Push implements IPush {
    /**
     * Observables for the push service.
     */
    rx: PushRx;
}
export declare class User extends _User {
}
export declare const CloudSettingsToken: OpaqueToken;
export declare function provideContainer(settings: CloudSettings): DIContainer;
export declare function provideConfig(container: DIContainer): IConfig;
export declare function provideAuth(container: DIContainer): IAuth;
export declare function provideClient(container: DIContainer): IClient;
export declare function provideDatabase(container: DIContainer): Database;
export declare function provideDeploy(container: DIContainer): IDeploy;
export declare function provideUser(container: DIContainer): IUser;
export declare function providePush(container: DIContainer): IPush;
export declare function provideFacebookAuth(container: DIContainer): IFacebookAuth;
export declare function provideGoogleAuth(container: DIContainer): IGoogleAuth;
export declare class CloudModule {
    static forRoot(settings: CloudSettings): ModuleWithProviders;
}
