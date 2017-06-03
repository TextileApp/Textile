import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { profilePage } from '../profile/profile';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import { productsPage } from '../products/products';
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
@Component({
  selector: 'feed',
  templateUrl: 'feed.html'
})
export class feedPage {

 pet: string = "public";
  posts: Array<any>;
followingPosts: Array<any>;
  zone: any;
followingUsers: Array<any>;

  

  myUser: any;
  times: Array<any>;
  constructor(public navCtrl: NavController, private ngZone: NgZone, af: AngularFire, private _auth: AuthService, private navParams: NavParams) {
    const authObserver = af.auth.subscribe(user => {
      if (user) {
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.myUser = user.uid;
        
this.followingUsers = this.navParams.get("followedUsers");
console.log(this.followingUsers);
 this.runIt(this.followingUsers);

       
        this.gogogo();
      // this.filterPosts(); 

      }

    });



  }

  ngAfterViewInit() {





  }
  runIt(following) {
    var result2 = [];
    var temper = [];
    firebase.database().ref("/outfits/").orderByChild("timestamp").on('child_added', function (data) {
      var element = data.val();
      var theKey = data.key;
      if (element) {
        element.key = theKey;
        result2.push(element);
  if (following.indexOf(element.username) > -1) {
temper.push(element);
}
        console.log(result2);
      }
    });
    this.posts = result2;

    firebase.database().ref("/outfits").orderByChild("timestamp").on('child_removed', function (data) {
      var element = data.val();

      if (element) {
        var index = result2.indexOf(element);
        if (index > -1) {
          result2.splice(index, 1);
        }
        this.posts = result2;
        
      }
    });




  }

  toggleLike(thePost, key, i) {
var likeCount;
    var postRef = firebase.database().ref('outfits/'+key);
 postRef.transaction(function (thePost) {
      if (thePost) {
        if (thePost.likes && thePost.likes[this.myUser]) {
          thePost.likeCount--;
  
             
         console.log(thePost.likeCount);
          var adaRankRef = firebase.database().ref(thePost.user + '/totalLikes');
          adaRankRef.transaction(function (totalLikes) {
            if (totalLikes === null) {
              totalLikes = 0;
            }

            return totalLikes - 1;

          });
          thePost.likes[this.myUser] = null;

        } else {
      
          thePost.likeCount++;
       console.log("HELLO 1");
       
         console.log(thePost.likeCount);
          var adaRankRef = firebase.database().ref(thePost.user + '/totalLikes');
          adaRankRef.transaction(function (totalLikes) {
            if (totalLikes === null) {
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
     
       likeCount = thePost.likeCount;

      return thePost;
    });
 this.posts[i].likeCount = likeCount;
  }


  gogogo() {
    var temp = [];
    firebase.database().ref("outfits/").orderByChild("timestamp").on('child_added', function (data) {
      var element = data.val();
      if (element) {
        temp.push({ "key": data.key, "timestamp": element.timestamp });
      }
    });
    this.times = temp;
    for (var i = 0; i < this.times.length; i++) {
      this.setTime(this.times[i].key, this.times[i].timestamp);
    }

  }

  getFollowedUsers(){
       var tempo = [];
     firebase.database().ref(this.myUser+"/following/").once('value').then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
    
      var childData = childSnapshot.val();
      tempo.push(childData);
  }); 
});
this.followingUsers = tempo;
  }
  goToProfile(user) {
    this.navCtrl.push(profilePage, { "user": user });
  }
  setTime(key, timestamp) {
    var result2 = [];
    var ref = firebase.database().ref("outfits/" + key + "/time");
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