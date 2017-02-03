import { Component, Inject, NgZone,NgModule,OnInit } from '@angular/core';
import { Camera } from 'ionic-native';
import { PhotoViewer } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { ImagePicker, File} from 'ionic-native';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';

import * as firebase from 'firebase';
declare var window: any

function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  
  
})


export class ContactPage {
    pet: string = "Hats";
  assetCollection: any;

    selectedItem: any;
  icons: string[];
 items1: Array<string>;
 items2: Array<string>;
 items3: Array<string>;
 items4: Array<string>;
	options: any;
  db: any;
  uploadType: number = 0;
  public currentUser: any;
  public photoRef:any;
  storageRef: any;
  currentImage
  grid: Array<Array<string>>;



  constructor(public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,private ngZone: NgZone
 ) {
   this.storageRef = firebaseApp.storage().ref();
    this.currentUser = firebase.auth().currentUser.uid;


     //this.grid = Array(Math.ceil(this.items.length/2));

     console.log("FUCK EM ALL");

           this.loadData();

    }
    show(pic){
PhotoViewer.show(pic);
    }

  ionViewLoaded() {
    
    this.loadData();
    let rowNum = 0;
    
    
      
  }
  doImageResize(img, callback, MAX_WIDTH: number = 900, MAX_HEIGHT: number = 900) {
    var canvas = document.createElement("canvas");

    var image = new Image();

    image.onload = function () {
      console.log("Size Before: " + image.src.length + " bytes");

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      console.log("Size After:  " + dataUrl.length + " bytes");
      callback(dataUrl)
    }

    image.src = img;
  }
  loadData() {
    // load data from firebase...
  console.log(this.currentUser+'/Hats/');
         var result1 = [];

firebase.database().ref(this.currentUser+'/Hats/').on('child_added', function(data) {
var element = data.val();
result1.push(element);
});
  this.items1 = result1;
  //this.grid = Array(Math.ceil(this.items.length/2));
  
    var result2 = [];

firebase.database().ref(this.currentUser+'/Tops/').on('child_added', function(data) {
var element = data.val();

result2.push(element);
});
  this.items2 = result2;
  //this.grid = Array(Math.ceil(this.items.length/2));

    var result3 = [];

firebase.database().ref(this.currentUser+'/Bottoms/').on('child_added', function(data) {
var element = data.val();

result3.push(element);
});
  this.items3 = result3;
  //this.grid = Array(Math.ceil(this.items1.length/2));

      var result4 = [];

firebase.database().ref(this.currentUser+'/Shoes/').on('child_added', function(data) {
var element = data.val();

result4.push(element);
});
  this.items4 = result4;
  // this.grid = Array(Math.ceil(this.items1.length/2));
  }
  




 addPics(clothes: string)
{

  
  console.log(clothes);
var options =  {
          // if no title is passed, the plugin should use a sane default (preferrably the same as it was, so check the old one.. there are screenshots in the marketplace doc)
          maximumImagesCount: 10,
          title: 'Select photos',
        // optional default no helper message above the picker UI
          // be careful with these options as they require additional processing
         
          //             outputType: imagePicker.OutputType.BASE64_STRING
        }
     
ImagePicker.getPictures(options).then((results) => {
  
  for (var i = 0; i < results.length; i++) {
    
      console.log('Image URI: ' + results[i]);
        window.resolveLocalFileSystemURL('file:///'+results[i], (fileEntry) => {
            var uuid = generateUUID();
            this.doImageResize(results[i], (_data) => {
        this.ngZone.run(() => {
          this.currentImage = _data
        })
      }, 640)
                    fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = uuid+'.jpg';
      var uploadTask = this.storageRef.child(this.currentUser+'/'+clothes+'/'+imgBlob.name).put(imgBlob);
        console.log(imgBlob.name+'fuck the popopopop');
       console.log("FUCK MY GERORIIIM");

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
       console.log('NIGGA WE unauthorized IT');
      break;

    case 'storage/canceled':
      // User canceled the upload
             console.log('NIGGA WE CANCELLED IT');

      break;

 
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
                   console.log(error.serverResponse);

      break;
  }
}, function() {
       console.log('NIGGA WE MADE IT');
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+clothes);
var newPostRef = this.db.push();
newPostRef.set(
  downloadURL
);
});
         
        
};
          reader.onerror = (e) => {
            console.log("Failed file read: " + e.toString());
          };
          reader.readAsArrayBuffer(resFile);

        });
      }, (err) => {
        console.log(err);
        alert(JSON.stringify(err))
      });
  
    }
}, (err) => {
      console.log("resolveLocalFileSystemURL", err);
      alert(JSON.stringify(err))
    });
}



  


}