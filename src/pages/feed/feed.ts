import { Component, NgZone} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import {productsPage} from '../products/products';
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'feed',
  templateUrl: 'feed.html'
})
export class feedPage {


posts: Array<any>;
myUser: any;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
        const authObserver = af.auth.subscribe( user => {
  if (user) {

 this.myUser = user.uid;
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
var result2 = [];
firebase.database().ref("/outfits").orderByChild("timestamp").on('child_added', function(data) {
var element = data.val();
if(element){

result2.push(element);

console.log(result2);
}
});
 this.posts = result2;

  firebase.database().ref("/outfits").orderByChild("timestamp").on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result2.indexOf(element);
if (index > -1) {
    result2.splice(index, 1);
}
}
});



}
}