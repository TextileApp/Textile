import { IInsights, IStatSerialized, InsightsDependencies, InsightsOptions } from './definitions';
/**
 * @hidden
 */
export declare class Stat {
    appId: string;
    stat: string;
    value: number;
    created: Date;
    constructor(appId: string, stat: string, value?: number);
    toJSON(): IStatSerialized;
}
/**
 * A client for Insights that handles batching, user activity insight, and
 * sending insights at an interval.
 *
 * @hidden
 */
export declare class Insights implements IInsights {
    options: InsightsOptions;
    /**
     * @private
     */
    private app;
    /**
     * @private
     */
    private storage;
    /**
     * @private
     */
    private config;
    /**
     * @private
     */
    private client;
    /**
     * @private
     */
    private device;
    /**
     * @private
     */
    private logger;
    /**
     * @private
     */
    private batch;
    constructor(deps: InsightsDependencies, options?: InsightsOptions);
    /**
     * Track an insight.
     *
     * @param stat - The insight name.
     * @param value - The number by which to increment this insight.
     */
    track(stat: string, value?: number): void;
    protected checkActivity(): void;
    protected markActive(): void;
    protected normalizeDevicePlatform(platform: string): string;
    protected normalizeVersion(s: string): string;
    protected trackStat(stat: Stat): void;
    protected shouldSubmit(): boolean;
    protected submit(): void;
}
