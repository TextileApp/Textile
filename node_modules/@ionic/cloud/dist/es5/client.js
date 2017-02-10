"use strict";
var request = require("superagent");
/**
 * `Client` is for making HTTP requests to the API.
 *
 * Under the hood, it uses
 * [superagent](http://visionmedia.github.io/superagent/). When a method is
 * called, you can call any number of superagent functions on it and then call
 * `end()` to complete and send the request.
 *
 * @featured
 */
var Client = (function () {
    function Client(
        /**
         * @hidden
         */
        tokenContext, 
        /**
         * @hidden
         */
        baseUrl, req // TODO: use superagent types
    ) {
        this.tokenContext = tokenContext;
        this.baseUrl = baseUrl;
        if (typeof req === 'undefined') {
            req = request['default'] || request;
        }
        this.req = req;
    }
    /**
     * GET request for retrieving a resource from the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    Client.prototype.get = function (endpoint) {
        return this.supplement(this.req.get, endpoint);
    };
    /**
     * POST request for sending a new resource to the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    Client.prototype.post = function (endpoint) {
        return this.supplement(this.req.post, endpoint);
    };
    /**
     * PUT request for replacing a resource in the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    Client.prototype.put = function (endpoint) {
        return this.supplement(this.req.put, endpoint);
    };
    /**
     * PATCH request for performing partial updates to a resource in the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    Client.prototype.patch = function (endpoint) {
        return this.supplement(this.req.patch, endpoint);
    };
    /**
     * DELETE request for deleting a resource from the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    Client.prototype.delete = function (endpoint) {
        return this.supplement(this.req.delete, endpoint);
    };
    /**
     * @hidden
     */
    Client.prototype.request = function (method, endpoint) {
        return this.supplement(this.req.bind(this.req, method), endpoint);
    };
    /**
     * @private
     */
    Client.prototype.supplement = function (fn, endpoint) {
        if (endpoint.substring(0, 1) !== '/') {
            throw Error('endpoint must start with leading slash');
        }
        var req = fn(this.baseUrl + endpoint);
        var token = this.tokenContext.get();
        if (token) {
            req.set('Authorization', "Bearer " + token);
        }
        return req;
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map