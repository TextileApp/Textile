import { ISingleUserService, IUser, IUserContext, IUserData, SingleUserServiceDependencies, SingleUserServiceOptions, StoredUser, UserContextDependencies, UserDependencies, UserDetails, UserSocialDetails } from '../definitions';
/**
 * @hidden
 */
export declare class UserContext implements IUserContext {
    /**
     * @private
     */
    private storage;
    /**
     * @private
     */
    private config;
    constructor(deps: UserContextDependencies);
    readonly label: string;
    unstore(): void;
    store(user: IUser): void;
    load(user: IUser): IUser | null;
}
/**
 * @hidden
 */
export declare class UserData implements IUserData {
    data: Object;
    constructor(data?: {});
    get(key: string, defaultValue: any): any;
    set(key: string, value: any): void;
    unset(key: string): void;
    /**
     * @private
     */
    private deserializeDataTypes();
}
/**
 * Represents a user of the app.
 *
 * @featured
 */
export declare class User implements IUser {
    /**
     * The UUID of this user.
     */
    id?: string;
    /**
     * Is this user fresh, meaning they haven't been persisted?
     */
    fresh: boolean;
    /**
     * The details (email, password, etc) of this user.
     */
    details: UserDetails;
    /**
     * The social details of this user.
     */
    social: UserSocialDetails;
    /**
     * The custom data of this user.
     */
    data: IUserData;
    /**
     * @private
     */
    private service;
    /**
     * @private
     */
    private _unset;
    constructor(deps: UserDependencies);
    /**
     * Check whether this user is anonymous or not.
     *
     * If the `id` property is set, the user is no longer anonymous.
     */
    isAnonymous(): boolean;
    /**
     * Get a value from this user's custom data.
     *
     * Optionally, a default value can be provided.
     *
     * @param key - The data key to get.
     * @param defaultValue - The value to return if the key is absent.
     */
    get(key: string, defaultValue: any): any;
    /**
     * Set a value in this user's custom data.
     *
     * @param key - The data key to set.
     * @param value - The value to set.
     */
    set(key: string, value: any): any;
    /**
     * Delete a value from this user's custom data.
     *
     * @param key - The data key to delete.
     */
    unset(key: string): any;
    /**
     * Revert this user to a fresh, anonymous state.
     */
    clear(): void;
    /**
     * Save this user to the API.
     */
    save(): Promise<void>;
    /**
     * Delete this user from the API.
     */
    delete(): Promise<void>;
    /**
     * Load the user from the API, overwriting the local user's data.
     *
     * @param id - The user ID to load into this user.
     */
    load(id?: string): Promise<void>;
    /**
     * Store this user in local storage.
     */
    store(): void;
    /**
     * Remove this user from local storage.
     */
    unstore(): void;
    /**
     * @hidden
     */
    serializeForAPI(): UserDetails;
    /**
     * @hidden
     */
    serializeForStorage(): StoredUser;
    toString(): string;
}
/**
 * @hidden
 */
export declare class SingleUserService implements ISingleUserService {
    config: SingleUserServiceOptions;
    /**
     * @private
     */
    private client;
    /**
     * @private
     */
    private context;
    /**
     * @private
     */
    private user;
    constructor(deps: SingleUserServiceDependencies, config?: SingleUserServiceOptions);
    current(): IUser;
    store(): void;
    unstore(): void;
    load(id?: string): Promise<void>;
    delete(): Promise<void>;
    save(): Promise<void>;
}
