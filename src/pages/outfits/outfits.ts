import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import {settingsPage} from '../settings/settings';
import {followingPage} from '../following/following';
import * as firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { Slides } from 'ionic-angular';
import {profileFollowPage} from '../profilefollow/profilefollow';

@Component({
  selector: 'page-outfits',
  templateUrl: 'outfits.html'
})
export class OutfitsPage{
outfits: FirebaseListObservable<any>;
 mySlideOptions: any;
//outfits:Array <any>;
@ViewChild(Slides) slides: Slides;

myUser: any;
af: AngularFire;
isEnabled: boolean;
userName: any;
totalLikes: any;
followers: Array<any>;
following: Array<any>;
followerCount: any;
followingCount: any;
tempUsername: string;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
 this.myUser = user.uid;
  this.outfits = af.database.list(this.myUser+'/outfits/');
 
  this.update();
  } 
  this.isEnabled = false;

});
  }
  
    ngAfterViewInit() {
     var tempfollowing = [];
 var tempfollowers = [];
var numberfollowers = 0;
var numberfollowing = 0;
 firebase.database().ref('following/'+this.myUser).on('child_added', function(data) {
var element = data.val();
var name = data.key;
tempfollowing.push({"name":element,"id":name});


});
this.following = tempfollowing;

 firebase.database().ref('followers/'+this.myUser).on('child_added', function(data) {
var element = data.val();
var name = data.key;
tempfollowers.push({"name":element,"id":name});

});

this.followers = tempfollowers;



var followingCountRef = firebase.database().ref('/following/'+this.myUser);
 firebase.database().ref('following/'+this.myUser).on("value", (snapshot) => {
  this.followingCount = snapshot.numChildren();
})
var followerCountRef = firebase.database().ref('/followers/'+this.myUser);
 firebase.database().ref('/followers/'+this.myUser).on("value",(snapshot) => {
  this.followerCount = snapshot.numChildren();
})

   }
ionViewWillEnter()
{
  this.update();
  this.getLikes();
}
followingPage(){
 this.navCtrl.push(followingPage); 
}
update()
{
var ref = firebase.database().ref(this.myUser+'/username');
ref.once('value', (snapshot) => {

 if (snapshot.val() === null) {
   
          var username;
var tempUsername;
tempUsername = this._auth.userEmail();
    username = tempUsername.substr(0, tempUsername.indexOf('@'));
     var db = firebase.database().ref(this.myUser+'/username');

db.set(
 username
);
  
  }else{
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
 pressEvent($event) {
if(this.isEnabled){
 this.disableDelete();
}
else{
   this.realEnableDelete();
}
   }
isDeleteEnabled()
{
return this.isEnabled;
}

realEnableDelete(){
 this.isEnabled = true;
}
disableDelete(){
  this.isEnabled = false;
}
goToFollowing()
{
this.navCtrl.push(profileFollowPage,{"users":this.following,"title":"following"});

}
goToFollowers()
{
this.navCtrl.push(profileFollowPage,{"users":this.followers,"title":"followers"});

}
enableDelete(){
this.navCtrl.push(settingsPage);
}
changedTitle(outfitkey: string,newtitle: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
this.outfits.update(outfitkey,{title:newtitle});
}
deleteOutfits(outfitkey: string){
var allOutfits =firebase.database().ref('/outfits/'+outfitkey);
allOutfits.remove(function(error){

});
var allOutfits =firebase.database().ref('/userOutfits/'+outfitkey);
allOutfits.remove(function(error){

});
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
console.log(outfitkey);
this.outfits.remove(outfitkey);
}


}
