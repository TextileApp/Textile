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
category: any;
mostPopList: Array<any>;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
        const authObserver = af.auth.subscribe( user => {
  if (user) {
  

this.ionViewLoaded();



}

});

 this.type = this.navParams.get("type");
 if(this.type == "Jewelry"){

  this.category = "clothes";
 }
 else if(this.type == "Hats")
 {
   this.category = "hats";
 }
 else if(this.type == "Neckwear")
 {
   this.category = "scarves";
 }
  else if(this.type == "Outerwear")
 {
   this.category = "outerwear";
 }
   else if(this.type == "Tops")
 {
   this.category = "shirts";
 }
 else if(this.type == "Belts")
 {
   this.category = "belts";
 }
  else if(this.type == "Bottoms")
 {
   this.category = "pants";
 }
  else if(this.type == "Bags")
 {
   this.category = "bags";
 }
 else if(this.type == "Shoes")
 {
   this.category = "shoes";
 }


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
for(var i = 0; i<= 233; i++){
firebase.database().ref().child('Brands/'+i+'/name').on('value', function(data) {
var element = data.val();
if(element){
tempBrands.push(element);
console.log(element);
}
});
  }
  for(var i = 0; i<= 233; i++){
firebase.database().ref('Brands/'+i+'/id').on('value', function(data) {
var element = data.val();
if(element){
console.log(element);
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