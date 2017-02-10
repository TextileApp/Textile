import { DBSettings, DBDependencies } from '../definitions';
export declare class Database {
    private settings;
    private config;
    private client;
    private emitter;
    private storage;
    private _curr_retry;
    private _hz_settings;
    private _retrying;
    horizon: any;
    constructor(deps: DBDependencies, settings: DBSettings);
    connect(): void;
    private _registerListeners();
    private _reconnect();
}
