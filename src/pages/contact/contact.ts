import { Component, Inject, NgZone,NgModule,OnInit} from '@angular/core';
import { Camera } from 'ionic-native';
import { PhotoViewer } from 'ionic-native';
import { NavController,PopoverController,ActionSheetController,ModalController,NavParams } from 'ionic-angular';
import { ImagePicker, File} from 'ionic-native';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';
import { PopoverContentPage } from './popover';
import { AuthService } from '../../providers/auth-service';
import {ShareService} from '../../providers/ShareService';
import { Events } from 'ionic-angular';
import Cropper from 'cropperjs';
import { ImageCropperComponent } from "../cropper/img-cropper";

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
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  
  
})


export class ContactPage {
    public imgUri: string;

    pet: string = "Hats";
  assetCollection: any;
isEnabled: boolean;
    selectedItem: any;
  icons: string[];
 items1: FirebaseListObservable<any>;
	options: any;
  db: any;
  uploadType: number = 0;
  public currentUser: any;
  public photoRef:any;
  storageRef: any;
  whichType:string;
  currentImage
  grid: Array<Array<string>>;
af: AngularFire;



  constructor(public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private params: NavParams,public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,public events: Events,private ngZone: NgZone,public popoverCtrl: PopoverController,af: AngularFire,private _auth: AuthService,private shareService: ShareService
 ) {
  this.isEnabled = false;
    const authObserver = af.auth.subscribe( user => {
  if (user) {
    this.whichType = this.params.get("type");
     this.storageRef = firebaseApp.storage().ref();
    this.currentUser = user.uid;
  this.items1 = af.database.list(this.currentUser+'/'+this.whichType);
  console.log(this.currentUser+'/'+this.whichType);
  //this.items2 = af.database.list(this.currentUser+'/Tops');
 // this.items3 = af.database.list(this.currentUser+'/Bottoms/');
 // this.items4 = af.database.list(this.currentUser+'/Shoes/');

  } 
  
});

     //this.grid = Array(Math.ceil(this.items.length/2));

     console.log("FUCK EM ALL");

      

    }
          public presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0); //Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1);//Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public presentCropModal(img: string,clothes: string) {
    var aspect = 1;
    if(this.pet == "Dresses"){
 aspect = 2/3; 
}
  else{
    aspect = 1;
  }       
    let cropModal = this.modalCtrl.create(ImageCropperComponent, {'imgUri': img,'aspectRatio':aspect});

    cropModal.onDidDismiss(data => {
       if(data){
       if(this.pet == "Hats"){
        console.log("ITS HATS");
        clothes = 'Hats';
       }
       if(this.pet == "'Hats'")
       {
    console.log("ITS HATSSjjsjjj");
       }
       console.log(clothes);
       console.log(this.pet);
       console.log("hentai");
      this.imgUri = data;
      console.log(this.imgUri);
            var uuid = generateUUID();
            var imgBlob: any = dataURLtoBlob(this.imgUri);
            imgBlob.name = uuid+'.jpg';
      var uploadTask = this.storageRef.child(this.currentUser+'/'+clothes+'/'+imgBlob.name).put(imgBlob);
    console.log(this.currentUser+'/'+this.pet+'/'+imgBlob.name);
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
  console.log(downloadURL);
 
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+clothes);
var newPostRef = this.db.push();
newPostRef.set(
  downloadURL
);
});
         

   
       }
    });
 cropModal.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      sourceType: sourceType,
      // targetWidth: 320,
      // targetHeight: 320,
      destinationType: 0, //Camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    Camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
      // this.imgData = imageData;
      this.imgUri = imageData;
      this.presentCropModal(this.imgUri,this.pet);
    }, (err) => {
      console.log(err);
    });
  }
    show(pic){
PhotoViewer.show(pic);

    }

  


  ionViewLoaded() {
    
  
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

  

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverContentPage,{pet:this.whichType,user:this.currentUser,items1:this.items1,storageRef:this.storageRef});
    popover.present({
      ev: myEvent
    });
  popover.onDidDismiss(() => {
if(this.shareService.getIsUploading()){
this.addPics();
this.shareService.setIsUploading(false);
}
    // Navigate to new page.  Popover should be gone at this point completely
this.isEnabled = this.shareService.getCanDelete();
});
  
  }


 addPics()
{
var clothes = this.whichType;
  
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
  console.log(downloadURL);
 
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+clothes);
var newPostRef = this.db.push();


newPostRef.set(downloadURL);
newPostRef.child.update(imgBlob.name);

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

isDeleteEnabled()
{
return this.shareService.getCanDelete();
}
deleteItem(outfitkey: string,outfitval: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();

this.storageRef.child(this.currentUser+'/'+this.whichType+'/'+outfitval).delete().then(function() {
}).catch(function(error) {
console.log(error);
});
this.shareService.setCanDelete(false);
this.isEnabled = false;
}





}