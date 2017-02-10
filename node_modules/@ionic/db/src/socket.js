import { AsyncSubject } from 'rxjs/AsyncSubject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/first'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/ignoreElements'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/takeWhile'
import 'rxjs/add/operator/publish'
import 'rxjs/add/operator/switchMap'

import { serialize, deserialize } from './serialization.js'

let errorObject = { e: undefined };

let tryCatchTarget;

function tryCatcher(t) {
  try {
    return tryCatchTarget.apply(t, arguments);
  } catch (e) {
    errorObject.e = e;
    return errorObject;
  }
}

export function tryCatch(fn) {
  tryCatchTarget = fn;
  return tryCatcher;
};

const PROTOCOL_VERSION = 'ionicdb-v0'

// Before connecting the first time
const STATUS_UNCONNECTED = { type: 'unconnected' }
// After the websocket is opened and handshake is completed
const STATUS_CONNECTED = { type: 'connected' }
// After unconnected, maybe before or after connected. Any socket level error
const STATUS_ERROR = { type: 'error' }
// Occurs when the socket closes
const STATUS_DISCONNECTED = { type: 'disconnected' }
// Occurs when attempting to reconnect
const STATUS_RECONNECTING = { type: 'reconnecting' }

class ProtocolError extends Error {
  constructor(msg, errorCode) {
    super(msg)
    this.errorCode = errorCode
  }
  toString() {
    return `${this.message} (Code: ${this.errorCode})`
  }
}


// Wraps native websockets with a Subject, which is both an Subscriber
// and an Observable (it is bi-directional after all!). This version
// is based on the rxjs.observable.dom.WebSocketSubject implementation.
export class IonicDBSocket extends WebSocketSubject {
  // Deserializes a message from a string. Overrides the version
  // implemented in WebSocketSubject
  resultSelector(e) {
    return deserialize(JSON.parse(e.data))
  }

  // We're overriding the next defined in AnonymousSubject so we
  // always serialize the value. When this is called a message will be
  // sent over the socket to the server.
  next(value) {
    const request = JSON.stringify(serialize(value))
    super.next(request)
  }

  constructor({
    url,              // Full url to connect to
    handshakeMaker, // function that returns handshake to emit
    keepalive = 60,   // seconds between keepalive messages
    retry = 5, // seconds to wait before attempting reconnect
    WebSocketCtor = WebSocket,    // optionally provide a WebSocket constructor
  } = {}) {
    super({
      url,
      protocol: PROTOCOL_VERSION,
      WebSocketCtor,
      openObserver: {
        next: () => this.sendHandshake(),
      },
      closeObserver: {
        next: (e) => {
          // If we didn't close cleanly we should reconnect
          // else we close up shop
          if (e.code !== 1000) {
            let reason = e.reason || `Unexpected disconnect with error code ${e.code}.`;
            console.error("Connection Failed: ", reason);
            if (this._autoreconnect) {
              console.error("Retrying in " + retry + " seconds.");
              this.status.next(STATUS_RECONNECTING)
              this.handshake = new AsyncSubject()
              this._reconnecting = true;
              setTimeout( () => {
                if (this._autoreconnect) {
                  this.sendHandshake();
                } else {
                  this.status.next(STATUS_DISCONNECTED)
                  if (this._handshakeSub) {
                    this._handshakeSub.unsubscribe()
                    this._handshakeSub = null
                  }
                }
              }, retry * 1000)
            } else {
                this.status.next(STATUS_DISCONNECTED)
                if (this._handshakeSub) {
                  this._handshakeSub.unsubscribe()
                  this._handshakeSub = null
                }
            }
          } else { 
            this.status.next(STATUS_DISCONNECTED)
            if (this._handshakeSub) {
              this._handshakeSub.unsubscribe()
              this._handshakeSub = null
            }
          }
        },
      },
    })
    // Completes or errors based on handshake success. Buffers
    // handshake response for later subscribers (like a Promise)
    this.handshake = new AsyncSubject()
    this._handshakeMaker = handshakeMaker
    this._handshakeSub = null
    this._reconnecting = false;
    this._autoreconnect = true;

    this.keepalive = Observable
      .timer(keepalive * 1000, keepalive * 1000)
      .map(n => this.hzRequest({ type: 'keepalive' }).subscribe())
      .publish()

    // This is used to emit status changes that others can hook into.
    this.status = new BehaviorSubject(STATUS_UNCONNECTED)
    // Keep track of subscribers so we's can decide when to
    // unsubscribe.
    this.requestCounter = 0
    // A map from request_ids to an object with metadata about the
    // request. Eventually, this should allow re-sending requests when
    // reconnecting.
    this.activeRequests = new Map()
    this.activeSubscriptions = new Map()
    this._output.subscribe({
      // This emits if the entire socket errors (usually due to
      // failure to connect)
      error: () => {
        this.status.next(STATUS_ERROR);
      },
    })
  }

  disconnect() {
    this._autoreconnect = false;
    for(let sub of this.activeSubscriptions.values()){
      sub.complete();
    }
    this.complete();
    if (this._handshakeSub) {
      this._handshakeSub.unsubscribe()
      this._handshakeSub = null
    }
  }

