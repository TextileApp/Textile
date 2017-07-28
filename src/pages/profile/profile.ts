import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import {settingsPage} from '../settings/settings';
import * as firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { Slides,NavParams } from 'ionic-angular';
import {profileFollowPage} from '../profilefollow/profilefollow'
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class profilePage{
outfits: FirebaseListObservable<any>;
 profileSlideOptions: any;
//outfits:Array <any>;
@ViewChild(Slides) slides: Slides;

profileUser: any;
af: AngularFire;
isEnabled: boolean;
userName: any;
totalLikes: any;
currentUser:any;
followers: Array<any>;
following: Array<any>;
followerCount: any;
followingCount: any;
isFollowing: any;
profileUsername: any;
currentUsername: any;
tempUsername: string;
firebaseRefs: any;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private params: NavParams) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
     this.profileUser = this.params.get("user");
     this.profileUsername = this.params.get("name");
     this.currentUser = user.uid;
  this.outfits = af.database.list(this.profileUser+'/outfits/');
 this.getLikes();
  this.update();
  this.getFollowing();

  } 
  this.isEnabled = false;

});

  }
  
   ngAfterViewInit() {
     var tempfollowing = [];
 var tempfollowers = [];
var numberfollowers = 0;
var numberfollowing = 0;
 firebase.database().ref('following/'+this.profileUser).on('child_added', function(data) {
var element = data.val();
var name = data.key;
tempfollowing.push({"name":element,"id":name});


});
this.following = tempfollowing;

 firebase.database().ref('followers/'+this.profileUser).on('child_added', function(data) {
var element = data.val();
var name = data.key;
tempfollowers.push({"name":element,"id":name});

});

this.followers = tempfollowers;



var followingCountRef = firebase.database().ref('/following/'+this.profileUser);
 firebase.database().ref('following/'+this.profileUser).on("value", (snapshot) => {
  this.followingCount = snapshot.numChildren();
})
var followerCountRef = firebase.database().ref('/followers/'+this.profileUser);
 firebase.database().ref('/followers/'+this.profileUser).on("value",(snapshot) => {
  this.followerCount = snapshot.numChildren();
})

   }
ionViewWillEnter()
{
  this.update();
  this.getLikes();
}

update()
{
var usernameRef = firebase.database().ref('/username/'+this.profileUsername);
var ref = firebase.database().ref(this.profileUser+'/username');
ref.once('value', (snapshot) => {

if (snapshot.val() === null) {
   
var username;
var tempUsername;
    username = tempUsername.substr(0, tempUsername.indexOf('@'));
     var db = firebase.database().ref(this.profileUser+'/username');

db.set(username);
usernameRef.set(username);
  }
  else {
   this.userName = snapshot.val();
console.log(snapshot.val());
  }
});
var currentUsernameref = firebase.database().ref('/username/'+this.currentUser);
currentUsernameref.once('value', (snapshot) => {

if (snapshot.val() === null) {
   

  }
  else {
this.currentUsername = snapshot.val();
  }
});
}
goToFollowing()
{
this.navCtrl.push(profileFollowPage,{"users":this.following,"title":"following"});

}
goToFollowers()
{
this.navCtrl.push(profileFollowPage,{"users":this.followers,"title":"followers"});

}
getLikes(){
  var ref = firebase.database().ref(this.profileUser+'/totalLikes');
ref.once('value', (snapshot) => {
this.totalLikes = snapshot.val();
}

)}


followUser(){
    var followingref = firebase.database().ref('/following/'+this.currentUser+'/'+this.profileUser);
    var followersref = firebase.database().ref('/followers/'+this.profileUser+'/'+this.currentUser);
    //var followingCountRef = firebase.database().ref('/following/'+this.currentUser+'/followingCount');
   // var followersCountRef = firebase.database().ref('/followers/'+this.profileUser+'/followersCount');
    var nameref = firebase.database().ref(this.currentUser+'/username');


var name;
nameref.once('value', (snapshot) => {
  name = snapshot.val();
 followersref.set(name);
})
followingref.once('value', (snapshot) => {
 if (snapshot.val() == null) {
this.isFollowing = true;
followingref.set(
this.profileUsername
);
}
else
{
  followingref.remove();
  this.isFollowing = false;
}
})
followersref.once('value', (snapshot) => {
 if (snapshot.val() == null) {

followersref.set(
this.currentUsername
);
}
else
{
  followersref.remove();
  
}
})
  
 
}
 

getFollowing(){
  var ref = firebase.database().ref('/followers/'+this.profileUser+'/'+this.currentUser);
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
//firebase.database().ref(this.profileUser+'/outfits/'+outfit.key).remove();
this.outfits.update(outfitkey,{title:newtitle});
}


//firebase.database().ref(this.profileUser+'/outfits/'+outfit.key).remove();


}
