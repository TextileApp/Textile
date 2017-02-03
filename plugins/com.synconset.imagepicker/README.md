cordova-imagePicker
===================

Cordova Plugin For Multiple Image Selection - implemented for iOS and Android 4.0 and above.

## Installing the plugin

The plugin conforms to the Cordova plugin specification, it can be installed
using the Cordova / Phonegap command line interface.

    # without desc
    phonegap plugin add https://github.com/Telerik-Verified-Plugins/ImagePicker.git
    cordova plugin add https://github.com/Telerik-Verified-Plugins/ImagePicker.git
    
    # with desc
    phonegap plugin add https://github.com/Telerik-Verified-Plugins/ImagePicker.git --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="your usage message"

    cordova plugin add https://github.com/Telerik-Verified-Plugins/ImagePicker.git --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="your usage message"


## Using the plugin

The plugin creates the object `window.imagePicker` with the method `getPictures(success, fail, options)`

Example - Get Full Size Images (all default options):
```javascript
window.imagePicker.getPictures(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
        }
    }, function (error) {
        console.log('Error: ' + error);
    }
);
```

Example - Get at most 10 images scaled to width of 800:
```javascript
window.imagePicker.getPictures(
    function(results) {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
        }
    }, function (error) {
        console.log('Error: ' + error);
    }, {
        maximumImagesCount: 10,
        width: 800
    }
);
```

### Options

    options = {
        // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: int,
        
        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        width: int,
        height: int,
        
        // quality of resized image, defaults to 100
        quality: int (0-100),

        // output type, defaults to FILE_URIs.
        // available options are 
        // window.imagePicker.OutputType.FILE_URI (0) or 
        // window.imagePicker.OutputType.BASE64_STRING (1)
        outputType: int
    };
    
### Note for Android Use

When outputType is FILE_URI the plugin returns images that are stored in a temporary directory.  These images will often not be deleted automatically though.  The files should be moved or deleted after you get their filepaths in javascript. If Base64 Strings are being returned, there is nothing to clean up.

## Android 6 (M) Permissions
On Android 6 you need to request permission to read external storage at runtime when targeting API level 23+.
Even if the `uses-permission` tags for the Calendar are present in `AndroidManifest.xml`.

Note that the `hasReadPermission` function will return true when:

- You're running this on iOS, or
- You're targeting an API level lower than 23, or
- You're using Android < 6, or
- You've already granted permission.

```js
  function hasReadPermission() {
    window.imagePicker.hasReadPermission(
      function(result) {
        // if this is 'false' you probably want to call 'requestReadPermission' now
        alert(result);
      }
    )
  }

  function requestReadPermission() {
    // no callbacks required as this opens a popup which returns async
    window.imagePicker.requestReadPermission();
  }
```

Note that backward compatibility was added by checking for read permission automatically when `getPictures` is called.
If permission is needed the plugin will now show the permission request popup.
The user will then need to allow access and invoke the same method again after doing so.


## Libraries used

#### ELCImagePicker

For iOS this plugin uses the ELCImagePickerController, with slight modifications for the iOS image picker.  ELCImagePicker uses the MIT License which can be found in the file LICENSE.

https://github.com/B-Sides/ELCImagePickerController

#### MultiImageChooser

For Android this plugin uses MultiImageChooser, with modifications.  MultiImageChooser uses the BSD 2-Clause License which can be found in the file BSD_LICENSE.  Some code inside MultImageChooser is licensed under the Apache license which can be found in the file APACHE_LICENSE.

https://github.com/derosa/MultiImageChooser

#### FakeR

Code(FakeR) was also taken from the phonegap BarCodeScanner plugin.  This code uses the MIT license.

https://github.com/wildabeast/BarcodeScanner

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
