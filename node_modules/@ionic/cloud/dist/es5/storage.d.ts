import { IStorage, IStorageStrategy, StorageDependencies, StorageOptions } from './definitions';
/**
 * @hidden
 */
export declare class LocalStorageStrategy implements IStorageStrategy {
    get(key: string): string | null;
    set(key: string, value: string): void;
    delete(key: string): void;
}
/**
 * @hidden
 */
export declare class SessionStorageStrategy implements IStorageStrategy {
    get(key: string): string | null;
    set(key: string, value: string): void;
    delete(key: string): void;
}
/**
 * A generic local/session storage abstraction.
 */
export declare class Storage<T> implements IStorage<T> {
    options: StorageOptions;
    /**
     * @private
     */
    private strategy;
    /**
     * @private
     */
    private storageCache;
    constructor(deps: StorageDependencies, options?: StorageOptions);
    /**
     * Set a value in the storage by the given key.
     *
     * @param key - The storage key to set.
     * @param value - The value to set. (Must be JSON-serializable).
     */
    set(key: string, value: T): void;
    /**
     * Delete a value from the storage by the given key.
     *
     * @param key - The storage key to delete.
     */
    delete(key: string): void;
    /**
     * Get a value from the storage by the given key.
     *
     * @param key - The storage key to get.
     */
    get(key: string): T | null;
    /**
     * @private
     */
    private standardizeKey(key);
}
