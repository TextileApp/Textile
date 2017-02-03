import { BuildContext, ChangedFile } from './util/interfaces';
export declare function watch(context?: BuildContext, configFile?: string): Promise<void>;
export declare function prepareWatcher(context: BuildContext, watcher: Watcher): void;
export declare function buildUpdate(event: string, filePath: string, context: BuildContext): Promise<void>;
export declare function copyUpdate(event: string, filePath: string, context: BuildContext): Promise<void>;
export declare function runBuildUpdate(context: BuildContext, changedFiles: ChangedFile[]): ChangedFile[];
export interface WatchConfig {
    [index: string]: Watcher;
}
export interface Watcher {
    paths?: string[] | string;
    options?: {
        ignored?: string | string[] | Function;
        ignoreInitial?: boolean;
        followSymlinks?: boolean;
        cwd?: string;
    };
    eventName?: string;
    callback?: {
        (event: string, filePath: string, context: BuildContext): Promise<any>;
    };
}
