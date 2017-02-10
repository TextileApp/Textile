import { DeferredPromise } from '../promise';
import { DataType } from './data-types';
/**
 * @hidden
 */
var UserContext = (function () {
    function UserContext(deps) {
        this.config = deps.config;
        this.storage = deps.storage;
    }
    Object.defineProperty(UserContext.prototype, "label", {
        get: function () {
            return 'user_' + this.config.get('app_id');
        },
        enumerable: true,
        configurable: true
    });
    UserContext.prototype.unstore = function () {
        this.storage.delete(this.label);
    };
    UserContext.prototype.store = function (user) {
        this.storage.set(this.label, user.serializeForStorage());
    };
    UserContext.prototype.load = function (user) {
        var data = this.storage.get(this.label);
        if (data) {
            user.id = data.id;
            user.data = new UserData(data.data);
            user.details = data.details || {};
            user.social = data.social || {};
            user.fresh = data.fresh;
            return user;
        }
        return null;
    };
    return UserContext;
}());
export { UserContext };
/**
 * @hidden
 */
var UserData = (function () {
    function UserData(data) {
        if (data === void 0) { data = {}; }
        this.data = {};
        if ((typeof data === 'object')) {
            this.data = data;
            this.deserializeDataTypes();
        }
    }
    UserData.prototype.get = function (key, defaultValue) {
        if (this.data.hasOwnProperty(key)) {
            return this.data[key];
        }
        else {
            if (defaultValue === 0 || defaultValue === false) {
                return defaultValue;
            }
            return defaultValue || null;
        }
    };
    UserData.prototype.set = function (key, value) {
        this.data[key] = value;
    };
    UserData.prototype.unset = function (key) {
        delete this.data[key];
    };
    /**
     * @private
     */
    UserData.prototype.deserializeDataTypes = function () {
        if (this.data) {
            for (var x in this.data) {
                // if we have an object, let's check for custom data types
                if (this.data[x] && typeof this.data[x] === 'object') {
                    // do we have a custom type?
                    if (this.data[x].__Ionic_DataTypeSchema) {
                        var name = this.data[x].__Ionic_DataTypeSchema;
                        var mapping = DataType.getMapping();
                        if (mapping[name]) {
                            // we have a custom type and a registered class, give the custom data type
                            // from storage
                            this.data[x] = mapping[name].fromStorage(this.data[x].value);
                        }
                    }
                }
            }
        }
    };
    return UserData;
}());
export { UserData };
/**
 * Represents a user of the app.
 *
 * @featured
 */
var User = (function () {
    function User(deps) {
        /**
         * The details (email, password, etc) of this user.
         */
        this.details = {};
        /**
         * The social details of this user.
         */
        this.social = {};
        this.service = deps.service;
        this.fresh = true;
        this._unset = {};
        this.data = new UserData();
    }
    /**
     * Check whether this user is anonymous or not.
     *
     * If the `id` property is set, the user is no longer anonymous.
     */
    User.prototype.isAnonymous = function () {
        if (!this.id) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Get a value from this user's custom data.
     *
     * Optionally, a default value can be provided.
     *
     * @param key - The data key to get.
     * @param defaultValue - The value to return if the key is absent.
     */
    User.prototype.get = function (key, defaultValue) {
        return this.data.get(key, defaultValue);
    };
    /**
     * Set a value in this user's custom data.
     *
     * @param key - The data key to set.
     * @param value - The value to set.
     */
    User.prototype.set = function (key, value) {
        delete this._unset[key];
        return this.data.set(key, value);
    };
    /**
     * Delete a value from this user's custom data.
     *
     * @param key - The data key to delete.
     */
    User.prototype.unset = function (key) {
        this._unset[key] = true;
        return this.data.unset(key);
    };
    /**
     * Revert this user to a fresh, anonymous state.
     */
    User.prototype.clear = function () {
        this.id = undefined;
        this.data = new UserData();
        this.details = {};
        this.fresh = true;
    };
    /**
     * Save this user to the API.
     */
    User.prototype.save = function () {
        this._unset = {};
        return this.service.save();
    };
    /**
     * Delete this user from the API.
     */
    User.prototype.delete = function () {
        return this.service.delete();
    };
    /**
     * Load the user from the API, overwriting the local user's data.
     *
     * @param id - The user ID to load into this user.
     */
    User.prototype.load = function (id) {
        return this.service.load(id);
    };
    /**
     * Store this user in local storage.
     */
    User.prototype.store = function () {
        this.service.store();
    };
    /**
     * Remove this user from local storage.
     */
    User.prototype.unstore = function () {
        this.service.unstore();
    };
    /**
     * @hidden
     */
    User.prototype.serializeForAPI = function () {
        return {
            'email': this.details.email,
            'password': this.details.password,
            'username': this.details.username,
            'image': this.details.image,
            'name': this.details.name,
            'custom': this.data.data
        };
    };
    /**
     * @hidden
     */
    User.prototype.serializeForStorage = function () {
        return {
            'id': this.id,
            'data': this.data.data,
            'details': this.details,
            'fresh': this.fresh,
            'social': this.social
        };
    };
    User.prototype.toString = function () {
        return "<User [" + (this.isAnonymous() ? 'anonymous' : this.id) + "]>";
    };
    return User;
}());
export { User };
/**
 * @hidden
 */
var SingleUserService = (function () {
    function SingleUserService(deps, config) {
        if (config === void 0) { config = {}; }
        this.config = config;
        this.client = deps.client;
        this.context = deps.context;
    }
    SingleUserService.prototype.current = function () {
        if (!this.user) {
            this.user = this.context.load(new User({ 'service': this }));
        }
        if (!this.user) {
            this.user = new User({ 'service': this });
        }
        return this.user;
    };
    SingleUserService.prototype.store = function () {
        this.context.store(this.current());
    };
    SingleUserService.prototype.unstore = function () {
        this.context.unstore();
    };
    SingleUserService.prototype.load = function (id) {
        if (id === void 0) { id = 'self'; }
        var deferred = new DeferredPromise();
        var user = this.current();
        this.client.get("/auth/users/" + id)
            .end(function (err, res) {
            if (err) {
                deferred.reject(err);
            }
            else {
                user.id = res.body.data.uuid;
                user.data = new UserData(res.body.data.custom);
                user.details = res.body.data.details;
                user.fresh = false;
                user.social = res.body.data.social;
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
    SingleUserService.prototype.delete = function () {
        var deferred = new DeferredPromise();
        if (!this.user) {
            return deferred.reject(new Error('No user loaded to delete.'));
        }
        if (this.user.isAnonymous()) {
            return deferred.reject(new Error('User is anonymous and cannot be deleted from the API.'));
        }
        this.unstore();
        this.client.delete("/auth/users/" + this.user.id)
            .end(function (err, res) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
    SingleUserService.prototype.save = function () {
        var _this = this;
        var deferred = new DeferredPromise();
        this.store();
        if (!this.user) {
            return deferred.reject(new Error('No user loaded to save.'));
        }
        if (this.user.isAnonymous()) {
            return deferred.reject(new Error('User is anonymous and cannot be updated in the API. Use load(<id>) or signup a user using auth.'));
        }
        this.client.patch("/auth/users/" + this.user.id)
            .send(this.user.serializeForAPI())
            .end(function (err, res) {
            if (err) {
                deferred.reject(err);
            }
            else {
                if (_this.user) {
                    _this.user.fresh = false;
                }
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
    return SingleUserService;
}());
export { SingleUserService };