  multiplex(subMsg, unsubMsg, messageFilter, state) {
    return new Observable((observer) => {
      // If we are reconnecting let everyone
      // down the line know so that they know
      // the changefeed is going to rebuild and
      // can respond appropriately
      if (state === STATUS_RECONNECTING) {
        observer.next({state: state.type});
      }

      const result = tryCatch(subMsg)();
      if (result === errorObject) {
        observer.error(errorObject.e);
      } else {
        if (result.method) {
          this.next(result);
        } else {
          this.status.first( x => x === STATUS_CONNECTED).subscribe( () => this.next(result));
        }
      }

      let subscription = this.subscribe(x => {
        const result = tryCatch(messageFilter)(x);
        if (result === errorObject) {
          observer.error(errorObject.e);
        } else if (result) {
          if(state.type === "keepalive" && x.state === "complete"){
            observer.complete();
          } else {
            observer.next(x);
          }
        }
      },
        err => {
          // We need to eat errors here so that reconnect works
          // and the observers don't unsubscribe themselves
          // if the entire socket errors
        },
        () => observer.complete());

      return () => {
        const result = tryCatch(unsubMsg)();
        if (result === errorObject) {
          observer.error(errorObject.e);
        } else {
          this.next(result);
        }
        subscription.unsubscribe();
      };
    });
  }

  deactivateRequest(req) {
    return () => {
      this.activeRequests.delete(req.request_id)
      this.activeSubscriptions.delete(req.request_id);
      return { request_id: req.request_id, type: 'end_subscription' }
    }
  }

  activateRequest(req) {
    return () => {
      this.activeRequests.set(req.request_id, req)
      return req
    }
  }

  filterRequest(req) {
    return resp => resp.request_id === req.request_id
  }

  getRequest(request) {
    return Object.assign({ request_id: this.requestCounter++ }, request)
  }

  // This is a trimmed-down version of multiplex that only listens for
  // the handshake requestId. It also starts the keepalive observable
  // and cleans up after it when the handshake is cleaned up.
  sendHandshake() {
    if (!this._handshakeSub || this._reconnecting) {
      let oldHandshakeSub = this._handshakeSub;
      let isReconnect = this._reconnecting;
      this._reconnecting = false;
      this._handshakeSub = this.makeRequest(this._handshakeMaker())
        .subscribe({
          next: n => {
            if (n.error) {
              this.status.next(STATUS_ERROR)
              this.handshake.error(new ProtocolError(n.error, n.error_code))
            } else {
              this.status.next(STATUS_CONNECTED)
              this._autoreconnect = true; // Renable autoreconnect
              if (isReconnect) {
                for(let sub of this.activeSubscriptions.values()){
                  sub.next(STATUS_RECONNECTING);
                }
              }
              this.handshake.next(n)
              this.handshake.complete()
            }
          },
          error: e => {
            this.status.next(STATUS_ERROR)
            this.handshake.error(e)
          },
        })

      // Start the keepalive and make sure it's
      // killed when the handshake is cleaned up
      this._handshakeSub.add(this.keepalive.connect())
        
      // clean up in the case of reconnect
      if (oldHandshakeSub) {
        oldHandshakeSub.unsubscribe();
      }
    }
    return this.handshake
  }

  // Incorporates shared logic between the inital handshake request and
  // all subsequent requests.
  // * Generates a request id and filters by it
  // * Send `end_subscription` when observable is unsubscribed
  makeRequest(rawRequest) {
    const request = this.getRequest(rawRequest)

    if(request.type === 'subscribe'){
      return this._sub_query(request);
    }else {
      return this.multiplex(
        this.activateRequest(request),
        this.deactivateRequest(request),
        this.filterRequest(request),
        request
      );
    }
  }

  // Creates a subscription query that can survive reconnects
  _sub_query(request){
    let sub = new BehaviorSubject(STATUS_CONNECTED);
    this.activeSubscriptions.set(request.request_id, sub);

    return sub.switchMap( state => {
      return this.multiplex(
        this.activateRequest(request),
        this.deactivateRequest(request),
        this.filterRequest(request),
        state
      )
    });
  }

  // Wrapper around the makeRequest with the following additional
  // features we need for horizon's protocol:
  // * Sends handshake on subscription if it hasn't happened already
  // * Wait for the handshake to complete before sending the request
  // * Errors when a document with an `error` field is received
  // * Completes when `state: complete` is received
  // * Emits `state: synced` as a separate document for easy filtering
  // * Reference counts subscriptions
  hzRequest(rawRequest) {
    return this.sendHandshake().ignoreElements()
      .concat(this.makeRequest(rawRequest))
      .concatMap(resp => {
        if (resp.error !== undefined) {
          throw new ProtocolError(resp.error, resp.error_code)
        }
        const data = resp.data || []

        if (resp.state !== undefined) {
          // Create a little dummy object for sync notifications
          data.push({
            type: 'state',
            state: resp.state,
          })
        }

        return data
      })
      .share()
  }
}
