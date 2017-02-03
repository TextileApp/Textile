"use strict";
(function (BuildState) {
    BuildState[BuildState["SuccessfulBuild"] = 0] = "SuccessfulBuild";
    BuildState[BuildState["RequiresUpdate"] = 1] = "RequiresUpdate";
    BuildState[BuildState["RequiresBuild"] = 2] = "RequiresBuild";
})(exports.BuildState || (exports.BuildState = {}));
var BuildState = exports.BuildState;
;
;
