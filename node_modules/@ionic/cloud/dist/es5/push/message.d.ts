import { AppStatus, IPushMessage, PushPluginNotification } from '../definitions';
/**
 * Represents a push notification sent to the device.
 *
 * @featured
 */
export declare class PushMessage implements IPushMessage {
    /**
     * Native information about the app when the push message was received.
     */
    app: AppStatus;
    /**
     * The message of this push message.
     */
    text: string;
    /**
     * The title of this push message.
     */
    title: string;
    /**
     * The badge count that was set by this push message.
     */
    count: number;
    /**
     * The sound that was played by this push message.
     */
    sound: string;
    /**
     * The image of this push message.
     */
    image: string;
    /**
     * The custom payload of this push message.
     */
    payload: Object;
    /**
     * The raw notification object from the push plugin callback.
     *
     * @hidden
     */
    raw: PushPluginNotification;
    /**
     * Create a PushMessage from the push plugin's format.
     *
     * @hidden
     *
     * @param data - The plugin's notification object.
     */
    static fromPluginData(data: PushPluginNotification): PushMessage;
    toString(): string;
}
