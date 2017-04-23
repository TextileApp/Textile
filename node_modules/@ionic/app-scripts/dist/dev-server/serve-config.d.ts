export interface ServeConfig {
    httpPort: number;
    host: string;
    rootDir: string;
    wwwDir: string;
    buildDir: string;
    isCordovaServe: boolean;
    launchBrowser: boolean;
    launchLab: boolean;
    browserToLaunch: string;
    useLiveReload: boolean;
    liveReloadPort: Number;
    notificationPort: Number;
    useServerLogs: boolean;
    notifyOnConsoleLog: boolean;
    useProxy: boolean;
}
export declare const LOGGER_DIR: string;
export declare const IONIC_LAB_URL: string;
export declare const IOS_PLATFORM_PATH: string;
export declare const ANDROID_PLATFORM_PATH: string;
