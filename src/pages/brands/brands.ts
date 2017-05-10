import { Component, NgZone} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire} from 'angularfire2';
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
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
    

 this.type = this.navParams.get("type");
 if(this.type == "Jewelry"){
  this.category = "Jewelry";
 }
 else if(this.type == "Hats")
 {
   this.category = "Hats";
 }
 else if(this.type == "Neckwear")
 {
   this.category = "Scarves & Wraps";
 }
  else if(this.type == "Outerwear")
 {
   this.category = "Outerwear";
 }
   else if(this.type == "Tops")
 {
   this.category = "Shirts";
 }
 else if(this.type == "Belts")
 {
   this.category = "Belts";
 }
  else if(this.type == "Bottoms")
 {
   this.category = "Pants";
 }
  else if(this.type == "Bags")
 {
   this.category = "Bags";
 }
 else if(this.type == "Shoes")
 {
   this.category = "Shoes";
 }
  }
 ngAfterViewInit() {

     var result1 = [];
     var result2 = [];
     shopstyle.brands({limit:100}).then(response => {
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


 }
 itemSelected(item){
   var id = this.brandsID[this.brands.indexOf(item)];
this.navCtrl.push(productsPage,{"type":this.category,"internaltype":this.type,"brand":item,"brandID":id});

 }
}