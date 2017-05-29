import { Component, Inject, NgZone,ViewChild} from '@angular/core';
import { Camera } from 'ionic-native';
import { PhotoViewer } from 'ionic-native';
import { NavController,PopoverController,ActionSheetController,ModalController,NavParams,Content } from 'ionic-angular';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';
import * as firebase from 'firebase';
import { PopoverContentPage } from './popover';
import { AuthService } from '../../providers/auth-service';
import {ShareService} from '../../providers/ShareService';
import { Events } from 'ionic-angular';
import { ImageCropperComponent } from "../cropper/img-cropper";
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  
  
})


export class productsPage {
  
  @ViewChild(Content) content: Content;
    currentOffset:any;
    pet: string = "Hats";
  assetCollection: any;
isEnabled: boolean;
noProducts: boolean;
isDeleteEnabled: boolean;
    selectedItem: any;
  icons: string[];
 items1: Array<any>;
 selectedItems:Array<any>;
	options: any;
  db: any;
  uploadType: number = 0;
  public currentUser: any;
  public photoRef:any;
  storageRef: any;
  brand: any;
  brandID: any;
  whichType:any;
  internalType:string;
  currentImage
  grid: Array<Array<string>>;
af: AngularFire;



  constructor(public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private params: NavParams,public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,public events: Events,private ngZone: NgZone,public popoverCtrl: PopoverController,af: AngularFire,private _auth: AuthService,private shareService: ShareService
 ) {
  this.isEnabled = false;
    const authObserver = af.auth.subscribe( user => {
        if (user) {
    this.noProducts = false;
    this.whichType = this.params.get("type");
    console.log(this.whichType);
    this.brand = this.params.get("brand");
    console.log(this.brand);
    this.currentOffset = 550;


 
        } 

    this.brandID = this.params.get("brandID");
    console.log(this.brandID);
    this.internalType = this.params.get("internaltype");
  //this.items2 = af.database.list(this.currentUser+'/Tops');
 // this.items3 = af.database.list(this.currentUser+'/Bottoms/');
 // this.items4 = af.database.list(this.currentUser+'/Shoes/');
this.ionViewLoaded();

  

});

     //this.grid = Array(Math.ceil(this.items.length/2));

     console.log("FUCK EM ALL");

      

    }
      doInfinite(infiniteScroll) {

       const options = {
  cat:this.whichType
  ,
  offset:this.currentOffset
  ,
  limit: 50,
  fl: this.brandID,
  sort: 'Popularity',
};
       
shopstyle.products(options).then(response => {

 var x;
 if(response.products.length > 0){
   this.noProducts = true;
     for (x in response.products) {
      this.items1.push({'image': response.products[x].image.sizes.Large.url,'name':response.products[x].unbrandedName});
      
    

    }

  

  } 

});
this.currentOffset = this.currentOffset + 50;
  }
saveToCloset()
{

  var item;
  for(var i = 0; i< this.items1.length; i++)
  {
    if ((this.items1[i].name).indexOf('.') > -1)
{
this.items1[i].name = this.items1[i].name.replace('.','-');
this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+this.internalType+'/'+this.items1[i].name);

}else{
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+this.internalType+'/'+this.items1[i].name);
}
    console.log("NOICE MATE");
if(this.items1[i].selected == true)
{
//this.selectedItems.push(item);
    console.log("killa MATE");

this.db.set(
  this.items1[i].image
);
};
}
this.navCtrl.popToRoot();
  }
  selectPiece(item){
  if(item.selected != null)
  {
if(item.selected == true)
{
item.selected = false;
}
else if(item.selected == false)
{
item.selected = true;
}

  }
  else
  {
   item.selected = true;
  }

}





  ionViewLoaded() {


  const options = {
  cat:this.whichType,
 
  limit: 50,
  fl: this.brandID,
  sort: 'Popularity',
};

       var result1 = [];
       var result2 = [];
shopstyle.products(options).then(response => {

 var x;

   this.noProducts = true;
     for (x in response.products) {
      result1.push({'image': response.products[x].image.sizes.Large.url,'name':response.products[x].unbrandedName});
    
    }

  this.items1 = result1;
  this.getAnotherFifty(1);
 



});


      
  }
  
ngAfterViewInit() {

  
    
}


getAnotherFifty(timesRan)
{
var offset = timesRan*50;
if(timesRan < 10){
 const options = {
  cat:this.whichType
  ,
  offset:offset 
  ,
  limit: 50,
  fl: this.brandID,
  sort: 'Popularity',
};
       
shopstyle.products(options).then(response => {

 var x;
 if(response.products.length > 0){
    this.noProducts = false;
     for (x in response.products) {
      this.items1.push({'image': response.products[x].image.sizes.Large.url,'name':response.products[x].unbrandedName});
  
    

    }

  

  } 

});

      
timesRan++;
this.getAnotherFifty(timesRan);
}
}

      



}