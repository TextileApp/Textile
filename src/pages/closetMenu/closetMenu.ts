import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone, NgModule} from '@angular/core';
import * as firebase from 'firebase';
import { NavController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'closetMenu',
  templateUrl: 'closetMenu.html'
})
export class closetMenuPage{

//outfits:Array <any>;
myUser: any;
af: AngularFire;
isEnabled: boolean;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
    this.myUser = user.uid;
  } 
  this.isEnabled = false;
  
});
  }
 
goToType(theType:string) {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
  
    this.navCtrl.push(ContactPage, {
      "type":theType
    });
  }
}
