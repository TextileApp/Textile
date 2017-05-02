import { Component, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'brands',
  templateUrl: 'brands.html'
})
export class brandsPage {

//outfits:Array <any>;
myUser: any;
af: AngularFire;
isEnabled: boolean;
brands: Array<any>;
raw: Array<any>;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
    this.myUser = user.uid;
  } 
  this.isEnabled = false;

});
  }
 ngAfterViewInit() {
   const options = {

  
  limit:100

};
     var result1 = [];
     shopstyle.brands({limit:50}).then(response => {
       var x;
     for (x in response.brands) {
      result1.push(response.brands[x].name);
    }
  });
  this.brands = result1;
  console.log(this.brands);
    console.log(result1);

 }
}
