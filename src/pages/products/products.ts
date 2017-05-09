import { Component, Inject, NgZone} from '@angular/core';
import { Camera } from 'ionic-native';
import { PhotoViewer } from 'ionic-native';
import { NavController,PopoverController,ActionSheetController,ModalController,NavParams } from 'ionic-angular';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';
import { PopoverContentPage } from './popover';
import { AuthService } from '../../providers/auth-service';
import {ShareService} from '../../providers/ShareService';
import { Events } from 'ionic-angular';
import { ImageCropperComponent } from "../cropper/img-cropper";
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');

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
  selector: 'page-products',
  templateUrl: 'products.html',
  
  
})


export class productsPage {
    public imgUri: string;

    pet: string = "Hats";
  assetCollection: any;
isEnabled: boolean;
isDeleteEnabled: boolean;
    selectedItem: any;
  icons: string[];
 items1: Array<any>;
	options: any;
  db: any;
  uploadType: number = 0;
  public currentUser: any;
  public photoRef:any;
  storageRef: any;
  brand: any;
  brandID: any;
  whichType:string;
  currentImage
  grid: Array<Array<string>>;
af: AngularFire;



  constructor(public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private params: NavParams,public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,public events: Events,private ngZone: NgZone,public popoverCtrl: PopoverController,af: AngularFire,private _auth: AuthService,private shareService: ShareService
 ) {
  this.isEnabled = false;
    const authObserver = af.auth.subscribe( user => {

    this.whichType = this.params.get("type");
    console.log(this.whichType);
    this.brand = this.params.get("brand");
    console.log(this.brand);
    this.brandID = this.params.get("brandID");
    console.log(this.brandID);
  //this.items2 = af.database.list(this.currentUser+'/Tops');
 // this.items3 = af.database.list(this.currentUser+'/Bottoms/');
 // this.items4 = af.database.list(this.currentUser+'/Shoes/');
this.ionViewLoaded();
  
  
});

     //this.grid = Array(Math.ceil(this.items.length/2));

     console.log("FUCK EM ALL");

      

    }


  ionViewLoaded() {
    
  const options = {
  cat:this.whichType
  ,
  offset: 50,
  limit: 50,
  fl: this.brandID,
  sort: 'Popularity',
};
       var result1 = [];
shopstyle.products(options).then(response => {

 var x;
     for (x in response.products) {
      result1.push(response.products[x].image.sizes.Best.url);
      console.log(response.products[x].image.sizes.Best.url);
      console.log(response.products[x].image.sizes);

    }
  this.items1 = result1;



});
    
      

      
  }
  



 






}