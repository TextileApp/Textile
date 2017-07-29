Changelog
=========

## 0.6.7

* (fix) Check size of elements before unzipping.

## 0.6.6

* (fix) Use loadRequest instead of loadFileURL for WKWebView

## 0.6.5

* (fix) Rework initialization step on iOS. Fixes #94
* (fix) Clear history on redirect on Android. Fixes #53
* Clean up recreatePLugins variable - PR #91

## 0.6.4

* (fix) Remove `shouldOverrideLoadWithRequest`. Fixes #77
* (fix) Update download/unzip for already loaded deploys. Fixes #67

## 0.6.3

* README update

## 0.6.2

* (fix) Redirect after reloading webview. Fixes #86

## 0.6.1

* (fix) Update `index.html` regexes to **only** target the `cordova.js`. PR #85
* (fix) Use callback context when http requests don't return as expected. PR #82

## 0.6.0

* Ionic 2 support
* (fix) Webview is now reloaded on a redirect - PR #80
* **(breaking)** You **must** include `cordova.js` in your `index.html` for full plugin support.

## 0.5.7

* Expose new `parseUpdate()` method for custom remote support - PR #76

## 0.5.6

* Update `plugin.xml` version, `package.json` version, and changelog.

## 0.5.5

* (fix) Update `removeVersionFromPreferences`. Fixes #73
* Add support for `cordova-plugin-wkwebview-engine` - PR #66

## 0.5.4

* Fix `shouldOverrideLoadWithRequest` on iOS.

## 0.5.3

* Update `plugin.xml`.  Whoops...

## 0.5.2

* Added a README.

## 0.5.1

* (fix) Added `shouldOverrideLoadWithRequest` function to address deploy persistence on `cordova-ios` versions `4.x`.  
  Fixes #60
* (fix) Fixed a compatible version check on iOS. Fixes #58

## 0.5.0

* **(breaking)** The plugin is incompatible with `ionic-platform-web-client` version 0.6.0 and lower.
* (fix) Android package is now correctly set as io.ionic
* (fix) Plugin now builds correctly cordova-ios 4.x - PR #50
* (fix) Errors propagate correctly when unzip fails - PR #44
* Updated plugin to communicate directly with the Ionic Platform API

## 0.4.1

* (fix) iOS now correctly updates the version label on deploy extraction

## 0.4.0

* Added `getMetadata` method to fetch deploy metadata
* Added `getVersions` and `removeVersion` methods. They will allow you to manage the deploys currently on the device.
* (fix) iOS deploys will now give a download error if the app goes into the background while downloading a deploy.
* (fix) Excluding deploys from iOS cloud backups
* (fix) iOS rollbacks now behave the same as android


## 0.3.0

* Changed plugin id from `com.ionic.deploy` to `ionic-plugin-deploy`

## 0.2.3

* Adding deploy info. Fixes #11
* Fix for ios deploys not sticking around after force quitting. Fixes #21


## 0.2.2

* Firing error callback in the event the deploy check is unable to receive a valid response. Fixes #14
* Removed StandardCharset dependency to support older Android platforms. Fixes #19
