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

following: Array<any>;
originalFollowing: Array<any>;
allUsers: Array<any>;
searchedUser: any;
userFound: any;
searching:any;
followingID: Array<any>;
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
searchQuery: string = '';
usernameText: string;
mostPopList: Array<any>;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController,private ngZone: NgZone,public af: AngularFire,private _auth: AuthService,private navParams:NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder) {
        const authObserver = af.auth.subscribe( user => {
          
  if (user) {
 this.myUser = user.uid;


}

  }
        )};

printKey(key){
    var index = this.following.indexOf(key);
    var id = this.followingID[index];
    this.navCtrl.push(profilePage, { "user": id,"name":key});
  
}
  
 ngAfterViewInit() {

var temp = [];
var tempID = [];
var currentuser = this.myUser;
firebase.database().ref(this.myUser+'/following/').on('child_added', function(data) {
var element = data.val();
var id = data.key;
  var ref = firebase.database().ref(id+'/username');
ref.once('value', (snapshot) => {
var tempo = snapshot.val();
console.log(id);
console.log(tempo);
var followingref = firebase.database().ref(currentuser+"/following/"+id);
  followingref.set(tempo);

});
temp.push(element);
tempID.push(id);
});
this.following = temp;
this.originalFollowing = temp;
this.followingID = tempID;

firebase.database().ref(this.myUser+'/following/').on('child_removed', function(data) {
var element = data.val();
var id = data.key;
if(element){
var index1 = temp.indexOf(element);
if (index1 > -1) {
    temp.splice(index1, 1);
}
var index2 = temp.indexOf(id);
if (index2 > -1) {
    tempID.splice(index2, 1);
}

}
});
firebase.database().ref(this.myUser+'/following/').on('child_changed', function(data) {
var element = data.val();
var id = data.key;
console.log("CHANGING BITCH");
console.log(element);
console.log(data.key);
var index1 = tempID.indexOf(id);
if (index1 > -1) {
  temp[index1] = element;
}
});
this.following = temp;
this.originalFollowing = temp;
this.followingID = tempID;
 }
 initializeItems()
 {
this.following = this.originalFollowing;
 }
 followUser()
 {
  
  var ref = firebase.database().ref('/username/'+this.searchedUser);
ref.once('value', (snapshot) => {
var temp = snapshot.val();
var usernameRef = firebase.database().ref(this.myUser+"/following/"+temp);
  usernameRef.set(this.searchedUser);
  
});
this.initializeItems();
this.searching = false;
 }
 getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.following = this.following.filter((item) => {

        if(!(item.toLowerCase().indexOf(val.toLowerCase()) > -1))
        {
          this.searching = true;
          var usernameRef = firebase.database().ref('/username/'+val);

var ref = firebase.database().ref();
var q = ref.orderByChild('username').equalTo(val);
usernameRef.once('value', (snapshot) => {

  if (snapshot.val() === null) {
    this.userFound = false;
this.searchedUser = "No results 🙁";
  } else {
this.userFound = true;
this.searchedUser = val;
  
  }
});
        }else{
          this.searching = false;
        }
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })
    }
    else{
          this.searching = false;
        }
  }


 


}


