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
  

 this.type = this.navParams.get("type");
 console.log(this.type);
this.ionViewLoaded();



}

});


<<<<<<< HEAD
=======
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
>>>>>>> HEAD@{1}


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

firebase.database().ref().child('Brands/').on('value', function(data) {
var element = data.val();
if(element){
console.log(element);
tempBrands.push(element);
console.log(element);
}
});
  


this.brands = tempBrands;
this.brandsID = tempBrandsID;
   }
 itemSelected(item){

 
this.navCtrl.push(productsPage,{"type":this.type,"brand":item});

 }
}