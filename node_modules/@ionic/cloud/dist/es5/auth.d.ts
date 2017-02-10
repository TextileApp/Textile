import { AuthDependencies, AuthLoginOptions, AuthLoginResult, AuthModuleId, AuthTypeDependencies, NativeAuthDependencies, BasicLoginCredentials, CombinedTokenContextDependencies, IAuth, IAuthType, IBasicAuthType, IClient, ICombinedTokenContext, ICombinedTokenContextStoreOptions, IConfig, IEventEmitter, IFacebookAuth, IGoogleAuth, ISingleUserService, ITokenContext, InAppBrowserPluginOptions, TokenContextDependencies, SuperAgentResponse, UserDetails } from './definitions';
import { DetailedError } from './errors';
/**
 * @hidden
 */
export declare class AuthTokenContext implements ITokenContext {
    label: string;
    /**
     * @private
     */
    private storage;
    constructor(deps: TokenContextDependencies, label: string);
    get(): string | null;
    store(token: string): void;
    delete(): void;
}
/**
 * @hidden
 */
export declare class CombinedAuthTokenContext implements ICombinedTokenContext {
    label: string;
    /**
     * @private
     */
    private storage;
    /**
     * @private
     */
    private tempStorage;
    constructor(deps: CombinedTokenContextDependencies, label: string);
    get(): string | null;
    store(token: string, options?: ICombinedTokenContextStoreOptions): void;
    delete(): void;
}
/**
 * `Auth` handles authentication of a single user, such as signing up, logging
 * in & out, social provider authentication, etc.
 *
 * @featured
 */
export declare class Auth implements IAuth {
    /**
     * @private
     */
    private config;
    /**
     * @private
     */
    private emitter;
    /**
     * @private
     */
    private authModules;
    /**
     * @private
     */
    private tokenContext;
    /**
     * @private
     */
    private userService;
    /**
     * @private
     */
    private storage;
    /**
     * @private
     */
    private authToken;
    constructor(deps: AuthDependencies);
    /**
     * Link the user to this URL for password resets. Only for email/password
     * authentication.
     *
     * Use this if you want to use our password reset forms instead of creating
     * your own in your app.
     */
    readonly passwordResetUrl: string;
    /**
     * Check whether the user is logged in or not.
     *
     * If an auth token exists in local storage, the user is logged in.
     */
    isAuthenticated(): boolean;
    /**
     * Sign up a user with the given data. Only for email/password
     * authentication.
     *
     * `signup` does not affect local data or the current user until `login` is
     * called. This means you'll likely want to log in your users manually after
     * signup.
     *
     * If a signup fails, the promise rejects with a [`IDetailedError`
     * object](/api/client/idetailederror) that contains an array of error codes
     * from the cloud.
     *
     * @param details - The details that describe a user.
     */
    signup(details: UserDetails): Promise<void>;
    /**
     * Attempt to log the user in with the given credentials. For custom & social
     * logins, kick-off the authentication process.
     *
     * After login, the full user is loaded from the cloud and saved in local
     * storage along with their auth token.
     *
     * @note TODO: Better error handling docs.
     *
     * @param moduleId
     *  The authentication provider module ID to use with this login.
     * @param credentials
     *  For email/password authentication, give an email and password. For social
     *  authentication, exclude this parameter. For custom authentication, send
     *  whatever you need.
     * @param options
     *  Options for this login, such as whether to remember the login and
     *  InAppBrowser window options for authentication providers that make use of
     *  it.
     */
    login(moduleId: AuthModuleId, credentials?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
    /**
     * Log the user out of the app.
     *
     * This clears the auth token out of local storage and restores the user to
     * an unauthenticated state.
     */
    logout(): void;
    /**
     * Kick-off the password reset process. Only for email/password
     * authentication.
     *
     * An email will be sent to the user with a short password reset code, which
     * they can copy back into your app and use the [`confirmPasswordReset()`
     * method](#confirmPasswordReset).
     *
     * @param email - The email address to which to send a code.
     */
    requestPasswordReset(email: string): Promise<void>;
    /**
     * Confirm a password reset.
     *
     * When the user gives you their password reset code into your app and their
     * requested changed password, call this method.
     *
     * @param code - The password reset code from the user.
     * @param newPassword - The requested changed password from the user.
     */
    confirmPasswordReset(code: number, newPassword: string): Promise<void>;
    /**
     * Get the raw auth token of the active user from local storage.
     */
    getToken(): string | null;
    /**
     * @hidden
     */
    storeToken(options: AuthLoginOptions, token: string): void;
    /**
     * @hidden
     */
    static getDetailedErrorFromResponse(res: SuperAgentResponse): DetailedError<string[]>;
}
/**
 * @hidden
 */
export declare abstract class AuthType implements IAuthType {
    protected config: IConfig;
    protected client: IClient;
    protected emitter: IEventEmitter;
    constructor(deps: AuthTypeDependencies);
    abstract authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
    protected parseInAppBrowserOptions(opts?: InAppBrowserPluginOptions): string;
    protected inAppBrowserFlow(moduleId: AuthModuleId, data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class BasicAuthType extends AuthType implements IBasicAuthType {
    authenticate(data: BasicLoginCredentials, options?: AuthLoginOptions): Promise<AuthLoginResult>;
    requestPasswordReset(email: string): Promise<void>;
    confirmPasswordReset(email: string, code: number, newPassword: string): Promise<void>;
    signup(data: UserDetails): Promise<void>;
}
/**
 * hidden
 */
export declare abstract class NativeAuth {
    protected config: IConfig;
    protected client: IClient;
    protected userService: ISingleUserService;
    protected tokenContext: ICombinedTokenContext;
    protected emitter: IEventEmitter;
    protected authToken: string;
    constructor(deps: NativeAuthDependencies);
    /**
     * Get the raw auth token of the active user from local storage.
     * @hidden
     */
    getToken(): string | null;
    /**
     * @hidden
     */
    storeToken(token: string): void;
}
/**
 * GoogleNativeAuth handles logging into googleplus through the cordova-plugin-googleplus plugin.'
 * @featured
 */
export declare class GoogleAuth extends NativeAuth implements IGoogleAuth {
    logout(): Promise<void>;
    login(): Promise<AuthLoginResult>;
}
/**
 * FacebookNative handles logging into facebook through the cordova-plugin-facebook4 plugin.
 * @featured
 */
export declare class FacebookAuth extends NativeAuth implements IFacebookAuth {
    logout(): Promise<void>;
    login(): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class CustomAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class TwitterAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class FacebookAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class GithubAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class GoogleAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class InstagramAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
/**
 * @hidden
 */
export declare class LinkedInAuthType extends AuthType {
    authenticate(data?: Object, options?: AuthLoginOptions): Promise<AuthLoginResult>;
}
