"use strict";
var cleanCss = require('clean-css');
function getCleanCssInstance(options) {
    return new cleanCss(options);
}
exports.getCleanCssInstance = getCleanCssInstance;
