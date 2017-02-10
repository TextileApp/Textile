"use strict";
function isAPIResponseSuccess(x) {
    return x.meta.status < 400;
}
exports.isAPIResponseSuccess = isAPIResponseSuccess;
function isAPIResponseError(x) {
    return x.meta.status >= 400;
}
exports.isAPIResponseError = isAPIResponseError;
//# sourceMappingURL=guards.js.map