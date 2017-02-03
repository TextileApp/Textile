(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var win = window;
    // RequestAnimationFrame Polyfill (Android 4.3 and below)
    /*! @author Paul Irish */
    /*! @source https://gist.github.com/paulirish/1579671 */
    (function () {
        var rafLastTime = 0;
        if (!win.requestAnimationFrame) {
            win.requestAnimationFrame = function (callback) {
                var currTime = Date.now();
                var timeToCall = Math.max(0, 16 - (currTime - rafLastTime));
                var id = win.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                rafLastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!win.cancelAnimationFrame) {
            win.cancelAnimationFrame = function (id) { clearTimeout(id); };
        }
    })();
    // use native raf rather than the zone wrapped one
    var originalRaf = (win[win['Zone']['__symbol__']('requestAnimationFrame')] || win[win['Zone']['__symbol__']('webkitRequestAnimationFrame')]);
    // if the originalRaf from the Zone symbol is not available, we need to provide the polyfilled version
    exports.nativeRaf = originalRaf !== undefined ? originalRaf['bind'](win) : win.requestAnimationFrame.bind(win);
    // zone wrapped raf
    exports.raf = win.requestAnimationFrame.bind(win);
    exports.cancelRaf = win.cancelAnimationFrame.bind(win);
    exports.nativeTimeout = win[win['Zone']['__symbol__']('setTimeout')]['bind'](win);
    exports.clearNativeTimeout = win[win['Zone']['__symbol__']('clearTimeout')]['bind'](win);
    /**
     * Run a function in an animation frame after waiting `framesToWait` frames.
     *
     * @param framesToWait number how many frames to wait
     * @param callback Function the function call to defer
     * @return Function a function to call to cancel the wait
     */
    function rafFrames(framesToWait, callback) {
        framesToWait = Math.ceil(framesToWait);
        var rafId;
        var timeoutId;
        if (framesToWait === 0) {
            callback();
        }
        else if (framesToWait < 2) {
            rafId = exports.nativeRaf(callback);
        }
        else {
            timeoutId = exports.nativeTimeout(function () {
                rafId = exports.nativeRaf(callback);
            }, (framesToWait - 1) * 16.6667);
        }
        return function () {
            exports.clearNativeTimeout(timeoutId);
            exports.cancelRaf(exports.raf);
        };
    }
    exports.rafFrames = rafFrames;
    // TODO: DRY rafFrames and zoneRafFrames
    function zoneRafFrames(framesToWait, callback) {
        framesToWait = Math.ceil(framesToWait);
        if (framesToWait === 0) {
            callback();
        }
        else if (framesToWait < 2) {
            exports.raf(callback);
        }
        else {
            setTimeout(function () {
                exports.raf(callback);
            }, (framesToWait - 1) * 16.6667);
        }
    }
    exports.zoneRafFrames = zoneRafFrames;
    exports.CSS = {};
    (function () {
        // transform
        var i;
        var keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
            '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];
        for (i = 0; i < keys.length; i++) {
            if (document.documentElement.style[keys[i]] !== undefined) {
                exports.CSS.transform = keys[i];
                break;
            }
        }
        // transition
        keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
        for (i = 0; i < keys.length; i++) {
            if (document.documentElement.style[keys[i]] !== undefined) {
                exports.CSS.transition = keys[i];
                break;
            }
        }
        // The only prefix we care about is webkit for transitions.
        var isWebkit = exports.CSS.transition.indexOf('webkit') > -1;
        // transition duration
        exports.CSS.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';
        // transition timing function
        exports.CSS.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';
        // transition delay
        exports.CSS.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';
        // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
        exports.CSS.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
        // transform origin
        exports.CSS.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';
        // animation delay
        exports.CSS.animationDelay = (isWebkit ? 'webkitAnimationDelay' : 'animationDelay');
    })();
    function transitionEnd(el, callback) {
        if (el) {
            exports.CSS.transitionEnd.split(' ').forEach(function (eventName) {
                el.addEventListener(eventName, onEvent);
            });
            return unregister;
        }
        function unregister() {
            exports.CSS.transitionEnd.split(' ').forEach(function (eventName) {
                el.removeEventListener(eventName, onEvent);
            });
        }
        function onEvent(ev) {
            if (el === ev.target) {
                unregister();
                callback(ev);
            }
        }
    }
    exports.transitionEnd = transitionEnd;
    function ready(callback) {
        var promise = null;
        if (!callback) {
            // a callback wasn't provided, so let's return a promise instead
            promise = new Promise(function (resolve) { callback = resolve; });
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            callback();
        }
        else {
            document.addEventListener('DOMContentLoaded', completed, false);
            win.addEventListener('load', completed, false);
        }
        return promise;
        function completed() {
            document.removeEventListener('DOMContentLoaded', completed, false);
            win.removeEventListener('load', completed, false);
            callback();
        }
    }
    exports.ready = ready;
    function windowLoad(callback) {
        var promise = null;
        if (!callback) {
            // a callback wasn't provided, so let's return a promise instead
            promise = new Promise(function (resolve) { callback = resolve; });
        }
        if (document.readyState === 'complete') {
            callback();
        }
        else {
            win.addEventListener('load', completed, false);
        }
        return promise;
        function completed() {
            win.removeEventListener('load', completed, false);
            callback();
        }
    }
    exports.windowLoad = windowLoad;
    function pointerCoord(ev) {
        // get coordinates for either a mouse click
        // or a touch depending on the given event
        if (ev) {
            var changedTouches = ev.changedTouches;
            if (changedTouches && changedTouches.length > 0) {
                var touch = changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
            var pageX = ev.pageX;
            if (pageX !== undefined) {
                return { x: pageX, y: ev.pageY };
            }
        }
        return { x: 0, y: 0 };
    }
    exports.pointerCoord = pointerCoord;
    function hasPointerMoved(threshold, startCoord, endCoord) {
        if (startCoord && endCoord) {
            var deltaX = (startCoord.x - endCoord.x);
            var deltaY = (startCoord.y - endCoord.y);
            var distance = deltaX * deltaX + deltaY * deltaY;
            return distance > (threshold * threshold);
        }
        return false;
    }
    exports.hasPointerMoved = hasPointerMoved;
    function isActive(ele) {
        return !!(ele && (document.activeElement === ele));
    }
    exports.isActive = isActive;
    function hasFocus(ele) {
        return isActive(ele) && (ele.parentElement.querySelector(':focus') === ele);
    }
    exports.hasFocus = hasFocus;
    function isTextInput(ele) {
        return !!ele &&
            (ele.tagName === 'TEXTAREA' ||
                ele.contentEditable === 'true' ||
                (ele.tagName === 'INPUT' && !(exports.NON_TEXT_INPUT_REGEX.test(ele.type))));
    }
    exports.isTextInput = isTextInput;
    exports.NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;
    function hasFocusedTextInput() {
        var ele = document.activeElement;
        if (isTextInput(ele)) {
            return (ele.parentElement.querySelector(':focus') === ele);
        }
        return false;
    }
    exports.hasFocusedTextInput = hasFocusedTextInput;
    function focusOutActiveElement() {
        var activeElement = document.activeElement;
        activeElement && activeElement.blur && activeElement.blur();
    }
    exports.focusOutActiveElement = focusOutActiveElement;
    var skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id|autofocus|autocomplete|autocorrect)$/i;
    function copyInputAttributes(srcElement, destElement) {
        // copy attributes from one element to another
        // however, skip over a few of them as they're already
        // handled in the angular world
        var attrs = srcElement.attributes;
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (!skipInputAttrsReg.test(attr.name)) {
                destElement.setAttribute(attr.name, attr.value);
            }
        }
    }
    exports.copyInputAttributes = copyInputAttributes;
    /**
     * Get the element offsetWidth and offsetHeight. Values are cached
     * to reduce DOM reads. Cache is cleared on a window resize.
     */
    function getDimensions(ele, id) {
        var dimensions = dimensionCache[id];
        if (!dimensions) {
            // make sure we got good values before caching
            if (ele.offsetWidth && ele.offsetHeight) {
                dimensions = dimensionCache[id] = {
                    width: ele.offsetWidth,
                    height: ele.offsetHeight,
                    left: ele.offsetLeft,
                    top: ele.offsetTop
                };
            }
            else {
                // do not cache bad values
                return { width: 0, height: 0, left: 0, top: 0 };
            }
        }
        return dimensions;
    }
    exports.getDimensions = getDimensions;
    function clearDimensions(id) {
        delete dimensionCache[id];
    }
    exports.clearDimensions = clearDimensions;
    function windowDimensions() {
        if (!dimensionCache.win) {
            // make sure we got good values before caching
            if (win.innerWidth && win.innerHeight) {
                dimensionCache.win = {
                    width: win.innerWidth,
                    height: win.innerHeight
                };
            }
            else {
                // do not cache bad values
                return { width: 0, height: 0 };
            }
        }
        return dimensionCache.win;
    }
    exports.windowDimensions = windowDimensions;
    function flushDimensionCache() {
        dimensionCache = {};
    }
    exports.flushDimensionCache = flushDimensionCache;
    var dimensionCache = {};
});
//# sourceMappingURL=dom.js.map