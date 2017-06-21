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
  selector: 'listview',
  templateUrl: 'listview.html'
})
export class listviewPage {

//outfits:Array <any>;

following: Array<any>;
originalFollowing: Array<any>;
allUsers: Array<any>;
searchedUser: any;
followingID: Array<any>;
brands: Array<any>;
brandsID: Array<any>;
changedPass:boolean;
type: any;
newPassword: string;
brandsList: any;
category: any;
username: any;
one: any;
two: any;
three: any;
four: any;
five: any;
six: any;
seven: any;
eight: any;
nine: any;
ten: any;
eleven: any;
twelve: any;
nameone: any;
nametwo: any;
namethree: any;
namefour: any;
namefive: any;
namesix: any;
nameseven: any;
nameeight: any;
namenine: any;
nameten: any;
nameeleven: any;
nametwelve: any;
onehas: any;
twohas: any;
threehas: any;
fourhas: any;
fivehas: any;
sixhas: any;
sevenhas: any;
eighthas: any;
ninehas: any;
tenhas: any;
elevenhas: any;
twelvehas: any;
myUser: any;
currentUser: any;
searchQuery: string = '';
usernameText: string;
items: Array<any>;
itemnames: Array<any>;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController,private ngZone: NgZone,public af: AngularFire,private _auth: AuthService,private navParams:NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder) {
        const authObserver = af.auth.subscribe( user => {
         this.myUser = user.uid;
         this.items = [];
          this.one = this.navParams.get("first");
          this.two = this.navParams.get("second");
          this.three = this.navParams.get("third");
          this.four = this.navParams.get("fourth");
          this.five = this.navParams.get("fifth");
          this.six = this.navParams.get("sixth");
          this.seven = this.navParams.get("seventh");
          this.eight = this.navParams.get("eigth");
          this.nine = this.navParams.get("ninth");
          this.ten = this.navParams.get("tenth");
          this.eleven = this.navParams.get("eleventh");
          this.twelve = this.navParams.get("twelth");
          this.nameone = this.navParams.get("firstname");
          this.nametwo = this.navParams.get("secondname");
          this.namethree = this.navParams.get("thirdname");
          this.namefour = this.navParams.get("fourthname");
          this.namefive = this.navParams.get("fifthname");
          this.namesix = this.navParams.get("sixthname");
          this.nameseven = this.navParams.get("seventhname");
          this.nameeight = this.navParams.get("eigthname");
          this.namenine = this.navParams.get("ninthname");
          this.nameten = this.navParams.get("tenthname");
          this.nameeleven = this.navParams.get("eleventhname");
          this.nametwelve = this.navParams.get("twelthname");
          if(this.one == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
           var ref = firebase.database().ref(this.currentUser+'/Jewelry/'+this.nameone);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.onehas = false;
        }
      else{
       this.onehas = true;
    }
});
            this.items.push({"pic":this.one,"name":this.nameone,"number":1,"has":this.onehas});
          }
          if(this.two == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
    var ref = firebase.database().ref(this.currentUser+'/Hats/'+this.nametwo);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.twohas = false;
        }
      else{
       this.twohas = true;
    }
});
             this.items.push({"pic":this.two,"name":this.nametwo,"number":2,"has":this.twohas});

          }
          if(this.three == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {
        ;
          }
          else
          {
                var ref = firebase.database().ref(this.currentUser+'/Neckwear/'+this.namethree);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.threehas = false;
        }
      else{
       this.threehas = true;
    }
});
                      this.items.push({"pic":this.three,"name":this.namethree,"number":3,"has":this.threehas});
          }
          if(this.four == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                var ref = firebase.database().ref(this.currentUser+'/Outerwear/'+this.namefour);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.fourhas = false;
        }
      else{
       this.fourhas = true;
    }
});
            this.items.push({"pic":this.four,"name":this.namefour,"number":4,"has":this.fourhas});
          }
          if(this.five == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Tops/'+this.namefive);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.fivehas = false;
        }
      else{
       this.fivehas = true;
    }
});
             this.items.push({"pic":this.five,"name":this.namefive,"number":5,"has":this.fivehas});
          }
             if(this.six == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Tops/'+this.namesix);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.sixhas = false;
        }
      else{
       this.sixhas = true;
    }
});
        this.items.push({"pic":this.six,"name":this.namesix,"number":6,"has":this.sixhas});

          }
          if(this.seven == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Tops/'+this.nameseven);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.sevenhas = false;
        }
      else{
       this.sevenhas = true;
    }
});
         this.items.push({"pic":this.seven,"name":this.nameseven,"number":7,"has":this.sevenhas});

          }
          if(this.eight == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Belts/'+this.nameeight);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.eighthas = false;
        }
      else{
       this.eighthas = true;
    }
});
                    this.items.push({"pic":this.eight,"name":this.nameeight,"number":8,"has":this.eighthas});
          }
          if(this.nine == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Bottoms/'+this.namenine);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.ninehas = false;
        }
      else{
       this.ninehas = true;
    }
});
                      this.items.push({"pic":this.nine,"name":this.namenine,"number":9,"has":this.ninehas});
          }
          if(this.ten == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Jewelry/'+this.nameten);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.tenhas = false;
        }
      else{
       this.tenhas = true;
    }
});
                      this.items.push({"pic":this.ten,"name":this.nameten,"number":10,"has":this.tenhas});
          }
           if(this.eleven == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Shoes/'+this.nameeleven);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.elevenhas = false;
        }
      else{
       this.elevenhas = true;
    }
});
                 this.items.push({"pic":this.eleven,"name":this.nameeleven,"number":11,"has":this.elevenhas});
          }
           if(this.twelve == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Outerwear/'+this.nametwelve);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.twelvehas = false;
        }
      else{
       this.twelvehas = true;
    }
});
                this.items.push({"pic":this.twelve,"name":this.nametwelve,"number":12,"has":this.twelvehas});
          }

  
        console.log(this.items[1].pic);
        console.log(this.items[2].pic);  
        console.log(this.items[3].pic);  
        console.log(this.items[1].pic);
        console.log(this.items[2].pic);  
        console.log(this.items[3].pic); 
  if (user) {
 this.myUser = user.uid;


}

  }
        )};


  addItem(item)
  {
    var category;
    var ref;
if(item.number == 1)
{
category = "Jewelry";
}
else if(item.number == 2)
{
category = "Hats";
}
else if(item.number == 3)
{
category = "Neckwear";
}
else if(item.number == 4)
{
category = "Outerwear";
}
else if(item.number == 5)
{
category = "Tops"
}
else if(item.number == 6)
{
category = "Tops";
}
else if(item.number == 7)
{
category = "Belts";
}
else if(item.number == 8)
{
category = "Bottoms";
}
else if(item.number == 9)
{
category = "Jewelry";
}
else if(item.number == 10)
{
category = "Bags";
}
else if(item.number == 11)
{
category = "Shoes";
}
else if(item.number == 12)
{
category = "Bags";
}
 ref = firebase.database().ref(firebase.auth().currentUser.uid+'/'+category+''+item.name);
 ref.set(
item.pic
 )
 
 item.has = true;
  }
  
  removeItem(item)
  {

   var category;
    var ref;
if(item.number == 1)
{
category = "Jewelry";
}
else if(item.number == 2)
{
category = "Hats";
}
else if(item.number == 3)
{
category = "Neckwear";
}
else if(item.number == 4)
{
category = "Outerwear";
}
else if(item.number == 5)
{
category = "Tops"
}
else if(item.number == 6)
{
category = "Tops";
}
else if(item.number == 7)
{
category = "Belts";
}
else if(item.number == 8)
{
category = "Bottoms";
}
else if(item.number == 9)
{
category = "Jewelry";
}
else if(item.number == 10)
{
category = "Bags";
}
else if(item.number == 11)
{
category = "Shoes";
}
else if(item.number == 12)
{
category = "Bags";
}
 ref = firebase.database().ref(firebase.auth().currentUser.uid+'/'+category+''+item.name);
ref.remove(function(error) {
  });
  item.has = false;





  }
 ngAfterViewInit() {





 


}


}