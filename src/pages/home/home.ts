import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone, NgModule} from '@angular/core';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import {AboutPage} from '../about/about';
import { NavController,ModalController,NavParams,ViewController,ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ContactPage } from '../contact/contact';
import { Http } from '@angular/http';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';

import 'rxjs/Rx';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
 @ViewChild('myswing1') swingStack1: SwingStackComponent;
  @ViewChildren('mycards1') swingCards1: QueryList<SwingCardComponent>;
  @ViewChild('myswing2') swingStack2: SwingStackComponent;
  @ViewChildren('mycards2') swingCards2: QueryList<SwingCardComponent>;
   @ViewChild('myswing3') swingStack3: SwingStackComponent;
  @ViewChildren('mycards3') swingCards3: QueryList<SwingCardComponent>;
   @ViewChild('myswing4') swingStack4: SwingStackComponent;
  @ViewChildren('mycards4') swingCards4: QueryList<SwingCardComponent>;
  cards1: Array<any>;
  stackConfig1: StackConfig;
  recentCard1: string = '';
  cards2: Array<any>;
  didSaveThisOutfit: boolean;
  stackConfig2: StackConfig;
  recentCard2: string = '';
   image: string;
  cards3: Array<any>;
  stackConfig3: StackConfig;
  recentCard3: string = '';
  cards4: Array<any>;
  stackConfig4: StackConfig;
  recentCard4: string = '';
  storage = firebase.storage();
  public currentUser: any;
  allHats: Array<any>;
  allShirts: Array<any>;
  allPants: Array<any>;
  allShoes: Array<any>;

  constructor(public navCtrl: NavController, public authService: AuthService,private http: Http, private ngZone: NgZone,public modalCtrl: ModalController,public toastCtrl: ToastController) {
           
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //navCtrl.push(LoginPage);
        navCtrl.setRoot(LoginPage);
      }else if(user){
         

this.stackConfig1 = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      }, 
  
      throwOutDistance: (d) => {
        return 400;
      }
    };
     this.stackConfig2 = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      }, 
  
      throwOutDistance: (d) => {
        return 400;
      }
    };
         this.stackConfig3 = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      }, 
  
      throwOutDistance: (d) => {
        return 400;
      }
    };
           this.stackConfig4 = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      }, 
  
      throwOutDistance: (d) => {
        return 400;
      }
    };
      }
    });

  }
  ngOnInit() {
    // subscribe to the auth object to check for the login status
    // of the user, if logged in, save some user information and
    // execute the firebase query...
    // .. otherwise
    // show the login modal page
    this.didSaveThisOutfit = false;
    firebase.auth().onAuthStateChanged((_currentUser) => {

      this.ngZone.run(() => {
        if (_currentUser) {
          console.log("in auth subscribe", _currentUser)
          this.currentUser = _currentUser.uid;

          this.loadData();

        } else {
          this.currentUser = null
        }

      });

    })
  }
ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack1.throwout.subscribe((event: DragEvent) => {
    this.swingStack1.stack.getCard(event.target).throwIn(0,0);	
      
    });
     
       this.swingStack2.throwout.subscribe((event: DragEvent) => {
    this.swingStack2.stack.getCard(event.target).throwIn(0,0);	
      
    });
  
   
         this.swingStack3.throwout.subscribe((event: DragEvent) => {
    this.swingStack3.stack.getCard(event.target).throwIn(0,0);	
      
    });
  
         this.swingStack4.throwout.subscribe((event: DragEvent) => {
    this.swingStack4.stack.getCard(event.target).throwIn(0,0);	
      
    });

  }



addNewCards1(oldcard: string) {
  this.cards1.push(oldcard);

}


addNewCards2(oldcard: string) {
  this.cards2.push(oldcard);

 
}

 

addNewCards3(oldcard: string) {
  this.cards3.push(oldcard);

 // this.http.get('https://randomuser.me/api/?results=' + count)
 // .map(data => data.json().results)
 // .subscribe(result => {
  //  for (let val of result) {
 ///     this.cards1.push(val);
  //  } 
  //})
}


addNewCards4(oldcard: string) {
  this.cards4.push(oldcard);

 // this.http.get('https://randomuser.me/api/?results=' + count)
 // .map(data => data.json().results)
 // .subscribe(result => {
  //  for (let val of result) {
 ///     this.cards1.push(val);
  //  } 
  //})
}

goToOtherPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(ContactPage);
  }
  openModal1(imagesArray) {
  this.didSaveThisOutfit = false;
let modal = this.modalCtrl.create(imagePicker, imagesArray);
     modal.onDidDismiss(data => {
    this.cards1.unshift(data.image);
   });
   modal.present();
 }
   openModal2(imagesArray) {
       this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, imagesArray);
     modal.onDidDismiss(data => {
    this.cards2.unshift(data.image);
   });
   modal.present();
 }

  openModal3(imagesArray) {
      this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, imagesArray);
     modal.onDidDismiss(data => {
    this.cards3.unshift(data.image);
   });
   modal.present();
 }

  openModal4(imagesArray) {
      this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, imagesArray);
     modal.onDidDismiss(data => {
    this.cards4.unshift(data.image);
   });
   modal.present();
 }


  

loadData() {
    var result1 = [];

firebase.database().ref(this.currentUser+'/Hats/').on('child_added', function(data) {
var element = data.val();

result1.push(element);

});

 this.cards1 = result1;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Hats/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/hatIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result1.push(dupe);
         result1.push(url);

     

    });
  }
});
 this.cards1 = result1;

var result2 = [];


firebase.database().ref(this.currentUser+'/Tops/').on('child_added', function(data) {
var element = data.val();
if(element){

result2.push(element);
}
});
 this.cards2 = result2;
firebase.database().ref(this.currentUser+'/Tops/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
  var userStorageRef = firebase.storage().ref().child('Icons/shirtIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
   result2.push(dupe);
         result2.push(url);
  
});
  }
});
 this.cards2 = result2;


   

  
  var result3 = [];
//this.cards3 = [];

 


firebase.database().ref(this.currentUser+'/Bottoms/').on('child_added', function(data) {
var element = data.val();
if(element){
result3.push(element);
}
});
this.cards3 = result3;

firebase.database().ref(this.currentUser+'/Bottoms/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
var userStorageRef = firebase.storage().ref().child('Icons/pantsIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
   result3.push(dupe);
  result3.push(url);
     

    });
  }
});
this.cards3 = result3;

  //this.grid = Array(Math.ceil(this.items1.length/2));

     var result4 = [];

    firebase.database().ref(this.currentUser+'/Shoes/').on('child_added', function(data) {
var element = data.val();
if(element){

result4.push(element);
}
});

 this.cards4 = result4;
  // this.grid = Array(Math.ceil(this.items1.length/2));

   firebase.database().ref(this.currentUser+'/Shoes/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
var userStorageRef = firebase.storage().ref().child('Icons/shoeIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
                  result4.push(url);
                  result4.push(dupe);
                  
    });
  }
}); 
this.cards4 = result4;
}
voteUp1() {
 let removedCard = this.cards1.shift();
   this.didSaveThisOutfit = false;
this.addNewCards1(removedCard);
}

voteUp2() {
 let removedCard = this.cards2.shift();
   this.didSaveThisOutfit = false;
this.addNewCards2(removedCard);
 
}
  voteUp3() {
let removedCard = this.cards3.shift();
  this.didSaveThisOutfit = false;

this.addNewCards3(removedCard);

}

voteUp4() {
 let removedCard = this.cards4.shift();
   this.didSaveThisOutfit = false;

   this.cards4.push(removedCard);

}
trackByCards1(index: number, card1: any){
return card1;
}
trackByCards2(index: number, card2: any){
return card2;
}

trackByCards3(index: number, card3: any){
return card3;
}
trackByCards4(index: number, card4: any){
return card4;
}
// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }

  return hex;
}
  goToSaved() {
    this.navCtrl.push(AboutPage);
  }
  saveOutfit() {
if(this.didSaveThisOutfit == false){
var newChildRef = firebase.database().ref(firebase.auth().currentUser.uid+'/outfits/');
var newPostRef = newChildRef.push();
var topcard1 = this.cards1[0];
var topcard2 = this.cards2[0];
var topcard3 = this.cards3[0];
var topcard4 = this.cards4[0];

newPostRef.set(
  {first:topcard1,second:topcard2,third:topcard3,fourth:topcard4}
);
 let toast = this.toastCtrl.create({
      message: 'Outfit saved successfully ❤️️',
      duration: 3000,
      position:"middle"
    
    });
    toast.present();
  }
this.didSaveThisOutfit = true;
}
  }
  



@Component({template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Choose a photo
    </ion-title>

  </ion-toolbar>
</ion-header>
<ion-content>
   <ion-row wrap>
  <ion-col width-33 *ngFor="let f of images" (click)="chooseImage(f)">
  <img *ngIf="f"[src]="f">
  </ion-col>
</ion-row>
</ion-content>
`})
export class imagePicker {
images: Array<any>;
pickedImage: string;
 constructor( public params: NavParams,
    public viewCtrl: ViewController) {

    this.images = this.params.get('images');


}
 dismiss() {
   let data = { image:this.pickedImage };
   this.viewCtrl.dismiss(data);
 }

  chooseImage(tapimage) {
    this.pickedImage = tapimage;
    
    this.dismiss();
}
}