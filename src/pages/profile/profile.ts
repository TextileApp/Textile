import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import {settingsPage} from '../settings/settings';
import * as firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { Slides,NavParams } from 'ionic-angular';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class profilePage{
outfits: FirebaseListObservable<any>;
 mySlideOptions: any;
//outfits:Array <any>;
@ViewChild(Slides) slides: Slides;

myUser: any;
af: AngularFire;
isEnabled: boolean;
userName: any;
totalLikes: any;
currentUser:any;
isFollowing: any;
myUsername: any;
tempUsername: string;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private params: NavParams) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
     this.myUser = this.params.get("user");
     this.myUsername = this.params.get("name");
     this.currentUser = user.uid;
  this.outfits = af.database.list(this.myUser+'/outfits/');
 this.getLikes();
  this.update();
  this.getFollowing();
  } 
  this.isEnabled = false;

});
  }
  
   ngAfterViewInit() {
   }
ionViewWillEnter()
{
  this.update();
  this.getLikes();
}
update()
{
var usernameRef = firebase.database().ref('/username/'+this.myUsername);
var ref = firebase.database().ref(this.myUser+'/username');
ref.once('value', (snapshot) => {

if (snapshot.val() === null) {
   
var username;
var tempUsername;
    username = tempUsername.substr(0, tempUsername.indexOf('@'));
     var db = firebase.database().ref(this.myUser+'/username');

db.set(username);
usernameRef.set(username);
  }
  else {
   this.userName = snapshot.val();
console.log(snapshot.val());
  }
});
  
}
getLikes(){
  var ref = firebase.database().ref(this.myUser+'/totalLikes');
ref.once('value', (snapshot) => {
this.totalLikes = snapshot.val();
}

)}
followUser(){
    var ref = firebase.database().ref(this.currentUser+'/following/'+this.myUser);
    var nameref = firebase.database().ref(this.currentUser+'/username');
    var otheref = firebase.database().ref(this.myUser+'/followers/'+this.currentUser);
nameref.once('value', (snapshot) => {
  var name = snapshot.val();
 otheref.set(name);
})
ref.once('value', (snapshot) => {
 if (snapshot.val() === null) {
this.isFollowing = true;
ref.set(
this.myUser
);
}
else
{
  ref.remove();
  this.isFollowing = false;
}
})
  
 
}

getFollowing(){
  var ref = firebase.database().ref(this.currentUser+'/following/'+this.myUser);
ref.once('value', (snapshot) => {
 if (snapshot.val() === null) {
this.isFollowing = false;
}else
{
  this.isFollowing = true;
}
}
)}



changedTitle(outfitkey: string,newtitle: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
this.outfits.update(outfitkey,{title:newtitle});
}


//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();


}
