import { Component, NgZone} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import {profilePage} from '../profile/profile';
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


posts: FirebaseListObservable<any>;

myUser: any;
times:Array<any>;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,private navParams:NavParams) {
        const authObserver = af.auth.subscribe( user => {
  if (user) {

  this.posts = af.database.list("/outfits");

 this.myUser = user.uid;




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
this.gogogo();



 }

  toggleLike(thePost,key) {
  console.log(key);
  var postRef = firebase.database().ref('outfits/'+key);
  postRef.transaction(function(thePost) {
    if (thePost) {
      if (thePost.likes && thePost.likes[this.myUser]) {
        thePost.likeCount--;
             var adaRankRef = firebase.database().ref(thePost.user+'/totalLikes');
adaRankRef.transaction(function(totalLikes) {
if(totalLikes === null){
  totalLikes = 0;
}
  return totalLikes - 1;
});
        thePost.likes[this.myUser] = null;

      } else {
        thePost.likeCount++;
        var adaRankRef = firebase.database().ref(thePost.user+'/totalLikes');
adaRankRef.transaction(function(totalLikes) {
  if(totalLikes === null){
  totalLikes = 0;
}
  return totalLikes + 1;
});

        if (!thePost.likes) {
          thePost.likes = {};
        }
        thePost.likes[this.myUser] = true;
      }
    }
    return thePost;
  });
}


   gogogo() {
var temp = [];
firebase.database().ref("outfits/").orderByChild("timestamp").on('child_added', function(data) {
var element = data.val();
if(element){
temp.push({"key":data.key,"timestamp":element.timestamp});
}
});
this.times = temp;
for (var i=0; i < this.times.length; i++) {
  this.setTime(this.times[i].key,this.times[i].timestamp);
}

}
goToProfile(user){
 this.navCtrl.push(profilePage,{"user":user});
}
setTime(key,timestamp)
{
var result2 = [];
var ref = firebase.database().ref("outfits/"+key+"/time");
var now = (new Date).getTime();
var input = now - timestamp;

var since = this.timeConversion(input);

ref.set(since);

}
timeConversion(millisec) {

        var seconds = (millisec / 1000).toFixed(0);

        var minutes = (millisec / (1000 * 60)).toFixed(0);

        var hours = (millisec / (1000 * 60 * 60)).toFixed(0);

        var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);

        if (Number(seconds) < 60) {
            return seconds + " Sec ago";
        } else if (Number(minutes) < 60) {
            return minutes + " Min ago";
        } else if (Number(hours) < 24) {
            return hours + " Hrs ago";
        } else {
            return days + " Days ago"
        }
    }
}