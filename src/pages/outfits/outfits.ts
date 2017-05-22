import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {settingsPage} from '../settings/settings';
import * as firebase from 'firebase';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { Slides } from 'ionic-angular';
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
tempUsername: string;
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService,public toastCtrl: ToastController) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
      var username;
var tempUsername;
    this.myUser = user.uid;
     tempUsername = user.auth.email;

var ref = firebase.database().ref(user.uid+'/username');
ref.once('value', function(snapshot) {
  if (snapshot.val() === null) {
   
    
    username = tempUsername.substr(0, tempUsername.indexOf('@'));
     var db = firebase.database().ref(user.uid+'/username');

db.set(
 username
);
  } else {
    // username already exists, ask user for a different name
  }
});
  this.outfits = af.database.list(this.myUser+'/outfits/');
  } 
  this.isEnabled = false;

});
  }
  
   ngAfterViewInit() {
   }
/**
this.mySlideOptions = {
    loop: true,
   
    onSlideChangeEnd: s => {
        //this.onDidChange();
    },
   
    effect: 'coverflow',
    centeredSlides: true,
    slidesPerView: 1,
    coverflow: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 4,
        slideShadows: false
    }
};

  }
  
    ngOnInit() {
      firebase.auth().onAuthStateChanged((_currentUser) => {

      this.ngZone.run(() => {
        if (_currentUser) {
          console.log("in auth subscribe", _currentUser)
         this.myUser = _currentUser.uid;

          this.loadData();

        } else {
         this.myUser = null;
        }

      });

    })
  }
  
loadData() {
    var result1 = [];

firebase.database().ref(this.myUser+'/outfits/').on('child_added', function(data) {
var element = data.val();
 element.key = data.key;
result1.push(element);

});

firebase.database().ref(this.myUser+'/outfits/').on('child_removed', function(data) {
  var element = data.val();
 var index = this.outfits.indexOf(element);
 if (index > -1) {
    this.outfits.splice(index, 1);
}
});
  //this.grid = Array(Math.ceil(this.items.length/2));
  

  
}
 */
isDeleteEnabled()
{
return this.isEnabled;
}

enableDelete(){
this.navCtrl.push(settingsPage);
}
changedTitle(outfitkey: string,newtitle: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
this.outfits.update(outfitkey,{title:newtitle});
}
deleteOutfits(outfitkey: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
console.log(outfitkey);
this.outfits.remove(outfitkey);
}


}
