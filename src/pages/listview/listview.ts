import { Component, NgZone} from '@angular/core';
import { NavController,NavParams,AlertController,Platform} from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
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
infoone: any;
infotwo: any;
infothree: any;
infofour: any;
infofive: any;
infosix: any;
infoseven: any;
infoeight: any;
infonine: any;
infoten: any;
infoeleven: any;
infotwelve: any;
onelocation: any;
twolocation: any;
threelocation: any;
fourlocation: any;
fivelocation: any;
sixlocation: any;
sevenlocation: any;
eightlocation: any;
ninelocation: any;
tenlocation: any;
elevenlocation: any;
twelvelocation: any;
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
  constructor(public navCtrl: NavController,private ngZone: NgZone,public af: AngularFire,private _auth: AuthService,private navParams:NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder,public platform: Platform) {
          this.nameone = this.navParams.get("firstname"); 
        this.nametwo = this.navParams.get("secondname");
          this.namethree = this.navParams.get("thirdname");
          this.namefour = this.navParams.get("fourthname");
          this.namefive = this.navParams.get("fifthname");
          this.namesix = this.navParams.get("sixthname");
          this.nameseven = this.navParams.get("seventhname");
          this.nameeight = this.navParams.get("eighthname");
          this.namenine = this.navParams.get("ninthname");
          this.nameten = this.navParams.get("tenthname");
          this.nameeleven = this.navParams.get("eleventhname");
          this.nametwelve = this.navParams.get("twelthname");
          this.infoone = this.navParams.get("firstinfo");
          this.infotwo = this.navParams.get("secondinfo");
          this.infothree = this.navParams.get("thirdinfo");
          this.infofour = this.navParams.get("fourthinfo");
          this.infofive = this.navParams.get("fifthinfo");
          this.infosix = this.navParams.get("sixthinfo");
          this.infoseven = this.navParams.get("seventhinfo");
          this.infoeight = this.navParams.get("eigthinfo");
          this.infonine = this.navParams.get("ninthinfo");
          this.infoten = this.navParams.get("tenthinfo");
          this.infoeleven = this.navParams.get("eleventhinfo");
          this.infotwelve = this.navParams.get("twelthinfo");
          this.currentUser = this.navParams.get("user");
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
          this.eight = this.navParams.get("eighth");
          this.nine = this.navParams.get("ninth");
          this.ten = this.navParams.get("tenth");
          this.eleven = this.navParams.get("eleventh");
          this.twelve = this.navParams.get("twelth");
        



var loc;
if(String(this.nameone).charAt(0) == '-')
{
loc = this.nameone;
this.onelocation = loc;
this.nameone = "imported item";
}
else{
this.onelocation = this.nameone;
}
if(String(this.nametwo).charAt(0) == '-')
{
loc = this.nametwo;
this.twolocation = loc;
this.nametwo = "imported item";
}
else{
this.twolocation = this.nametwo;
}
if(String(this.namethree).charAt(0) == '-')
{
loc = this
this.threelocation = this.namethree;
this.namethree = "imported item";
}
else{
  this.threelocation = this.namethree;
}
if(String(this.namefour).charAt(0) == '-')
{
  this.fourlocation = this.namefour;
this.namefour = "imported item";
}
else{
 
  this.fourlocation = this.namefour;

}
if(String(this.namefive).charAt(0) == '-')
{
var name = this.namefive;
 this.fivelocation = this.namefive;
this.namefive = "imported item";
}
else{
this.fivelocation = this.namefive;
}

if(String(this.namesix).charAt(0) == '-')
{
this.sixlocation = this.namesix;
this.namesix = "imported item";
}
else{
this.sixlocation = this.namesix;
}
if(String(this.nameseven).charAt(0) == '-')
{
  this.sevenlocation = this.nameseven;
this.nameseven = "imported item";
}
else{
this.sevenlocation = this.nameseven;
}
if(String(this.nameeight).charAt(0) == '-')
{
  this.eightlocation = this.nameeight;
this.nameeight = "imported item";
}
else{
this.eightlocation = this.nameeight;
}
if(String(this.namenine).charAt(0) == '-')
{
  this.ninelocation = this.namenine;
  this.namenine = "imported item";
}
else{

this.ninelocation = this.namenine;
}
if(String(this.nameten).charAt(0) == '-')
{
  
  this.tenlocation = this.nameten;
  console.log(this.tenlocation);
this.nameten = "imported item";
}
else{
this.tenlocation = this.nameten;
}
if(String(this.nameeleven).charAt(0) == '-')
{
  this.elevenlocation = this.nameeleven;
  console.log(this.elevenlocation);
this.nameeleven = "imported item";
}
else{
this.elevenlocation = this.nameeleven;
}
if(String(this.nametwelve).charAt(0) == '-')
{
this.twelvelocation = this.nametwelve;
console.log(this.twelvelocation);
this.nametwelve = "imported item";
}
else{
  this.twelvelocation = this.nametwelve;

}
          if(this.one == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
      var ref = firebase.database().ref(this.currentUser+'/Jewelry/'+this.onelocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.onehas = true;
        }
      else{
       this.onehas = false;
    }
});
            this.items.push({"pic":this.one,"name":this.nameone,"number":1,"has":this.onehas,"location":this.onelocation,"brand":this.infoone.brand,"clickUrl":this.infoone.clickUrl});
          }
          if(this.two == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
    var ref = firebase.database().ref(this.currentUser+'/Hats/'+this.twolocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.twohas = true;
        }
      else{
       this.twohas = false;
    }
});
             this.items.push({"pic":this.two,"name":this.nametwo,"number":2,"has":this.twohas,"location":this.twolocation,"brand":this.infotwo.brand,"clickUrl":this.infotwo.clickUrl});

          }
          if(this.three == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {
        ;
          }
          else
          {
                var ref = firebase.database().ref(this.currentUser+'/Neckwear/'+this.threelocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.threehas = true;
        }
      else{
       this.threehas = false;
    }
});
                      this.items.push({"pic":this.three,"name":this.namethree,"number":3,"has":this.threehas,"location":this.threelocation,"brand":this.infothree.brand,"clickUrl":this.infothree.clickUrl});
          }
          if(this.four == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                var ref = firebase.database().ref(this.currentUser+'/Outerwear/'+this.fourlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.fourhas = true;
        
        }
      else{
       this.fourhas = false;
    }

});
            this.items.push({"pic":this.four,"name":this.namefour,"number":4,"has":this.fourhas,"location":this.fourlocation,"brand":this.infofour.brand,"clickUrl":this.infofour.clickUrl});
          }
          if(this.five == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
 var ref = firebase.database().ref(this.currentUser+'/Tops/'+this.fivelocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.fivehas = true;
        }
      else{
       this.fivehas = false;
  
    }
});
             this.items.push({"pic":this.five,"name":this.namefive,"number":5,"has":this.fivehas,"location":this.fivelocation,"brand":this.infofive.brand,"clickUrl":this.infofive.clickUrl});
          }
             if(this.six == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Tops/'+this.sixlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.sixhas = true;
        }
      else{
       this.sixhas = false;
  
    }
});
        this.items.push({"pic":this.six,"name":this.namesix,"number":6,"has":this.sixhas,"location":this.sixlocation,"brand":this.infosix.brand,"clickUrl":this.infosix.clickUrl});

          }
          if(this.seven == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Belts/'+this.sevenlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
              
        this.sevenhas = true;
        }
      else{
       this.sevenhas = false;
    }
});
         this.items.push({"pic":this.seven,"name":this.nameseven,"number":7,"has":this.sevenhas,"location":this.sevenlocation,"brand":this.infoseven.brand,"clickUrl":this.infoseven.clickUrl});

          }
          if(this.eight == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Bottoms/'+this.eightlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.eighthas = true;
           
        }
      else{
       this.eighthas = false;
      
    }
});
                    this.items.push({"pic":this.eight,"name":this.nameeight,"number":8,"has":this.eighthas,"location":this.eightlocation,"brand":this.infoeight.brand,"clickUrl":this.infoeight.clickUrl});
          }
          if(this.nine == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
  var ref = firebase.database().ref(this.currentUser+'/Jewelry/'+this.ninelocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.ninehas = true;
        }
      else{
       this.ninehas = false;
    }
});
                      this.items.push({"pic":this.nine,"name":this.namenine,"number":9,"has":this.ninehas,"location":this.ninelocation,"brand":this.infonine.brand,"clickUrl":this.infonine.clickUrl});
          }
          if(this.ten == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Bags/'+this.tenlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.tenhas = true;
        }
      else{
       this.tenhas = false;
    }
});
                      this.items.push({"pic":this.ten,"name":this.nameten,"number":10,"has":this.tenhas,"location":this.tenlocation,"brand":this.infoten.brand,"clickUrl":this.infoten.clickUrl});
          }
           if(this.eleven == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Shoes/'+this.elevenlocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.elevenhas = true;
        }
      else{
       this.elevenhas = false;
    }
});
                 this.items.push({"pic":this.eleven,"name":this.nameeleven,"number":11,"has":this.elevenhas,"location":this.elevenlocation,"brand":this.infoeleven.brand,"clickUrl":this.infoeleven.clickUrl});
          }
           if(this.twelve == "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe")
          {

          }
          else
          {
                        var ref = firebase.database().ref(this.currentUser+'/Bags/'+this.twelvelocation);
      ref.once('value', (snapshot) => {
       if (snapshot.val() != null) {
        this.twelvehas = true;
        }
      else{
       this.twelvehas = false;
    }
});
                this.items.push({"pic":this.twelve,"name":this.nametwelve,"number":12,"has":this.twelvehas,"location":this.twelvelocation,"brand":this.infotwelve.brand,"clickUrl":this.infotwelve.clickUrl});
          }


  if (user) {
 this.myUser = user.uid;


}

  }
        )};


  addItem(item)
  {
    var category;
    var id;
    var clickUrl;
    var brand;
    var ref;
if(item.number == 1)
{
category = "Jewelry";
if(!this.infoone.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
id = this.infoone.id;
brand = this.infoone.brand;
clickUrl = this.infoone.clickUrl;
}
else if(item.number == 2)
{
  if(!this.infotwo.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Hats";
id = this.infotwo.id;
brand = this.infotwo.brand;
clickUrl = this.infotwo.clickUrl;
}
else if(item.number == 3)
{
  if(!this.infothree.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Neckwear";
id = this.infothree.id;
brand = this.infothree.brand;
clickUrl = this.infothree.clickUrl;
}
else if(item.number == 4)
{
  if(!this.infofour.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Outerwear";
id = this.infofour.id;
brand = this.infofour.brand;
clickUrl = this.infofour.clickUrl;
}
else if(item.number == 5)
{
  if(!this.infofive.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Tops"
id = this.infofive.id;
brand = this.infofive.brand;
clickUrl = this.infofive.clickUrl;
}
else if(item.number == 6)
{
  if(!this.infosix.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Tops";
id = this.infosix.id;
brand = this.infosix.brand;
clickUrl = this.infosix.clickUrl;
}
else if(item.number == 7)
{
  if(!this.infoseven.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Belts";
id = this.infoseven.id;
brand = this.infoseven.brand;
clickUrl = this.infoseven.clickUrl;
}
else if(item.number == 8)
{
  if(!this.infoeight.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Bottoms";
id = this.infoeight.id;
brand = this.infoeight.brand;
clickUrl = this.infoeight.clickUrl;
}
else if(item.number == 9)
{
  if(!this.infonine.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Jewelry";
id = this.infonine.id;
brand = this.infonine.brand;
clickUrl = this.infonine.clickUrl;
}
else if(item.number == 10)
{
  if(!this.infoten.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Bags";
id = this.infoten.id;
brand = this.infoten.brand;
clickUrl = this.infoten.clickUrl;
}
else if(item.number == 11)
{
  if(!this.infoeleven.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Shoes";
id = this.infoeleven.id;
brand = this.infoeleven.brand;
clickUrl = this.infoeleven.clickUrl;
}
else if(item.number == 12)
{
  if(!this.infotwelve.brand){
  id = "import";
  brand = "import";
  clickUrl = "import";
}
category = "Bags";
id = this.infotwelve.id;
brand = this.infotwelve.brand;
clickUrl = this.infotwelve.clickUrl;
}
 ref = firebase.database().ref(firebase.auth().currentUser.uid+'/'+category+'/'+item.location);
 ref.set(
   {"url":item.pic,"id":id,"brand":brand,"clickUrl":clickUrl}

 )
 
 item.has = true;
  }
   launch(url) {
let browser = new InAppBrowser(url, "_system");

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
 ref = firebase.database().ref(firebase.auth().currentUser.uid+'/'+category+'/'+item.location);
ref.remove(function(error) {
  });
  item.has = false;





  }
 ngAfterViewInit() {





 


}


}