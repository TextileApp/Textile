import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone, NgModule} from '@angular/core';
import * as firebase from 'firebase';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-outfits',
  templateUrl: 'outfits.html'
})
export class OutfitsPage implements OnInit {
outfits:Array <any>;
myUser: any;
isEnabled: boolean;
  constructor(public navCtrl: NavController,private ngZone: NgZone) {
this.isEnabled = false;
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
 this.outfits = result1;

firebase.database().ref(this.myUser+'/outfits/').on('child_removed', function(data) {
  var element = data.val();
 var index = this.outfits.indexOf(element);
 if (index > -1) {
    this.outfits.splice(index, 1);
}
});
  //this.grid = Array(Math.ceil(this.items.length/2));
  

  
}
isDeleteEnabled()
{
return this.isEnabled;
}

enableDelete(){
this.isEnabled = !this.isEnabled;
}
deleteOutfits(outfit){
firebase.database().ref(this.myUser+'/outfits/'+outfit.key).remove();

}
}
