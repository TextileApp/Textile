import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { profilePage } from '../profile/profile';
import * as firebase from 'firebase';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../providers/auth-service';
import {listviewPage} from '../listview/listview';
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
doILike:boolean;
  

  myUser: any;
  times: Array<any>;
  constructor(public navCtrl: NavController, private ngZone: NgZone, af: AngularFire, private _auth: AuthService,public loadingCtrl: LoadingController, private navParams: NavParams) {
    
    const authObserver = af.auth.subscribe(user => {
      
      if (user) {
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.myUser = user.uid;


this.followingUsers = this.navParams.get("followedUsers");
var following = this.navParams.get("followedUsers");
    let loader = this.loadingCtrl.create({
    content: ""
  });
  loader.present();
    var result2 = [];
    var temper = [];
    var likes;
    
    var theUser = this.myUser;
    firebase.database().ref("/outfits/").orderByChild("order").on('child_added', function (data) {
      var element = data.val();
      var theKey = data.key;
      if (element) {
        element.key = theKey;

        result2.push(element);
        if(element.likes){
          likes = element.likes;
        
      
        if(theUser in likes){
         element.buttonIcon = "heart";
        }
        else{
          element.buttonIcon = "heart-outline";
        }
      }
        else{
          element.buttonIcon = "heart-outline";
        }

     
      }
    });
    this.posts = result2;
 firebase.database().ref('feed/'+this.myUser).orderByChild("order").on('child_added', function (data) {
      var element = data.val();
      var theKey = data.key;
      if (element) {
        element.key = theKey;

        temper.push(element);
        if(element.likes){
          likes = element.likes;
        
      
        if(theUser in likes){
         element.buttonIcon = "heart";
        }
        else{
          element.buttonIcon = "heart-outline";
        }
      }
        else{
          element.buttonIcon = "heart-outline";
        }

     
      }
    });
    this.followingPosts = temper;
  
    
    firebase.database().ref("/outfits").orderByChild("order").on('child_removed', function (data) {
      var element = data.val();

      if (element) {
        var index = result2.indexOf(element);
        if (index > -1) {
          
          result2.splice(index, 1);
        }
        this.posts = result2;
        
      }
    });

 firebase.database().ref("/outfits/").once('value', function(snapshot) {
  loader.dismiss();
});



       
        this.gogogo();
      // this.filterPosts(); 

      }

    });



  }

  ngAfterViewInit() {





  }

  runIt(following) {
   
  }
goToListview(post){
  if(!post.firstinfo)
  {
   post.firstinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.secondinfo)
  {
   post.secondinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.thirdinfo)
  {
   post.thirdinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.fourthinfo)
  {
   post.fourthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.fifthinfo)
  {
   post.fifthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.sixthinfo)
  {
   post.sixthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.seventhinfo)
  {
   post.seventhinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.eigthinfo)
  {
   post.eigthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.ninthinfo)
  {
   post.ninthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.tenthinfo)
  {
   post.tenthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.eleventhinfo)
  {
   post.eleventhinfo = {"brand":"import","id":"import","clickUrl":false};
  }
    if(!post.twelthinfo)
  {
   post.twelthinfo = {"brand":"import","id":"import","clickUrl":false};
  }
      this.navCtrl.push(listviewPage,{"firstname":post.firstname,"firstinfo":post.firstinfo,"secondinfo":post.secondinfo,"thirdinfo":post.thirdinfo,"fourthinfo":post.fourthinfo,"fifthinfo":post.fifthinfo,"sixthinfo":post.sixthinfo,"seventhinfo":post.seventhinfo,"eigthinfo":post.eigthinfo,"ninthinfo":post.ninthinfo,"tenthinfo":post.tenthinfo,"eleventhinfo":post.eleventhinfo,"twelthinfo":post.twelthinfo,"secondname":post.secondname,"thirdname":post.thirdname,"fourthname":post.fourthname,"fifthname":post.fifthname,"sixthname":post.sixthname,"seventhname":post.seventhname,"eighthname":post.eighthname,"ninthname":post.ninthname,"tenthname":post.tenthname,"eleventhname":post.eleventhname,"twelthname":post.twelthname,"first":post.first,"second":post.second,"third":post.third,"fourth":post.fourth,"fifth":post.fifth,"sixth":post.sixth,"seventh":post.seventh,"eighth":post.eighth,"ninth":post.ninth,"tenth":post.tenth,"eleventh":post.eleventh,"twelth":post.twelth});


}
  toggleLike(thePost, key, i) {
var currentUser = this.myUser;
var likeCount;
var iLike;
    var postRef = firebase.database().ref('outfits/'+key);
 postRef.transaction(function (thePost) {
      if (thePost) {
        if (thePost.likes && thePost.likes[currentUser]) {
          thePost.likeCount--;

          var adaRankRef = firebase.database().ref(thePost.user + '/totalLikes');
          adaRankRef.transaction(function (totalLikes) {
            if (totalLikes === null) {
              totalLikes = 0;
            }
            
            return totalLikes - 1;

          });
          thePost.likes[currentUser] = null;
         iLike = false;
        } else {
      
          thePost.likeCount++;
                 
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
           iLike = true;
          thePost.likes[currentUser] = true;
          
        }
      }

    
     

     
       likeCount = thePost.likeCount;

      return thePost;
    });
 this.posts[i].likeCount = likeCount;
if(iLike){
  this.posts[i].buttonIcon = "heart";
}
else{
  this.posts[i].buttonIcon = "heart-outline";
}
  }


  gogogo() {
    var temp = [];
    firebase.database().ref("outfits/").orderByChild("order").on('child_added', function (data) {
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

  
  goToProfile(post) {
    this.navCtrl.push(profilePage, { "user": post.user,"name":post.username });
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