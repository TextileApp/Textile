import { Component, NgZone} from '@angular/core';
import { NavController,NavParams,AlertController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import {profilePage} from '../profile/profile';
import {productsPage} from '../products/products';
import { FormBuilder, Validators } from '@angular/forms';

const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'following',
  templateUrl: 'following.html'
})
export class followingPage {

//outfits:Array <any>;
following: FirebaseListObservable<any>;;
brands: Array<any>;
brandsID: Array<any>;
changedPass:boolean;
type: any;
newPassword: string;
brandsList: any;
category: any;
username: any;
myUser: any;
currentUser: any;
usernameText: string;
mostPopList: Array<any>;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController,private ngZone: NgZone,public af: AngularFire,private _auth: AuthService,private navParams:NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder) {
        const authObserver = af.auth.subscribe( user => {
          
  if (user) {
 this.myUser = user.uid;
this.following = af.database.list(this.myUser+'/following/');

}

  }
        )};

printKey(key){
  
    this.navCtrl.push(profilePage, { "user": key });
  
}
  
 ngAfterViewInit() {





 }



 


}


