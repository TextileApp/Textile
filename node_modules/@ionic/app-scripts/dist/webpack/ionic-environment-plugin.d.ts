import { FileCache } from '../util/file-cache';
export declare class IonicEnvironmentPlugin {
    private fileCache;
    constructor(fileCache: FileCache);
    apply(compiler: any): void;
    private initializeWebpackFileSystemCaches(webpackFileSystem);
}
