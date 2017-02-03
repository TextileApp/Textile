"use strict";
var uglifyjs = require('./uglifyjs');
var configUtil = require('./util/config');
var workerClient = require('./worker-client');
describe('uglifyjs function', function () {
    beforeEach(function () {
        spyOn(configUtil, 'getUserConfigFile').and.returnValue('fileContents');
        spyOn(workerClient, 'runWorker').and.returnValue(Promise.resolve());
    });
    it('should call workerClient function', function () {
        var context = {};
        var configFile = 'configFileContents';
        return uglifyjs.uglifyjs(context, configFile).then(function () {
            expect(configUtil.getUserConfigFile).toHaveBeenCalledWith(context, uglifyjs.taskInfo, configFile);
            expect(workerClient.runWorker).toHaveBeenCalledWith('uglifyjs', 'uglifyjsWorker', context, 'fileContents');
        });
    });
});
