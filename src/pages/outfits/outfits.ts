import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone, NgModule} from '@angular/core';
import * as firebase from 'firebase';
import { NavController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController,private ngZone: NgZone,af: AngularFire,private _auth: AuthService) {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
    this.myUser = user.uid;
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
this.isEnabled = !this.isEnabled;
}
changedTitle(outfitkey: string,newtitle: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
this.outfits.update(outfitkey,{title:newtitle});
}
deleteOutfits(outfitkey: string){
//firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();
this.outfits.remove(outfitkey);
}


}
