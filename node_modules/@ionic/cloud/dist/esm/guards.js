export function isAPIResponseSuccess(x) {
    return x.meta.status < 400;
}
export function isAPIResponseError(x) {
    return x.meta.status >= 400;
}
