import { Component, NgZone} from '@angular/core';
import { NavController,NavParams,ToastController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import {productsPage} from '../products/products';
import { FormBuilder, Validators } from '@angular/forms';

const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class settingsPage {

//outfits:Array <any>;
public passwordForm;
brands: Array<any>;
brandsID: Array<any>;
type: any;
newPassword: string;
brandsList: any;
category: any;
username: any;
userID: any;
currentUser: any;
usernameText: string;
mostPopList: Array<any>;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController,private ngZone: NgZone,public af: AngularFire,private _auth: AuthService,private navParams:NavParams,public toastCtrl: ToastController,public formBuilder: FormBuilder) {
        const authObserver = af.auth.subscribe( user => {
          
  if (user) {
this.currentUser = user;
this.userID = user.uid;
this.update();
}
  this.passwordForm = formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
        )};

 

  
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
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

changePassword(newPass)
{
  if (!this.passwordForm.valid){
  let toast = this.toastCtrl.create({
      message: 'Password must be 6 characters',
      duration: 2000,
      position:"middle"
    
    });
    toast.present();

} else
{
 var changed = this._auth.updatePassword(newPass);
  let toast = this.toastCtrl.create({
      message: 'Password changed successfully',
      duration: 2000,
      position:"middle"
    
    });
    toast.present();
}
}
update()
{
var ref = firebase.database().ref(this.userID+'/username');
ref.once('value', (snapshot) => {
  if (snapshot.val() === null) {

  }else{
   this.usernameText = snapshot.val();
console.log(snapshot.val());
  }
});
  
}

 

  setDisplayname(newName)
  {


var ref = firebase.database().ref();
var q = ref.orderByChild('username').equalTo(newName);
q.once('value', (snapshot) => {
  if (snapshot.val() === null) {
     let toast = this.toastCtrl.create({
      message: 'Username saved succsesfully',
      duration: 2000,
      position:"middle"
    
    });
    toast.present();
    // username does not yet exist, go ahead and add new user
     var db = firebase.database().ref(this.userID+'/username');

db.set(
  newName
);
  } else {
    this.update()
 let toast = this.toastCtrl.create({
      message: 'Username already taken',
      duration: 2000,
      position:"middle"
    
    });
    toast.present();  }
});
// Updates the user attributes:

  }
}


