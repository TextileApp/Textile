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
  selector: 'page-searchproducts',
  templateUrl: 'searchproducts.html',
  
  
})


export class searchproductsPage {
  
  @ViewChild(Content) content: Content;
    currentOffset:any;
    pet: string = "Hats";
  assetCollection: any;
isEnabled: boolean;
noProducts: boolean;
isDeleteEnabled: boolean;
    selectedItem: any;
    searchText:any;
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
  genderPref:any;
  type:any;

  whichType:any;
  internalType:string;
  currentImage
  grid: Array<Array<string>>;
af: AngularFire;
category:any;


  constructor(public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private params: NavParams,public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,public events: Events,private ngZone: NgZone,public popoverCtrl: PopoverController,af: AngularFire,private _auth: AuthService,private shareService: ShareService
 ) {
  this.isEnabled = false;
    const authObserver = af.auth.subscribe( user => {
        if (user) {
 this.genderPref = this.params.get("gender");
this.type = this.params.get("type");
if(this.genderPref == "male"){
 if(this.type == "Jewelry"){

  this.category = "mens-watches-and-jewelry";
 }
 else if(this.type == "Hats")
 {

   this.category = "hats";
 }
 else if(this.type == "Neckwear")
 {

   this.category = "mens-scarves";
 }
  else if(this.type == "Outerwear")
 {
   this.category = "mens-outerwear";
 }
   else if(this.type == "Tops")
 {
   this.category = "mens-shirts";
 }
 else if(this.type == "Belts")
 {
  
   this.category = "mens-belts";
 }
  else if(this.type == "Bottoms")
 {
  
   this.category = "mens-pants";
 }
  else if(this.type == "Bags")
 {
  
   this.category = "mens-bags";
 }
 else if(this.type == "Shoes")
 {
   this.category = "mens-shoes";
 }
}
else{
 if(this.type == "Jewelry"){

  this.category = "womens-watches-and-jewelry";
 }
 else if(this.type == "Hats")
 {
   this.category = "hats";
 }
 else if(this.type == "Neckwear")
 {
   this.category = "womens-scarves";
 }
  else if(this.type == "Outerwear")
 {
   this.category = "womens-outerwear";
 }
   else if(this.type == "Tops")
 {
  
   this.category = "womens-shirts";
 }
 else if(this.type == "Belts")
 {
   
   this.category = "womens-belts";
 }
  else if(this.type == "Bottoms")
 {
   
   this.category = "womens-pants";
 }
  else if(this.type == "Bags")
 {
  
   this.category = "womens-bags";
 }
 else if(this.type == "Shoes")
 {
   this.category = "womens-shoes";
 }




}


 
        } 

  
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
  cat:this.category
  ,
  fts:this.searchText,
  offset:this.currentOffset
  ,
  limit: 50,

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
this.items1[i].name = this.items1[i].name.replace('#','');
this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+this.internalType+'/'+this.items1[i].name);


}else{
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+this.internalType+'/'+this.items1[i].name);
}
if(this.items1[i].selected == true)
{


this.db.set(
{"url":this.items1[i].image,"id":this.items1[i].id,"clickUrl":this.items1[i].clickUrl,"brand":this.items1[i].brand}
  
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



      
  }
  
ngAfterViewInit() {

  
    
}




       

    
initializeItems(){
  this.items1 = [];
}
      

 getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.searchText = val;
       const options = {
  cat:this.category,
  fts:val,
  limit: 50,
  sort: 'Popularity',
};

       var result1 = [];
 
shopstyle.products(options).then(response => {

 var x;

   this.noProducts = true;
     for (x in response.products) {
      result1.push({'image': response.products[x].image.sizes.Large.url,'name':response.products[x].unbrandedName});
    
    }

  this.items1 = result1;

 



});


    
     
    }
  }

}