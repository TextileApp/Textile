import { CloudSettings, IConfig } from './definitions';
/**
 * @hidden
 */
export declare class Config implements IConfig {
    /**
     * The cloud config.
     */
    settings: CloudSettings;
    /**
     * @private
     */
    private urls;
    /**
     * Register a new config.
     */
    register(settings: CloudSettings): void;
    /**
     * Get a value from the core settings. You should use `settings` attribute
     * directly for core settings and other settings.
     *
     * @deprecated
     *
     * @param name - The settings key to get.
     */
    get(name: string): any;
    /**
     * @hidden
     */
    getURL(name: string): string;
}
