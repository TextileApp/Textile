"use strict";
var interfaces_1 = require('./util/interfaces');
var file_cache_1 = require('./util/file-cache');
var watch_1 = require('./watch');
var watch_2 = require('./watch');
var path = require('path');
describe('watch', function () {
    describe('runBuildUpdate', function () {
        it('should require transpile full build for html file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for html file change and not already successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require template update for html file change and already successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.html',
                    ext: '.html'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            watch_1.runBuildUpdate(context, files);
            expect(context.templateState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for ts file unlink', function () {
            var files = [{
                    event: 'unlink',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for ts file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for scss file add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require sass update for scss file change', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.sassState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile full build for single ts add, but only bundle update when already successful bundle', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile full build for single ts add', function () {
            var files = [{
                    event: 'add',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for single ts change and not in file cache', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile update only and full bundle build for single ts change and already in file cache and hasnt already had successful bundle', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            context.bundleState = interfaces_1.BuildState.SuccessfulBuild;
            var resolvedFilePath = path.resolve('file1.ts');
            context.fileCache.set(resolvedFilePath, { path: 'file1.ts', content: 'content' });
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresUpdate);
        });
        it('should require transpile update only and bundle update for single ts change and already in file cache and bundle already successful', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }];
            var resolvedFilePath = path.resolve('file1.ts');
            context.fileCache.set(resolvedFilePath, { path: 'file1.ts', content: 'content' });
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresUpdate);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should require transpile full build for multiple ts changes', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.ts',
                    ext: '.ts'
                }, {
                    event: 'change',
                    filePath: 'file2.ts',
                    ext: '.ts'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.transpileState).toEqual(interfaces_1.BuildState.RequiresBuild);
            expect(context.bundleState).toEqual(interfaces_1.BuildState.RequiresBuild);
        });
        it('should not update bundle state if no transpile changes', function () {
            var files = [{
                    event: 'change',
                    filePath: 'file1.scss',
                    ext: '.scss'
                }];
            watch_1.runBuildUpdate(context, files);
            expect(context.bundleState).toEqual(undefined);
        });
        it('should do nothing if there are no changed files', function () {
            expect(watch_1.runBuildUpdate(context, [])).toEqual(null);
            expect(watch_1.runBuildUpdate(context, null)).toEqual(null);
        });
        var context;
        beforeEach(function () {
            context = {
                fileCache: new file_cache_1.FileCache()
            };
        });
    });
    describe('prepareWatcher', function () {
        it('should do nothing when options.ignored is a function', function () {
            var ignoreFn = function () { };
            var watcher = { options: { ignored: ignoreFn } };
            var context = { srcDir: '/some/src/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.ignored).toBe(ignoreFn);
        });
        it('should set replacePathVars when options.ignored is a string', function () {
            var watcher = { options: { ignored: '{{SRC}}/**/*.spec.ts' } };
            var context = { srcDir: '/some/src/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.ignored).toEqual('/some/src/**/*.spec.ts');
        });
        it('should set replacePathVars when paths is an array', function () {
            var watcher = { paths: [
                    '{{SRC}}/some/path1',
                    '{{SRC}}/some/path2'
                ] };
            var context = { srcDir: '/some/src/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.paths.length).toEqual(2);
            expect(watcher.paths[0]).toEqual('/some/src/some/path1');
            expect(watcher.paths[1]).toEqual('/some/src/some/path2');
        });
        it('should set replacePathVars when paths is a string', function () {
            var watcher = { paths: '{{SRC}}/some/path' };
            var context = { srcDir: '/some/src/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.paths).toEqual('/some/src/some/path');
        });
        it('should not set options.ignoreInitial if it was provided', function () {
            var watcher = { options: { ignoreInitial: false } };
            var context = {};
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.ignoreInitial).toEqual(false);
        });
        it('should set options.ignoreInitial to true if it wasnt provided', function () {
            var watcher = { options: {} };
            var context = {};
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.ignoreInitial).toEqual(true);
        });
        it('should not set options.cwd from context.rootDir if it was provided', function () {
            var watcher = { options: { cwd: '/my/cwd/' } };
            var context = { rootDir: '/my/root/dir/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.cwd).toEqual('/my/cwd/');
        });
        it('should set options.cwd from context.rootDir if it wasnt provided', function () {
            var watcher = {};
            var context = { rootDir: '/my/root/dir/' };
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options.cwd).toEqual(context.rootDir);
        });
        it('should create watcher options when not provided', function () {
            var watcher = {};
            var context = {};
            watch_2.prepareWatcher(context, watcher);
            expect(watcher.options).toBeDefined();
        });
    });
});
