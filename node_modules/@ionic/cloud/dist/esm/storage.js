/**
 * @hidden
 */
var LocalStorageStrategy = (function () {
    function LocalStorageStrategy() {
    }
    LocalStorageStrategy.prototype.get = function (key) {
        return localStorage.getItem(key);
    };
    LocalStorageStrategy.prototype.set = function (key, value) {
        return localStorage.setItem(key, value);
    };
    LocalStorageStrategy.prototype.delete = function (key) {
        return localStorage.removeItem(key);
    };
    return LocalStorageStrategy;
}());
export { LocalStorageStrategy };
/**
 * @hidden
 */
var SessionStorageStrategy = (function () {
    function SessionStorageStrategy() {
    }
    SessionStorageStrategy.prototype.get = function (key) {
        return sessionStorage.getItem(key);
    };
    SessionStorageStrategy.prototype.set = function (key, value) {
        return sessionStorage.setItem(key, value);
    };
    SessionStorageStrategy.prototype.delete = function (key) {
        return sessionStorage.removeItem(key);
    };
    return SessionStorageStrategy;
}());
export { SessionStorageStrategy };
/**
 * A generic local/session storage abstraction.
 */
var Storage = (function () {
    function Storage(deps, options) {
        if (options === void 0) { options = { 'prefix': 'ionic', 'cache': true }; }
        this.options = options;
        this.strategy = deps.strategy;
        this.storageCache = {};
    }
    /**
     * Set a value in the storage by the given key.
     *
     * @param key - The storage key to set.
     * @param value - The value to set. (Must be JSON-serializable).
     */
    Storage.prototype.set = function (key, value) {
        key = this.standardizeKey(key);
        var json = JSON.stringify(value);
        this.strategy.set(key, json);
        if (this.options.cache) {
            this.storageCache[key] = value;
        }
    };
    /**
     * Delete a value from the storage by the given key.
     *
     * @param key - The storage key to delete.
     */
    Storage.prototype.delete = function (key) {
        key = this.standardizeKey(key);
        this.strategy.delete(key);
        if (this.options.cache) {
            delete this.storageCache[key];
        }
    };
    /**
     * Get a value from the storage by the given key.
     *
     * @param key - The storage key to get.
     */
    Storage.prototype.get = function (key) {
        key = this.standardizeKey(key);
        if (this.options.cache) {
            var cached = this.storageCache[key];
            if (cached) {
                return cached;
            }
        }
        var json = this.strategy.get(key);
        if (!json) {
            return null;
        }
        try {
            var value = JSON.parse(json);
            if (this.options.cache) {
                this.storageCache[key] = value;
            }
            return value;
        }
        catch (err) {
            return null;
        }
    };
    /**
     * @private
     */
    Storage.prototype.standardizeKey = function (key) {
        return this.options.prefix + "_" + key;
    };
    return Storage;
}());
export { Storage };
