import { APIResponse, APIResponseError, APIResponseSuccess } from './definitions';
export declare function isAPIResponseSuccess(x: APIResponse): x is APIResponseSuccess;
export declare function isAPIResponseError(x: APIResponse): x is APIResponseError;
