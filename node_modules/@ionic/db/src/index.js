import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/do'

import { Collection, UserDataTerm } from './ast'
import { IonicDBSocket } from './socket'
import { TokenStorage, clearAuthTokens } from './auth'
import { aggregate, model } from './model'

export class IonicDB {
  
  constructor({
    host = 'api.ionic.io',
    secure = true,
    path = 'ionicdb',
    lazyWrites = false,
    app_id = undefined,
    authType = 'unauthenticated',
    keepalive = 50, // ELB defaults to 60 so this should keep us alive
    retry = 5, // Default retry timeout to 5 seconds
    WebSocketCtor = WebSocket,
  } = {}) {

    if (app_id) {
      path = path + '/' +  app_id;
    }
    if (authType === 'authenticated') {
      authType = 'token';
    } else {
      authType = 'unauthenticated'
    }

    const tokenStorage = new TokenStorage({ authType, path })
    tokenStorage.setAuthFromQueryParams()

    const url = `ws${secure ? 's' : ''}:\/\/${host}\/${path}`
    const socket = new IonicDBSocket({
      url,
      handshakeMaker: tokenStorage.handshake.bind(tokenStorage),
      keepalive,
      retry,
      WebSocketCtor,
    })

    // Store whatever token we get back from the server when we get a
    // handshake response
    socket.handshake.subscribe({
      next(handshake) {
        if (authType !== 'unauthenticated') {
          tokenStorage.set(handshake.token)
        }
      },
      error(err) {
        if (/JsonWebTokenError|TokenExpiredError/.test(err.message)) {
          console.error('IonicDB: clearing token storage since auth failed')
          tokenStorage.remove()
        }
      },
    })

    // This is the object returned by the IonicDB function. It's a
    // function so we can construct a collection simply by calling it
    // like this.collection('my_collection')

    this.collection = (name) => {
      return new Collection(sendRequest, name, lazyWrites, this._digest)
    }

    this.currentUser = () =>
      new UserDataTerm(this, socket.handshake, socket)

    this.disconnect = () => {
      socket.disconnect()
    }

    // Dummy subscription to force it to connect to the
    // server. Optionally provide an error handling function if the
    // socket experiences an error.
    // Note: Users of the Observable interface shouldn't need this
    this.connect = (
      onError = err => { console.error(`Received an error: ${err}`) }
    ) => {
      socket.subscribe(
        () => {},
        onError
      )
    }

    // Either subscribe to status updates, or return an observable with
    // the current status and all subsequent status changes.
    this.status = () => socket.status.do(this._digest)

    // Convenience method for finding out when disconnected
    this.onDisconnected = () => this.status().filter(x => x.type === 'disconnected')

    // Convenience method for finding out when ready
    this.onConnected = () => this.status().filter(x => x.type === 'connected')

    // Convenience method for finding out when an error occurs
    this.onSocketError = () => this.status().filter(x => x.type === 'error')

    // Convenience method for finding out when ready
    this.onReconnecting = () => this.status().filter(x => x.type === 'reconnecting')

    this.utensils = {
      sendRequest,
      tokenStorage,
      handshake: socket.handshake,
    }
    Object.freeze(this.utensils)

    this._authMethods = null
    this._root = `http${(secure) ? 's' : ''}://${host}`
    this._thisPath = `${this._root}/${path}`
    this.hasAuthToken = tokenStorage.hasAuthToken.bind(tokenStorage)
    this.setToken = tokenStorage.set.bind(tokenStorage)
    this.removeToken = tokenStorage.remove.bind(tokenStorage)
    this.aggregate = aggregate
    this.model = model


    // Sends a this protocol request to the server, and pulls the data
    // portion of the response out.
    function sendRequest(type, options) {
      // Both remove and removeAll use the type 'remove' in the protocol
      const normalizedType = type === 'removeAll' ? 'remove' : type
      return socket
        .hzRequest({ type: normalizedType, options }) // send the raw request
        .takeWhile(resp => resp.state !== 'complete')
    }

  }
}

IonicDB.Socket = IonicDBSocket
IonicDB.clearAuthTokens = clearAuthTokens
