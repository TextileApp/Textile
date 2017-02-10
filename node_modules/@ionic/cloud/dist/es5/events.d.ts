import { EventHandler, IEventReceiver, IEventEmitter } from './definitions';
/**
 * A registered event receiver.
 */
export declare class EventReceiver implements IEventReceiver {
    /**
     * An registered identifier for this event receiver.
     */
    key: string | number;
    /**
     * The registered name of the event.
     */
    event: string;
    /**
     * The actual callback.
     */
    handler: EventHandler;
    constructor(
        /**
         * An registered identifier for this event receiver.
         */
        key: string | number, 
        /**
         * The registered name of the event.
         */
        event: string, 
        /**
         * The actual callback.
         */
        handler: EventHandler);
}
/**
 * Stores callbacks for registered events.
 */
export declare class EventEmitter implements IEventEmitter {
    /**
     * @private
     */
    private n;
    /**
     * @private
     */
    private eventReceivers;
    /**
     * @private
     */
    private eventsEmitted;
    /**
     * Register an event callback which gets triggered every time the event is
     * fired.
     *
     * @param event
     *  The event name.
     * @param callback
     *  A callback to attach to this event.
     */
    on(event: string, callback: EventHandler): IEventReceiver;
    /**
     * Unregister an event receiver returned from
     * [`on()`](/api/client/eventemitter#on).
     *
     * @param receiver
     *  The event receiver.
     */
    off(receiver: IEventReceiver): void;
    /**
     * Register an event callback that gets triggered only once. If the event was
     * triggered before your callback is registered, it calls your callback
     * immediately.
     *
     * @note TODO: Fix the docs for () => void syntax.
     *
     * @param event
     *  The event name.
     * @param callback
     *  A callback to attach to this event. It takes no arguments.
     */
    once(event: string, callback: () => void): void;
    /**
     * Trigger an event. Call all callbacks in the order they were registered.
     *
     * @param event
     *  The event name.
     * @param data
     *  An object to pass to every callback.
     */
    emit(event: string, data?: Object): void;
    /**
     * Return a count of the number of times an event has been triggered.
     *
     * @param event
     *  The event name.
     */
    emitted(event: string): number;
}
