"use strict";
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var SEMVER_REGEX = /^v?([0-9]+)\.?([0-9]+)?\.?([0-9]+)?\.?.*$/;
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}
exports.isValidEmail = isValidEmail;
function parseSemanticVersion(s) {
    var r = s.trim().match(SEMVER_REGEX);
    if (!r) {
        throw new Error('Invalid semantic version.');
    }
    var v = {
        'major': Number(r[1])
    };
    if (r[2]) {
        v.minor = Number(r[2]);
    }
    if (r[3]) {
        v.patch = Number(r[3]);
    }
    return v;
}
exports.parseSemanticVersion = parseSemanticVersion;
//# sourceMappingURL=util.js.map