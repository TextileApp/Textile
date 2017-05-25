import { Component, ViewChild, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
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
totalLikes: any;

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
   }
ionViewWillEnter()
{
  this.update();
  this.getLikes();
}
update()
{
var ref = firebase.database().ref(this.myUser+'/username');
ref.once('value', (snapshot) => {

 if (snapshot.val() === null) {
   
          var username;
var tempUsername;
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

  this.realEnableDelete();

   }
isDeleteEnabled()
{
return this.isEnabled;
}

realEnableDelete(){
 this.isEnabled = true;
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

//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
console.log(outfitkey);
this.outfits.remove(outfitkey);
}


}
