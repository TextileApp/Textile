/**
 * A registered event receiver.
 */
var EventReceiver = (function () {
    function EventReceiver(
        /**
         * An registered identifier for this event receiver.
         */
        key, 
        /**
         * The registered name of the event.
         */
        event, 
        /**
         * The actual callback.
         */
        handler) {
        this.key = key;
        this.event = event;
        this.handler = handler;
    }
    return EventReceiver;
}());
export { EventReceiver };
/**
 * Stores callbacks for registered events.
 */
var EventEmitter = (function () {
    function EventEmitter() {
        /**
         * @private
         */
        this.n = 0;
        /**
         * @private
         */
        this.eventReceivers = {};
        /**
         * @private
         */
        this.eventsEmitted = {};
    }
    /**
     * Register an event callback which gets triggered every time the event is
     * fired.
     *
     * @param event
     *  The event name.
     * @param callback
     *  A callback to attach to this event.
     */
    EventEmitter.prototype.on = function (event, callback) {
        if (typeof this.eventReceivers[event] === 'undefined') {
            this.eventReceivers[event] = {};
        }
        var receiver = new EventReceiver(this.n, event, callback);
        this.n++;
        this.eventReceivers[event][receiver.key] = receiver;
        return receiver;
    };
    /**
     * Unregister an event receiver returned from
     * [`on()`](/api/client/eventemitter#on).
     *
     * @param receiver
     *  The event receiver.
     */
    EventEmitter.prototype.off = function (receiver) {
        if (typeof this.eventReceivers[receiver.event] === 'undefined' ||
            typeof this.eventReceivers[receiver.event][receiver.key] === 'undefined') {
            throw new Error('unknown event receiver');
        }
        delete this.eventReceivers[receiver.event][receiver.key];
    };
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
    EventEmitter.prototype.once = function (event, callback) {
        var _this = this;
        if (this.emitted(event)) {
            callback();
        }
        else {
            this.on(event, function () {
                if (!_this.emitted(event)) {
                    callback();
                }
            });
        }
    };
    /**
     * Trigger an event. Call all callbacks in the order they were registered.
     *
     * @param event
     *  The event name.
     * @param data
     *  An object to pass to every callback.
     */
    EventEmitter.prototype.emit = function (event, data) {
        if (typeof this.eventReceivers[event] === 'undefined') {
            this.eventReceivers[event] = {};
        }
        if (typeof this.eventsEmitted[event] === 'undefined') {
            this.eventsEmitted[event] = 0;
        }
        for (var k in this.eventReceivers[event]) {
            this.eventReceivers[event][k].handler(data);
        }
        this.eventsEmitted[event] += 1;
    };
    /**
     * Return a count of the number of times an event has been triggered.
     *
     * @param event
     *  The event name.
     */
    EventEmitter.prototype.emitted = function (event) {
        if (typeof this.eventsEmitted[event] === 'undefined') {
            return 0;
        }
        return this.eventsEmitted[event];
    };
    return EventEmitter;
}());
export { EventEmitter };
