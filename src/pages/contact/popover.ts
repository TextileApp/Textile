import { Component,NgZone } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import { ImagePicker, File} from 'ionic-native';
import {ShareService} from '../../providers/ShareService';
import { Events } from 'ionic-angular';
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
  templateUrl: 'popover.html'
})

export class PopoverContentPage {
    storageRef: any;
  currentImage
   user: string;
    pet: string;
    
constructor(public viewCtrl: ViewController,private ngZone: NgZone,private navParams: NavParams,private shareService: ShareService) {}
  ngOnInit() {
    if (this.navParams.data) {
      this.user = this.navParams.data.user;
      this.pet = this.navParams.data.pet;
    }
  }

  canDelete(){
    this.shareService.setCanDelete(true);
    this.close();    

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
addPics(){
  this.shareService.setIsUploading(true);
    this.close();  
}

         
        
   
close() {
    this.viewCtrl.dismiss();
  }
}

