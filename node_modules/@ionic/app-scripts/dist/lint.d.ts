import { BuildContext, ChangedFile } from './util/interfaces';
export declare function lint(context: BuildContext, configFile?: string): Promise<{}>;
export declare function lintWorker(context: BuildContext, configFile: string): Promise<void | any[]>;
export declare function lintUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<{}>;
export declare function lintUpdateWorker(context: BuildContext, workerConfig: LintWorkerConfig): Promise<void | any[]>;
export interface LintWorkerConfig {
    configFile: string;
    filePaths: string[];
}
