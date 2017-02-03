"use strict";
var typescript_utils_1 = require('../util/typescript-utils');
function optimizeJavascript(filePath, fileContent) {
    fileContent = typescript_utils_1.removeDecorators(filePath, fileContent);
    fileContent = purgeDecoratorStatements(filePath, fileContent, ['@angular']);
    // TODO - needs more testing to fully understand
    // fileContent = purgeCtorStatements(filePath, fileContent, ['@angular']);
    fileContent = purgeKnownContent(filePath, fileContent, ['@angular']);
    return fileContent;
}
exports.optimizeJavascript = optimizeJavascript;
function purgeDecoratorStatements(filePath, fileContent, exclusions) {
    var exclude = shouldExclude(filePath, exclusions);
    if (exclude) {
        return fileContent.replace(DECORATORS_REGEX, '');
    }
    return fileContent;
}
exports.purgeDecoratorStatements = purgeDecoratorStatements;
function purgeCtorStatements(filePath, fileContent, exclusions) {
    var exclude = shouldExclude(filePath, exclusions);
    if (exclude) {
        return fileContent.replace(CTOR_PARAM_REGEX, '');
    }
    return fileContent;
}
exports.purgeCtorStatements = purgeCtorStatements;
function purgeKnownContent(filePath, fileContent, exclusions) {
    var exclude = shouldExclude(filePath, exclusions);
    if (exclude) {
        return fileContent.replace(TREE_SHAKEABLE_IMPORTS, '');
    }
    return fileContent;
}
exports.purgeKnownContent = purgeKnownContent;
function shouldExclude(filePath, exclusions) {
    for (var exclusion in exclusions) {
        if (filePath.includes(exclusion)) {
            return true;
        }
    }
    return false;
}
var DECORATORS_REGEX = /(.+)\.decorators[\s\S\n]*?([\s\S\n]*?)];/igm;
var CTOR_PARAM_REGEX = /(.+).ctorParameters[\s\S\n]*?([\s\S\n]*?)];/igm;
var TREE_SHAKEABLE_IMPORTS = /\/\* AoT Remove Start[\s\S\n]*?([\s\S\n]*?)AoT Remove End \*\//igm;
