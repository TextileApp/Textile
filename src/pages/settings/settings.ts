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
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class settingsPage {

//outfits:Array <any>;

brands: Array<any>;
brandsID: Array<any>;
type: any;
brandsList: any;
category: any;
username: any;
mostPopList: Array<any>;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
        const authObserver = af.auth.subscribe( user => {
  if (user) {
var username;
var tempUsername;
var ref = firebase.database().ref('https://streetwear-3906e.firebaseio.com'+user.uid+'/username');
ref.once('value', function(snapshot) {
  if (snapshot.val() === null) {
    tempUsername = _auth.userEmail();
    this.myUser = user.uid;
    username = this.tempUsername.substr(0, this.tempUsername.indexOf('@'));
     var db = firebase.database().ref('https://streetwear-3906e.firebaseio.com'+user.uid+'/username');

db.set(
 username
);
  } else {
    // username already exists, ask user for a different name
  }
});
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


 

  setDisplayname(newName)
  {


var ref = firebase.database().ref('https://streetwear-3906e.firebaseio.com');
var q = ref.orderByChild('username').equalTo(newName);
q.once('value', function(snapshot) {
  if (snapshot.val() === null) {
    // username does not yet exist, go ahead and add new user
     var db = firebase.database().ref(firebase.auth().currentUser.uid);

db.set(
  newName
);
  } else {
    // username already exists, ask user for a different name
  }
});
// Updates the user attributes:

  }
}


