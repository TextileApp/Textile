import { ILogger, LogFn, LoggerOptions } from './definitions';
/**
 * Simple console logger.
 */
export declare class Logger implements ILogger {
    options: LoggerOptions;
    /**
     * The function to use to log info level messages.
     */
    infofn: LogFn;
    /**
     * The function to use to log warn level messages.
     */
    warnfn: LogFn;
    /**
     * The function to use to log error level messages.
     */
    errorfn: LogFn;
    constructor(options?: LoggerOptions);
    /**
     * Send a log at info level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    info(message?: any, ...optionalParams: any[]): void;
    /**
     * Send a log at warn level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    warn(message?: any, ...optionalParams: any[]): void;
    /**
     * Send a log at error level.
     *
     * @note TODO: Fix optionalParams in docs.
     *
     * @param message - The message to log.
     */
    error(message?: any, ...optionalParams: any[]): void;
}
