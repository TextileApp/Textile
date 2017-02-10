## Ionic Deploy Plugin

The Cordova plugin for Ionic Deploy.

Check out our [docs](http://docs.ionic.io/services/deploy/) for more detailed information.

## Installation

See our [docs](http://docs.ionic.io/services/deploy/) for installation steps.

## Cordova Plugin API


### `IonicDeploy`

- this Cordova plugin defines a new global `IonicDeploy` object

- this object exposes the following methods


#### `init (appId: String, serverUrl: String)`

- appId: `String`
- serverUrl: `String`

Example:

```js
IonicDeploy.init('org.cordova.helloworld', 'https://helloworld.org/deploy')
```


#### `check (appId, channelTag, onSuccess, onError)`

- appId: `String`
- channelTag: `String`
- onSuccess: `CheckHandler`
- onError: `ErrorHandler`

Contact the remote IonicDeploy service (as configured during `IonicDeploy.init(...)`) and passes the result along to `IonicDeploy.init(...)`.


##### `CheckHandler (result)`

- result: `String`

- if `result` is the string `"true"`, then a new update is available


##### `ErrorHandler (error)`


#### `parseUpdate (appId, response, onSuccess, onError)`

- appId: `String`
- response: `UpdateResponse`
- onSuccess: `CheckHandler`
- onError: `ErrorHandler`

Determine whether an update is available, by checking the provided response data. Store metadata from available updates for future calls to `IonicDeploy.download(...)`.

This function is useful for testing, and also for using a custom remote update service. For all other use cases, you should just use `IonicDeploy.check(...)`.


##### `UpdateResponse`

```
interface UpdateResponse {
  data: {
    available: Boolean,
    compatible: Boolean,
    snapshot: String, // (unique per update, e.g. UUID)
    url: String // (URL to download)
  }
}
```


#### `download (appId, onSuccess, onError)`

- appId: `String`
- onSuccess: `DownloadHandler`
- onError: `ErrorHandler`

Using the metadata from a recent `IonicDeploy.check(...)` (or `IonicDeploy.parseUpdate(...)`), download and store an available update ZIP file.


##### `DownloadHandler (result)`

- result: `String` or `Number`

If `result` is a numeric value, it communicates progress. If `result` is the string `"true"`, it communicates completion.


#### `extract (appId, onSuccess, onError)`

- appId: `String`
- onSuccess: `ExtractHandler`
- onError: `ErrorHandler`

Unpack and apply the update ZIP file from a recent `IonicDeploy.download(...)`. After the app is [terminated](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/TheAppLifeCycle/TheAppLifeCycle.html#//apple_ref/doc/uid/TP40007072-CH2-SW7) / [destroyed](https://developer.android.com/reference/android/app/Activity.html#onDestroy()) by the operating system, the update will take effect.

The contents of the ZIP file should be the contents of the platform-specific "www" directory from a Cordova project. This directory is regenerated during `cordova build`.


##### `ExtractHandler (result)`

- result: `String` or `Number`

If `result` is a numeric value, it communicates progress. If `result` is the string `"done"`, it communicates completion.


#### `redirect (appId)`

- appId: `String`

Navigate the webview to the version provided by a recent `IonicDeploy.extract(...)`. This is useful for use cases where it is undesirable to wait for the operating system to terminate / destroy the app.

Any unsaved user data / state will be lost, so design your UX and/or data persistence approach accordingly.
