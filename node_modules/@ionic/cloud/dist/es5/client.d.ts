import { IClient, ITokenContext } from './definitions';
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
export declare class Client implements IClient {
    /**
     * @hidden
     */
    tokenContext: ITokenContext;
    /**
     * @hidden
     */
    baseUrl: string;
    /**
     * @private
     */
    private req;
    constructor(
        /**
         * @hidden
         */
        tokenContext: ITokenContext, 
        /**
         * @hidden
         */
        baseUrl: string, req?: any);
    /**
     * GET request for retrieving a resource from the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    get(endpoint: string): any;
    /**
     * POST request for sending a new resource to the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    post(endpoint: string): any;
    /**
     * PUT request for replacing a resource in the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    put(endpoint: string): any;
    /**
     * PATCH request for performing partial updates to a resource in the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    patch(endpoint: string): any;
    /**
     * DELETE request for deleting a resource from the API.
     *
     * @param endpoint - The path of the API endpoint.
     */
    delete(endpoint: string): any;
    /**
     * @hidden
     */
    request(method: string, endpoint: string): any;
    /**
     * @private
     */
    private supplement(fn, endpoint);
}
