import { Component, NgZone} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import {productsPage} from '../products/products';
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'brands',
  templateUrl: 'brands.html'
})
export class brandsPage {

//outfits:Array <any>;

brands: Array<any>;
brandsID: Array<any>;
type: any;
brandsList: any;
category: any;
mostPopList: Array<any>;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
        const authObserver = af.auth.subscribe( user => {
  if (user) {
this.type = this.navParams.get("type");
 if(this.type == "Jewelry"){
this.brandsList = "JewelryBrands";
  this.category = "mens-watches-and-jewelry";
 }
 else if(this.type == "Hats")
 {
   this.brandsList = "Brands";
   this.category = "hats";
 }
 else if(this.type == "Neckwear")
 {
   this.brandsList = "Brands";
   this.category = "mens-scarves";
 }
  else if(this.type == "Outerwear")
 {
   this.brandsList = "Brands";
   this.category = "mens-outerwear";
 }
   else if(this.type == "Tops")
 {
   this.brandsList = "Brands";
   this.category = "mens-shirts";
 }
 else if(this.type == "Belts")
 {
   this.brandsList = "Brands";
   this.category = "mens-belts";
 }
  else if(this.type == "Bottoms")
 {
   this.brandsList = "Brands";
   this.category = "mens-pants";
 }
  else if(this.type == "Bags")
 {
   this.brandsList = "Brands";
   this.category = "mens-bags";
 }
 else if(this.type == "Shoes")
 {
   this.brandsList = "Brands";
   this.category = "mens-shoes";
 }


this.ionViewLoaded();



}

});

 

  }
 ngAfterViewInit() {
/** 
     var result1 = [];
     var result2 = [];
     shopstyle.products({limit:100}).then(response => {
       var x;
     for (x in response.brands) {
      result1.push(response.brands[x].name);
      result2.push("b"+response.brands[x].id);
    }
  });
  this.brands = result1;
  this.brandsID = result2;
  console.log(this.brands);
    console.log(result1);
    
    shopstyle.categories(null)
  .then(result => console.log(result.categories[0]));
*/




 }
   ionViewLoaded() {
 var tempBrands = [];
var tempBrandsID = [];
var length = 233;
if(this.brandsList == "JewelryBrands")
{
length = 98;
}
if(this.brandsList == "Brands")
{
length = 233;
}
for(var i = 0; i<= length; i++){
firebase.database().ref().child(this.brandsList+'/'+i+'/name').on('value', function(data) {
var element = data.val();
if(element){
tempBrands.push(element);

}
});
  }
  for(var i = 0; i<= length; i++){
firebase.database().ref(this.brandsList+'/'+i+'/id').on('value', function(data) {
var element = data.val();
if(element){
tempBrandsID.push(element);
}
});
  }

this.brands = tempBrands;
this.brandsID = tempBrandsID;
   }
 itemSelected(item){
   var id = "b"+this.brandsID[this.brands.indexOf(item)];
 
this.navCtrl.push(productsPage,{"type":this.category,"internaltype":this.type,"brand":item,"brandID":id});

 }


}