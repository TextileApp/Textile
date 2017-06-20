import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone} from '@angular/core';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import { brandsPage } from '../brands/brands';
import {OutfitsPage} from '../outfits/outfits';
import {feedPage} from '../feed/feed';
import { NavController,ModalController,NavParams,ViewController,ActionSheetController,ToastController,PopoverController,LoadingController,Events,AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import {closetMenuPage} from '../closetMenu/closetMenu';
import { searchproductsPage } from '../searchproducts/searchproducts';
import {ShareService} from '../../providers/ShareService';
import{ImagePicker,Camera} from'ionic-native';
import { Http } from '@angular/http';
import { FirebaseApp,AngularFire } from 'angularfire2';
import { ImageCropperComponent } from "../cropper/img-cropper";
import 'rxjs/Rx';
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');
declare var window: any
function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
import {
  StackConfig,
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
   @ViewChild('myswing5') swingStack5: SwingStackComponent;
  @ViewChildren('mycards5') swingCards5: QueryList<SwingCardComponent>;
  @ViewChild('myswing6') swingStack6: SwingStackComponent;
  @ViewChildren('mycards6') swingCards6: QueryList<SwingCardComponent>;
   @ViewChild('myswing7') swingStack7: SwingStackComponent;
  @ViewChildren('mycards7') swingCards7: QueryList<SwingCardComponent>;
   @ViewChild('myswing8') swingStack8: SwingStackComponent;
  @ViewChildren('mycards8') swingCards8: QueryList<SwingCardComponent>;
     @ViewChild('myswing9') swingStack9: SwingStackComponent;
  @ViewChildren('mycards9') swingCards9: QueryList<SwingCardComponent>;
  @ViewChild('myswing10') swingStack10: SwingStackComponent;
  @ViewChildren('mycards10') swingCards10: QueryList<SwingCardComponent>;
   @ViewChild('myswing11') swingStack11: SwingStackComponent;
  @ViewChildren('mycards11') swingCards11: QueryList<SwingCardComponent>;
   @ViewChild('myswing12') swingStack12: SwingStackComponent;
  @ViewChildren('mycards12') swingCards12: QueryList<SwingCardComponent>;
     //@ViewChild('myswing13') swingStack13: SwingStackComponent;
   // @ViewChildren('mycards13') swingCards13: QueryList<SwingCardComponent>;
  genderPref: any;
  userName: any;
  testRadioOpen: boolean;
  card1Activated:boolean;
  showCard1:boolean;
  showPic1:boolean;
 showDelete1:boolean;
  card2Activated:boolean;
  showCard2:boolean;
  showPic2:boolean;
  showDelete2:boolean;
  card3Activated:boolean;
  showCard3:boolean;
  showPic3:boolean;
 showDelete3:boolean;
  card4Activated:boolean;
  showCard4:boolean;
  showPic4:boolean;
  showDelete4:boolean;
  card5Activated:boolean;
  showCard5:boolean;
  showPic5:boolean;
 showDelete5:boolean;
  card6Activated:boolean;
  showCard6:boolean;
  showPic6:boolean;
  showDelete6:boolean;
  card7Activated:boolean;
  showCard7:boolean;
  showPic7:boolean;
 showDelete7:boolean;
  card8Activated:boolean;
  showCard8:boolean;
  showPic8:boolean;
  showDelete8:boolean;
  card9Activated:boolean;
  showCard9:boolean;
  showPic9:boolean;
  showDelete9:boolean;
  card10Activated:boolean;
  showCard10:boolean;
  showPic10:boolean;
  showDelete10:boolean;
  card11Activated:boolean;
  showCard11:boolean;
  showPic11:boolean;
  showDelete11:boolean;
  card12Activated:boolean;
  showCard12:boolean;
  showPic12:boolean;
  showDelete12:boolean;
  showDress:boolean;
  
  editing:boolean;
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
    stackConfig5: StackConfig;
lastSavedFitRef: any;
  cards5: Array<any>;
  cards6: Array<any>;
  cards7: Array<any>;
  cards8: Array<any>;
  cards9: Array<any>;
  cards10: Array<any>;
  cards11: Array<any>;
  cards12: Array<any>;
   cardNames1: Array<any>;
  cardNames2: Array<any>;
  cardNames3: Array<any>;
  cardNames4: Array<any>;
   cardNames5: Array<any>;
  cardNames6: Array<any>;
  cardNames7: Array<any>;
  cardNames8: Array<any>;
  cardNames9: Array<any>;
  cardNames10: Array<any>;
  cardNames11: Array<any>;
  cardNames12: Array<any>;

  
  brands: Array<any>;
  //cards13: Array<any>;
  storage = firebase.storage();
  public currentUser: any;
  isEmpty: boolean;
  allHats: Array<any>;
  allShirts: Array<any>;
  allPants: Array<any>;
  allShoes: Array<any>;
  
  constructor( public popoverCtrl: PopoverController,public navCtrl: NavController,public af:AngularFire,public loadingCtrl: LoadingController, public authService: AuthService,private http: Http, private ngZone: NgZone,public modalCtrl: ModalController,public toastCtrl: ToastController,public events:Events,public alertCtrl: AlertController
  ) {
           
       const authObserver = af.auth.subscribe( user => {
  if (!user) {
        //navCtrl.push(LoginPage);
        navCtrl.setRoot(LoginPage);
      }else{
         

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
            this.stackConfig5 = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      }, 
  
      throwOutDistance: (d) => {
        return 400;
      }
    };
      }
    });
      events.subscribe('image:picked', (image,type) => {

  
if(type == "Jewelry"){
var index = this.cards1.indexOf(image);
   if(image && index > -1){
    this.cards1.splice(index, 1);
    this.cards1.unshift(image);
    }

 }
if(type == "Hats")
 {
var index = this.cards2.indexOf(image);
   if(image && index > -1){
    this.cards2.splice(index, 1);
    this.cards2.unshift(image);
    }
 }
if(type == "Neckwear")
 {
var index = this.cards3.indexOf(image);
   if(image && index > -1){
    this.cards3.splice(index, 1);
    this.cards3.unshift(image);
    }
 }
if(type == "Outerwear")
 {
  var index = this.cards4.indexOf(image);
   if(image && index > -1){
    this.cards4.splice(index, 1);
    this.cards4.unshift(image);
    }
 }
if(type == "Tops")
 {
  var index = this.cards5.indexOf(image);
   if(image && index > -1){
    this.cards5.splice(index, 1);
    this.cards5.unshift(image);
    }
 }
if(type == "Tops2")
 {
  var index = this.cards6.indexOf(image);
   if(image && index > -1){
    this.cards6.splice(index, 1);
    this.cards6.unshift(image);
  }
 }
if(type == "Belts")
 {
var index = this.cards7.indexOf(image);
   if(image && index > -1){
    this.cards7.splice(index, 1);
    this.cards7.unshift(image);
    }
 }
if(type == "Bottoms")
 {
var index = this.cards8.indexOf(image);
   if(image && index > -1){
    this.cards8.splice(index, 1);
    this.cards8.unshift(image);
    }
 }
 if(type == "Jewelry2")
 {
var index = this.cards9.indexOf(image);
   if(image && index > -1){
    this.cards9.splice(index, 1);
    this.cards9.unshift(image);
    }

 }
if(type == "Bags")
 {
var index = this.cards10.indexOf(image);
   if(image && index > -1){
    this.cards10.splice(index, 1);
    this.cards10.unshift(image);
    }
 }
if(type == "Shoes")
 {
  var index = this.cards11.indexOf(image);
   if(image && index > -1){
    this.cards11.splice(index, 1);
    this.cards11.unshift(image);
    }
 } 
if(type == "Bags2")
 {
var index = this.cards12.indexOf(image);
   if(image && index > -1){
    this.cards12.splice(index, 1);
    this.cards12.unshift(image);
    }
 }
 
  });
      }
  
  ngOnInit() {
    // subscribe to the auth object to check for the login status
    // of the user, if logged in, save some user information and
    // execute the firebase query...
    // .. otherwise
    // show the login modal page
  this.editing = false;
  this.showCard1 = true;
  this.showCard2 = true;
  this.showCard3 = true;
  this.showCard4 = true;
  this.showCard5 = true;
  this.showCard6 = true;
  this.showCard7 = true;
  this.showCard8 = true;
  this.showCard9 = true;
  this.showCard10 = true;
  this.showCard11 = true;
  this.showCard12 = true;
  this.showPic1 = true;
  this.showPic2 = true;
  this.showPic3 = true;
  this.showPic4 = true;
  this.showPic5 = true;
  this.showPic6 = true;
  this.showPic7 = true;
  this.showPic8 = true;
  this.showPic9 = true;
  this.showPic10 = true;
  this.showPic11 = true;
  this.showPic12 = true;
this.card1Activated = false;
this.card2Activated = false;
this.card3Activated = false;
this.card4Activated = false;
this.card5Activated = false;
this.card6Activated = false;
this.card7Activated = false;
this.card8Activated = false;
this.card9Activated = false;
this.card10Activated = false;
this.card11Activated = false;
this.card12Activated = false;
this.showDelete1 = false;
this.showDelete2 = false;
 this.showDelete3 = false;
 this.showDelete4 = false;
 this.showDelete5 = false;
 this.showDelete7 = false;
this.showDelete8 = false;
this.showDelete9 = false;
  this.showDelete10 = false;
  this.showDelete12 = false;
    this.showDress = true;
    this.didSaveThisOutfit = false;
  
 
  const authObserver = this.af.auth.subscribe( user => {
      this.ngZone.run(() => {
        if (user) {
          console.log("in auth subscribe", user)
          this.currentUser = user.uid;

          this.loadData();
          this.getUserGender();
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

      this.swingStack5.throwout.subscribe((event: DragEvent) => {
    this.swingStack5.stack.getCard(event.target).throwIn(0,0);	
      
    });
     
       this.swingStack6.throwout.subscribe((event: DragEvent) => {
    this.swingStack6.stack.getCard(event.target).throwIn(0,0);	
      
    });
  
   
         this.swingStack7.throwout.subscribe((event: DragEvent) => {
    this.swingStack7.stack.getCard(event.target).throwIn(0,0);	
      
    });
  
         this.swingStack8.throwout.subscribe((event: DragEvent) => {
    this.swingStack8.stack.getCard(event.target).throwIn(0,0);	
      
  });
           this.swingStack9.throwout.subscribe((event: DragEvent) => {
    this.swingStack9.stack.getCard(event.target).throwIn(0,0);	
      
  });
           this.swingStack10.throwout.subscribe((event: DragEvent) => {
    this.swingStack10.stack.getCard(event.target).throwIn(0,0);	
      
  });
           this.swingStack11.throwout.subscribe((event: DragEvent) => {
    this.swingStack11.stack.getCard(event.target).throwIn(0,0);	
      
  });
           this.swingStack12.throwout.subscribe((event: DragEvent) => {
    this.swingStack12.stack.getCard(event.target).throwIn(0,0);	
      
  });
     //  this.swingStack13.throwout.subscribe((event: DragEvent) => {
   // this.swingStack12.stack.getCard(event.target).throwIn(0,0);	
      
 // });
shopstyle.brands(null).then(response => {
    for (let val of response) {
      this.brands.push(val);
     console.log(val);
    }
  });

  }


  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Clothes Gender Preference');

    alert.addInput({
      type: 'radio',
      label: 'Male',
      value: 'male',
      checked: true
    });
        alert.addInput({
      type: 'radio',
      label: 'Female',
      value: 'female',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.genderPref = data;
        this.testRadioOpen = false;
 var db = firebase.database().ref(this.currentUser+'/gender');

db.set(
this.genderPref
);
  
  

      
      }
    });
    alert.present();
  }

getUserGender(){
var ref = firebase.database().ref(this.currentUser+'/gender');
ref.once('value', (snapshot) => {

 if (snapshot.val() != null) {
  this.genderPref = snapshot.val();
}
else{
  this.showRadio();
}
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
}
addNewCards5(oldcard: string) {
  this.cards5.push(oldcard);
}
addNewCards6(oldcard: string) {
  this.cards6.push(oldcard);
}
addNewCards7(oldcard: string) {
  this.cards7.push(oldcard);
}
addNewCards8(oldcard: string) {
  this.cards8.push(oldcard);
}
addNewCards9(oldcard: string) {
  this.cards9.push(oldcard);
}
addNewCards10(oldcard: string) {
  this.cards10.push(oldcard);
}
addNewCards11(oldcard: string) {
  this.cards11.push(oldcard);
}
addNewCards12(oldcard: string) {
  this.cards12.push(oldcard);
}
//addNewCards13(oldcard: string) {
 //this.cards12.push(oldcard);
//}
goToOtherPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(closetMenuPage);
  }
 
    openModal1(imagesArray) {
    console.log(this.card1Activated);
  if(this.card1Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Jewelry",gender:this.genderPref})

  }
 }
     openModal2(imagesArray) {

  if(this.card2Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Hats",gender:this.genderPref})

  }}

    openModal3(imagesArray) {

  if(this.card3Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Neckwear",gender:this.genderPref})

  }}
          


      openModal4(imagesArray) {

  if(this.card4Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Outerwear",gender:this.genderPref})

  }}
      openModal5(imagesArray) {

  if(this.card5Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Tops",gender:this.genderPref})

  }}
    openModal6(imagesArray) {

  if(this.card6Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Tops2",gender:this.genderPref})

  }}
      openModal7(imagesArray) {

  if(this.card7Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Belts",gender:this.genderPref})

  }}
       openModal8(imagesArray) {

  if(this.card8Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Bottoms",gender:this.genderPref})

  }}
    openModal9(imagesArray) {

  if(this.card9Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Jewelry2",gender:this.genderPref})

  }}
    openModal10(imagesArray) {

  if(this.card10Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Bags",gender:this.genderPref})

  }}
      openModal11(imagesArray) {

  if(this.card11Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Shoes",gender:this.genderPref})

  }}
    openModal12(imagesArray) {

  if(this.card12Activated == false){
  this.didSaveThisOutfit = false;

let page = this.navCtrl.push(imagePicker,{images:imagesArray,user:this.currentUser,type:"Bags2",gender:this.genderPref})

  }}

  startEditing()
{

this.showCard1 = true;
this.showCard2 = true;
this.showCard3 = true;
this.showCard4 = true;
this.showCard5 = true;
this.showCard6 = true;
this.showCard7 = true;
this.showCard8 = true;
this.showCard9 = true;
this.showCard10 = true;
this.showCard11 = true;
this.showCard12 = true;

}



 pressEvent($event) {
   if(this.editing == false){
   this.startEditing();
   if(this.showPic1 == true){
     this.showDelete1 = true;
     this.card1Activated = false;

   }
   else{
this.showDelete1 = false;
this.card1Activated = true;

   }
   if(this.showPic2 == true){
     this.showDelete2 = true;
     this.card2Activated = false;
   }
   else{
this.showDelete2 = false;
this.card2Activated = true;
   }
   if(this.showPic3 == true){
     this.showDelete3 = true;
     this.card3Activated = false;
   }
   else{
    this.showDelete3 = false;
    this.card3Activated = true;
   }
  if(this.showPic4 == true){
    this.showDelete4 = true;
     this.card4Activated = false;
   }
   else{
    this.showDelete4 = false;
    this.card4Activated = true;
   }
    if(this.showPic5 == true){
    this.showDelete5 = true;
    this.card5Activated = false;
   }
   else{
    this.showDelete5 = false;
    this.card5Activated = true;
   }
 
     if(this.showPic6 == true){
    this.showDelete6 = true;
    this.card6Activated = false;
   }
   else{
    this.showDelete6 = false;
    this.card6Activated = true;
   }
     if(this.showPic7 == true){
    this.showDelete7 = true;
    this.card7Activated = false;
   }
   else{
    this.showDelete7 = false;
    this.card7Activated = true;
   }
      if(this.showPic8 == true){
    this.showDelete8 = true;
    this.card8Activated = false;
   }
   else{
    this.showDelete8 = false;
    this.card8Activated = true;
   }
     if(this.showPic9 == true){
    this.showDelete9 = true;
    this.card9Activated = false;
   }
   else{
    this.showDelete9 = false;
    this.card9Activated = true;
   }
     if(this.showPic10 == true){
    this.showDelete10 = true;
    this.card10Activated = false;
   }
   else{
    this.showDelete10 = false;
    this.card10Activated = true;
   }
    if(this.showPic11 == true){
    this.showDelete11 = true;
    this.card11Activated = false;
   }
   else{
    this.showDelete11 = false;
    this.card11Activated = true;
   }
     if(this.showPic12 == true){
    this.showDelete12 = true;
    this.card12Activated = false;
   }
   else{
    this.showDelete12 = false;
    this.card12Activated = true;
   }
   this.editing = true;
}
  else{
this.doneEditing();
}
  }
  
  activateCard1(){

  this.showPic1 = true;
   this.didSaveThisOutfit = false;
  this.doneEditing();

}
activateCard2(){
  this.showPic2 = true;
   this.didSaveThisOutfit = false;
 
  this.doneEditing();
}
 activateCard3(){

  this.showPic3 = true;
    this.didSaveThisOutfit = false;

  this.doneEditing();

}
 activateCard4(){

  this.showPic4 = true;
    this.didSaveThisOutfit = false;

  this.doneEditing();

}
 activateCard5(){

  this.showPic5 = true;
  this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard6(){

  this.showPic6 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard7(){

  this.showPic7 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard8(){

  this.showPic8 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard9(){

  this.showPic9 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard10(){

  this.showPic10 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard11(){

  this.showPic11 = true;
    this.didSaveThisOutfit = false;
  this.doneEditing();

}
 activateCard12(){

  this.showPic12 = true;
      this.didSaveThisOutfit = false;

  this.doneEditing();

}
    doneEditing(){
  this.showDelete1 = false;
  this.showDelete2 = false;
  this.showDelete3 = false;
  this.showDelete4 = false;
  this.showDelete5 = false;
  this.showDelete6 = false;
  this.showDelete7 = false;
  this.showDelete8 = false;
  this.showDelete9 = false;
  this.showDelete10 = false;
  this.showDelete11 = false;
  this.showDelete12 = false;
  this.card1Activated = false;
  this.card2Activated = false;
  this.card3Activated = false;
  this.card4Activated = false;
  this.card5Activated = false;
  this.card6Activated = false;
  this.card7Activated = false;
  this.card8Activated = false;
  this.card9Activated = false;
  this.card10Activated = false;
  this.card11Activated = false;
  this.card12Activated = false;

   if(this.showPic1 == true){
  this.showCard1 = true;

   }
   else{
  this.showCard1 = false;
   }
      if(this.showPic2 == true){
  this.showCard2 = true;

   }
   else{
  this.showCard2 = false;
   }
   if(this.showPic3 == true){
  this.showCard3 = true;

   }
   else{
  this.showCard3 = false;
   }
    if(this.showPic4 == true){
  this.showCard4 = true;

   }
   else{
  this.showCard4 = false;
   }
      if(this.showPic5 == true){
  this.showCard5 = true;

   }
   else{
  this.showCard5 = false;
   }
 
       if(this.showPic6 == true){
  this.showCard6 = true;

   }
   else{
  this.showCard6 = false;
   }
        if(this.showPic7 == true){
  this.showCard7 = true;

   }
   else{
  this.showCard7 = false;
   }
        if(this.showPic8 == true){
  this.showCard8 = true;

   }
   else{
  this.showCard8 = false;
   }
     if(this.showPic9 == true){
  this.showCard9 = true;

   }
   else{
  this.showCard9 = false;
   }
       if(this.showPic10 == true){
  this.showCard10 = true;

   }
   else{
  this.showCard10 = false;
   }
      if(this.showPic11 == true){
  this.showCard11 = true;

   }
   else{
  this.showCard11 = false;
   }
     if(this.showPic12 == true){
  this.showCard12 = true;

   }
   else{
  this.showCard12 = false;
   }
   this.editing = false;
  }
  removeCard1()
  {
    this.card1Activated = false;
    this.showPic1 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }



    removeCard2()
  {
    this.card2Activated = false;
    this.showPic2 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
   removeCard3()
  {
    this.card3Activated = false;
    this.showPic3 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard4()
  {
    this.card3Activated = false;
    this.showPic4 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard5()
  {
    this.card5Activated = false;
    this.showPic5 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard6()
  {
    this.card7Activated = false;
    this.showPic6 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard7()
  {
    this.card7Activated = false;
    this.showPic7 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard8()
  {
    this.card8Activated = false;
    this.showPic8 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard9()
  {
    this.card9Activated = false;
    this.showPic9 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
       removeCard10()
  {
    this.card10Activated = false;
    this.showPic10 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard11()
  {
    this.card11Activated = false;
    this.showPic11 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }
     removeCard12()
  {
    this.card12Activated = false;
    this.showPic12 = false;
      this.didSaveThisOutfit = false;
    this.doneEditing();
  }

loadData() {

   let loader = this.loadingCtrl.create({
    content: ""
  });
  //Show the loading indicator

  var ref = firebase.database().ref(this.currentUser+'/username');
ref.once('value', (snapshot) => {

 if (snapshot.val() === null) {
   
var username;
var tempUsername;
    username = tempUsername.substr(0, tempUsername.indexOf('@'));
     var db = firebase.database().ref(this.currentUser+'/username');

db.set(
 username
);
  this.userName = username;
  }else{
   this.userName = snapshot.val();
  }
});

  loader.present();
    var result1 = [];
    var nameresult1 = [];

firebase.database().ref(this.currentUser+'/Jewelry/').on('child_added', function(data) {
var element = data.val();

result1.push(element);
nameresult1.push(data.key);
});

 this.cards1 = result1;
 this.cardNames1 = nameresult1;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Jewelry/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Jewelry.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result1.push(dupe);
         result1.push(url);

      this.cards1 = result1;

    });
  }
});

firebase.database().ref(this.currentUser+'/Jewelry/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result1.indexOf(element);
if (index > -1) {
    result1.splice(index, 1);
    nameresult1.splice(index,1);
}
}
});
this.cardNames1 = nameresult1;
this.cards1 = result1;
var result2 = [];
var nameresult2 = [];

firebase.database().ref(this.currentUser+'/Hats/').on('child_added', function(data) {
var element = data.val();
if(element){
nameresult2.push(data.key);
result2.push(element);
}
});
 this.cards2 = result2;
 this.cardNames2 = nameresult2;
firebase.database().ref(this.currentUser+'/Hats/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
  var userStorageRef = firebase.storage().ref().child('Icons/Hat.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
   result2.push(dupe);
         result2.push(url);
   this.cards2 = result2;
});
  }
  else{
          loader.dismiss();

  }
});
  firebase.database().ref(this.currentUser+'/Hats/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result2.indexOf(element);
if (index > -1) {
    result2.splice(index, 1);
    nameresult2.splice(index,1);
}
}
});
this.cards2 = result2;
this.cardNames2 = nameresult2;
  var result3 = [];
  var nameresult3 = [];
//this.cards3 = [];

firebase.database().ref(this.currentUser+'/Neckwear/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result3.indexOf(element);
if (index > -1) {
    result3.splice(index, 1);
    nameresult3.splice(index,1);
}
}
});
this.cards3 = result3;
this.cardNames3 = nameresult3;


firebase.database().ref(this.currentUser+'/Neckwear/').on('child_added', function(data) {
var element = data.val();
if(element){
result3.push(element);
nameresult3.push(data.key);
}
});
this.cards3 = result3;
this.cardNames3 = nameresult3;
firebase.database().ref(this.currentUser+'/Neckwear/').once('value', function(snapshot) {
  if (!(snapshot.exists())) {
var userStorageRef = firebase.storage().ref().child('Icons/Tie.png');
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
 var nameresult4 = [];
    firebase.database().ref(this.currentUser+'/Outerwear/').on('child_added', function(data) {
var element = data.val();
if(element){

result4.push(element);
nameresult4.push(data.key);
}
});

 this.cards4 = result4;
 this.cardNames4 = nameresult4;
  // this.grid = Array(Math.ceil(this.items1.length/2));

   firebase.database().ref(this.currentUser+'/Outerwear/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
var userStorageRef = firebase.storage().ref().child('Icons/Outerwear.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
                  result4.push(url);
                  result4.push(dupe);
                       loader.dismiss();     

                  
    });
  }
  else{
               loader.dismiss();

  }
}); 
this.cards4 = result4;

firebase.database().ref(this.currentUser+'/Outerwear/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result4.indexOf(element);
if (index > -1) {
    result4.splice(index, 1);
    nameresult4.splice(index,1);
}
}
});
this.cards4 = result4;
this.cardNames4 = nameresult4;
firebase.database().ref(this.currentUser+'/Outerwear/').on('child_added', function(data) {
var element = data.val();

result4.push(element);
nameresult4.push(data.key);
});

 this.cards4 = result4;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Outerwear/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Outerwear.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result4.push(dupe);
         result4.push(url);

      this.cards4 = result4;

    });
  }
});

var result5 = [];
 var nameresult5 = [];
var result6 = [];
 var nameresult6 = [];


firebase.database().ref(this.currentUser+'/Tops/').on('child_added', function(data) {
var element = data.val();

result5.push(element);
nameresult5.push(data.key);
result6.push(element);
nameresult6.push(data.key);
});

 this.cards6 = result6;
this.cards5 = result5;
 this.cardNames5 = nameresult5;
 this.cardNames6 = nameresult6;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Tops/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef1 = firebase.storage().ref().child('Icons/shirtIcon.png');
   var userStorageRef2 = firebase.storage().ref().child('Icons/Shirt2.png');

    userStorageRef1.getDownloadURL().then(url => {
       var dupe = url;
         result5.push(dupe);
         result5.push(url);

      this.cards5 = result5;

    });
      userStorageRef2.getDownloadURL().then(url => {
       var dupe = url;
         result6.push(dupe);
         result6.push(url);

      this.cards6 = result6;

    });
  }
});

firebase.database().ref(this.currentUser+'/Tops/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result5.indexOf(element);
if (index > -1) {
    result5.splice(index, 1);
    nameresult5.splice(index,1);
    result6.splice(index, 1);
    nameresult6.splice(index,1);
}
}
this.cards5 = result5;
this.cardnames5 = nameresult5;
this.cards6 = result6;
this.cardnames6 = nameresult6;
});






  var result7 = [];
   var nameresult7 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Belts/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Belt.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result7.push(dupe);
         result7.push(url);

      this.cards7 = result7;

    });
  }
});

firebase.database().ref(this.currentUser+'/Belts/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result1.indexOf(element);
if (index > -1) {
    result7.splice(index, 1);
    nameresult7.splice(index,1);
}
}
});
this.cards7 = result7;
this.cardNames7 = nameresult7;

firebase.database().ref(this.currentUser+'/Belts/').on('child_added', function(data) {
var element = data.val();

result7.push(element);
nameresult7.push(data.key);
});

 this.cards7 = result7;
 this.cardNames7 = nameresult7;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Belts/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Belt.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result7.push(dupe);
         result7.push(url);

      this.cards7 = result7;

    });
  }
});

firebase.database().ref(this.currentUser+'/Belts/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result7.indexOf(element);
if (index > -1) {
    result7.splice(index, 1);
    nameresult7.splice(index,1);
}
}
});
this.cards7 = result7;
this.cardNames7 = nameresult7;



 var result8 = [];
  var nameresult8 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bottoms/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/pantsIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result8.push(dupe);
         result8.push(url);

      this.cards8 = result8;

    });
  }
});

firebase.database().ref(this.currentUser+'/Bottoms/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result1.indexOf(element);
if (index > -1) {
    result8.splice(index, 1);
    nameresult8.splice(index,1);
}
}
});
this.cards8 = result8;
this.cardNames8 = nameresult8;

firebase.database().ref(this.currentUser+'/Bottoms/').on('child_added', function(data) {
var element = data.val();

result8.push(element);
nameresult8.push(data.key);
});

 this.cards8 = result8;
 this.cardNames8 = nameresult8;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bottoms/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/pantsIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result8.push(dupe);
         result8.push(url);

      this.cards8 = result8;

    });
  }
});

firebase.database().ref(this.currentUser+'/Bottoms/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result8.indexOf(element);
if (index > -1) {
    result8.splice(index, 1);
    nameresult8.splice(index,1);
}
}
});
this.cards8 = result8;
this.cardNames8 = nameresult8;

 var result9 = [];
  var nameresult9 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Jewelry/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Jewelry.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result9.push(dupe);
         result9.push(url);

      this.cards9 = result9;

    });
  }
});

firebase.database().ref(this.currentUser+'/Jewelry/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result9.indexOf(element);
if (index > -1) {
    result9.splice(index, 1);
    nameresult9.splice(index,1);
}
}
});
this.cards9 = result9;
this.cardNames9 = nameresult9;

firebase.database().ref(this.currentUser+'/Jewelry/').on('child_added', function(data) {
var element = data.val();

result9.push(element);
nameresult9.push(data.key);
});

 this.cards9 = result9;
 this.cardNames9 = nameresult9;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Jewelry/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Jewelry.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result9.push(dupe);
         result9.push(url);

      this.cards9 = result9;

    });
  }
});



 var result10 = [];
  var nameresult10 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bags/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Bag2.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result10.push(dupe);
         result10.push(url);

      this.cards10 = result10;

    });
  }
});

firebase.database().ref(this.currentUser+'/Bags/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result10.indexOf(element);
if (index > -1) {
    result10.splice(index, 1);
    nameresult10.splice(index,1);
}
}
});
this.cards10 = result10;
this.cardNames10 = nameresult10;

firebase.database().ref(this.currentUser+'/Bags/').on('child_added', function(data) {
var element = data.val();

result10.push(element);
nameresult10.push(data.key);
});

 this.cards10 = result10;
 this.cardNames10 = nameresult10;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bags/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Bag2.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result10.push(dupe);
         result10.push(url);

      this.cards10 = result10;

    });
  }
});

firebase.database().ref(this.currentUser+'/Bags/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result10.indexOf(element);
if (index > -1) {
    result10.splice(index, 1);
    nameresult10.splice(index,1);
}
}
});
this.cards10 = result10;
this.cardNames10 = nameresult10;

 var result11 = [];
 var nameresult11 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Shoes/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/shoeIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result11.push(dupe);
         result11.push(url);

      this.cards11 = result11;

    });
  }
});

firebase.database().ref(this.currentUser+'/Shoes/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result11.indexOf(element);
if (index > -1) {
    result11.splice(index, 1);
    nameresult11.splice(index,1);
}
}
});
this.cards11 = result11;
this.cardNames11 = nameresult11;

firebase.database().ref(this.currentUser+'/Shoes/').on('child_added', function(data) {
var element = data.val();

result11.push(element);
nameresult11.push(data.key);
});

 this.cards11 = result11;
 this.cardNames11 = nameresult11;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Shoes/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/ShoesIcon.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result11.push(dupe);
         result11.push(url);

      this.cards11 = result11;

    });
  }
});




 var result12 = [];
 var nameresult12 = [];
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bags/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Bag1.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result12.push(dupe);
         result12.push(url);

      this.cards12 = result12;

    });
  }
});

firebase.database().ref(this.currentUser+'/Bags/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result12.indexOf(element);
if (index > -1) {
    result12.splice(index, 1);
    nameresult12.splice(index,1);
}
}
});
this.cards12 = result12;
this.cardNames12 = nameresult12;

firebase.database().ref(this.currentUser+'/Bags/').on('child_added', function(data) {
var element = data.val();

result12.push(element);
nameresult12.push(data.key);
});

 this.cards12 = result12;
 this.cardNames12 = nameresult12;
  //this.grid = Array(Math.ceil(this.items.length/2));
  firebase.database().ref(this.currentUser+'/Bags/').once('value', function(snapshot) {

  if (!(snapshot.exists())) {
   var userStorageRef = firebase.storage().ref().child('Icons/Bag1.png');
    userStorageRef.getDownloadURL().then(url => {
       var dupe = url;
         result12.push(dupe);
         result12.push(url);

      this.cards12 = result12;

    });
  }
});


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

voteUp5() {
 let removedCard = this.cards5.shift();
   this.didSaveThisOutfit = false;
this.addNewCards5(removedCard);
}

voteUp6() {
 let removedCard = this.cards6.shift();
   this.didSaveThisOutfit = false;
this.addNewCards6(removedCard);
 
}
  voteUp7() {
let removedCard = this.cards7.shift();
  this.didSaveThisOutfit = false;

this.addNewCards7(removedCard);

}

voteUp8() {
 let removedCard = this.cards8.shift();
   this.didSaveThisOutfit = false;

   this.cards8.push(removedCard);

}
voteUp9() {
 let removedCard = this.cards9.shift();
   this.didSaveThisOutfit = false;

   this.cards9.push(removedCard);

}
voteUp10() {
 let removedCard = this.cards10.shift();
   this.didSaveThisOutfit = false;

   this.cards10.push(removedCard);

}
voteUp11() {
 let removedCard = this.cards11.shift();
   this.didSaveThisOutfit = false;

   this.cards11.push(removedCard);

}
voteUp12() {
 let removedCard = this.cards12.shift();
   this.didSaveThisOutfit = false;

   this.cards12.push(removedCard);

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

trackByCards5(index: number, card5: any){
return card5;
}
trackByCards6(index: number, card6: any){
return card6;
}

trackByCards7(index: number, card7: any){
return card7;
}
trackByCards8(index: number, card8: any){
return card8;
}
trackByCards9(index: number, card9: any){
return card9;
}
trackByCards10(index: number, card10: any){
return card10;
}

trackByCards11(index: number, card11: any){
return card11;
}
trackByCards12(index: number, card12: any){
return card12;
}
openBrands() {
        this.navCtrl.push(brandsPage);
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
    this.navCtrl.push(OutfitsPage);
  }
   goToFeed() {
         var tempo = [];
     firebase.database().ref(this.currentUser+"/following/").once('value').then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
    
      var childData = childSnapshot.val();
      tempo.push(childData);
  }); 
    console.log(tempo);
});
    this.navCtrl.push(feedPage,{"followedUsers":tempo});

  
  }
  saveOutfit() {

if(this.didSaveThisOutfit == false){

var newChildRef = firebase.database().ref(firebase.auth().currentUser.uid+'/outfits/');
this.lastSavedFitRef = newChildRef.push();

var topcard1;
var topcard2;
var topcard3;
var topcard4;
var topcard5;
var topcard6;
var topcard7;
var topcard8;
var topcard9;
var topcard10;
var topcard11;
var topcard12;

var namecard1;
var namecard2;
var namecard3;
var namecard4;
var namecard5;
var namecard6;
var namecard7;
var namecard8;
var namecard9;
var namecard10;
var namecard11;
var namecard12;

if(this.cardNames1[0].charAt(0) == '-')
{
namecard1 = "imported item";
}
else{
namecard1 = this.cardNames1[0];
}
if(this.cardNames2[0].charAt(0) == '-')
{
  namecard2 = "imported item";
}
else{
namecard2 = this.cardNames2[0];
}
if(this.cardNames3[0].charAt(0) == '-')
{
  namecard3 = "imported item";
}
else{
namecard3 = this.cardNames3[0];
}
if(this.cardNames4[0].charAt(0) == '-')
{
  namecard4 = "imported item";
}
else{
namecard4 = this.cardNames4[0];
}
if(this.cardNames5[0].charAt(0) == '-')
{
  namecard5 = "imported item";
}
else{
namecard5 = this.cardNames5[0];
}
if(this.cardNames6[0].charAt(0) == '-')
{
  namecard6 = "imported item";
}
else{
namecard6= this.cardNames6[0];
}
if(this.cardNames7[0].charAt(0) == '-')
{
  namecard7 = "imported item";
}
else{
namecard7 = this.cardNames7[0];
}
if(this.cardNames8[0].charAt(0) == '-')
{
  namecard8 = "imported item";
}
else{
namecard8 = this.cardNames8[0];
}
if(this.cardNames9[0].charAt(0) == '-')
{
  namecard9 = "imported item";
}
else{
namecard9 = this.cardNames9[0];
}
if(this.cardNames10[0].charAt(0) == '-')
{
  namecard10 = "imported item";
}
else{
namecard10 = this.cardNames10[0];
}
if(this.cardNames11[0].charAt(0) == '-')
{
  namecard11 = "imported item";
}
else{
namecard11 = this.cardNames11[0];
}
if(this.cardNames12[0].charAt(0) == '-')
{
  namecard12 = "imported item";
}
else{
namecard12 = this.cardNames12[0];
}

if(this.showPic1 == true)
{
   topcard1 = this.cards1[0];

}else{
  topcard1 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic2 == true)
{
topcard2 = this.cards2[0];
}
else{
  topcard2 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic3 == true)
{
topcard3 = this.cards3[0];
}
else{
  topcard3 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}

if(this.showPic4 == true)
{
topcard4 = this.cards4[0];
}
else{
  topcard4 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic5 == true)
{
topcard5 = this.cards5[0];

}
else{
  topcard5 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic6 == true)
{
  topcard6 = this.cards6[0];

}
else{
  topcard6 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic7 == true)
{
  topcard7 = this.cards7[0];

}
else{
  topcard7 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic8 == true)
{
  topcard8 = this.cards8[0];

}
else{
  topcard8 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic9 == true)
{
  topcard9 = this.cards9[0];

}
else{
  topcard9 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic10 == true)
{
 topcard10 = this.cards10[0];

}
else{
  topcard10 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic11 == true)
{
 topcard11 = this.cards11[0];

}
else{
  topcard11 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}
if(this.showPic12 == true)
{
topcard12 = this.cards12[0];

}
else{
  topcard12 = "https://firebasestorage.googleapis.com/v0/b/streetwear-3906e.appspot.com/o/Icons%2Fblank.png?alt=media&token=6e900447-a122-4e67-b4e0-fb70fd932cfe";
}





this.lastSavedFitRef.set(
  {first:topcard1,second:topcard2,third:topcard3,fourth:topcard4,fifth:topcard5,sixth:topcard6,seventh:topcard7,eighth:topcard8,ninth:topcard9,tenth:topcard10,eleventh:topcard11,twelth:topcard12,timestamp:firebase.database.ServerValue.TIMESTAMP}
);
 let toast = this.toastCtrl.create({
      message: 'Outfit saved successfully ❤️️',
      duration: 3000,
      position:"middle"
    
    });
    toast.present();
    this.didSaveThisOutfit = true;
  var allOutfits = firebase.database().ref('/outfits/'+this.lastSavedFitRef.key);
allOutfits.set({firstname:namecard1,secondname:namecard2,thirdname:namecard3,fourthname:namecard4,fifthname:namecard5,sixthname:namecard6,seventhname:namecard7,eighthname:namecard8,ninthname:namecard9,tenthname:namecard10,eleventhname:namecard11,twelthname:namecard12,first:topcard1,second:topcard2,third:topcard3,fourth:topcard4,fifth:topcard5,sixth:topcard6,seventh:topcard7,eighth:topcard8,ninth:topcard9,tenth:topcard10,eleventh:topcard11,twelth:topcard12,timestamp:firebase.database.ServerValue.TIMESTAMP,user:firebase.auth().currentUser.uid,username:this.userName,likeCount:0});
}

  else if(this.didSaveThisOutfit == true){
var newChildRef = firebase.database().ref(firebase.auth().currentUser.uid+'/outfits/'+this.lastSavedFitRef.key);
  newChildRef.remove(function(error) {


  });
var allOutfits =firebase.database().ref('/outfits/'+this.lastSavedFitRef.key);
allOutfits.remove(function(error){

});

 let toast = this.toastCtrl.create({
      message: 'Outfit removed successfully 💔',
      duration: 3000,
      position:"middle"
    
    });
    toast.present();
    this.didSaveThisOutfit = false;


  
}
}


}

  
  

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

@Component({template: `
<ion-header>

  <ion-toolbar>
    <ion-title>
      Choose a item
    </ion-title>
      <ion-buttons start>
    <button icon-only ion-button (click)="dismiss()">
        <ion-icon name="close" color="navcolor"> </ion-icon>
      </button>
    </ion-buttons>
     <ion-buttons end>
        <button ion-button color = "navcolor" icon-only (click)="addPics1()">
  <ion-icon name="add"></ion-icon>
</button>
 </ion-buttons>
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
didSaveThisOutfit:boolean;
 storageRef: any;
  currentImage
 currentUser: any;
 type: string;
 rawType: string;
 gender: string;
public imgUri: string;

 constructor( private params: NavParams,
    public viewCtrl: ViewController,public popoverCtrl: PopoverController,private ngZone: NgZone,public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,private shareService: ShareService,@Inject(FirebaseApp) firebaseApp: any,public navctrl:NavController,public events:Events) {
     this.storageRef = firebaseApp.storage().ref();
     
   // this.images = this.params.get('images');
  this.currentUser = this.params.get("user");
  this.images = this.params.get("images");
  this.gender = this.params.get("gender");
 for (let entry of this.images) {
    console.log(entry); // 1, "string", false
} 
  this.type = this.params.get("type");
this.rawType = this.params.get("type");
if(this.rawType == "Bags2")
{
this.rawType = "Bags";
}
else if(this.rawType == "Jewelry2")
{
this.rawType = "Jewelry";
}
else if(this.rawType == "Tops2")
{
this.rawType = "Tops";
}
}

 dismiss(){
   this.navctrl.pop();
 }
  doImageResize(img, callback, MAX_WIDTH: number = 900, MAX_HEIGHT: number = 900) {
    var canvas = document.createElement("canvas");

    var image = new Image();

    image.onload = function () {
      console.log("Size Before: " + image.src.length + " bytes");

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      console.log("Size After:  " + dataUrl.length + " bytes");
      callback(dataUrl)
    }

    image.src = img;
  }
      public presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Source',
      buttons: [
         {
          text: 'Database',
          handler: () => {
          this.openBrands();
          }
        },
          {
          text: 'Search',
          handler: () => {
          this.openSearch();
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0); //Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1);//Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public presentCropModal(img: string,clothes: string) {
     var aspect = 1;
    if(this.type == "Dresses"){
 aspect = 2/3; 
}
  else{
    aspect = 1;
  }       
    let cropModal = this.modalCtrl.create(ImageCropperComponent, {'imgUri': img,'aspectRatio':aspect});

    cropModal.onDidDismiss(data => {
       if(data){
       if(this.type == "Hats"){
        console.log("ITS HATS");
        clothes = 'Hats';
       }
       if(this.type == "'Hats'")
       {
    console.log("ITS HATSSjjsjjj");
       }
       console.log(clothes);
       console.log(this.type);
       console.log("hentai");
      this.imgUri = data;
      console.log(this.imgUri);
            var uuid = generateUUID();
            var imgBlob: any = dataURLtoBlob(this.imgUri);
            imgBlob.name = uuid+'.jpg';
      var uploadTask = this.storageRef.child(this.currentUser+'/'+clothes+'/'+imgBlob.name).put(imgBlob);
    console.log(this.currentUser+'/'+this.rawType+'/'+imgBlob.name);
// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
       console.log('NIGGA WE unauthorized IT');
      break;

    case 'storage/canceled':
      // User canceled the upload
             console.log('NIGGA WE CANCELLED IT');

      break;

 
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
                   console.log(error.serverResponse);

      break;
  }
}, function() {
       console.log('NIGGA WE MADE IT');
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
  console.log(downloadURL);

     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+clothes);
var newPostRef = this.db.push();

newPostRef.set(
  downloadURL
);
});
         

   
       }
    });
 cropModal.present();
  }

openBrands() {
        this.navctrl.push(brandsPage,{"type":this.rawType,"gender":this.gender});
    }
openSearch()
{
 this.navctrl.push(searchproductsPage,{"type":this.rawType,"gender":this.gender});
}
  chooseImage(tapimage) {
    this.pickedImage = tapimage;
       this.events.publish('image:picked', this.pickedImage,this.type);
    this.navctrl.pop();
}
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      sourceType: sourceType,
      // targetWidth: 320,
      // targetHeight: 320,
      destinationType: 0, //Camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    Camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
      // this.imgData = imageData;
      this.imgUri = imageData;
      this.presentCropModal(this.imgUri,this.rawType);
    }, (err) => {
      console.log(err);
    });
  }
 addPics()
{
var clothes = this.rawType;
  
  console.log(clothes);
var options =  {
          // if no title is passed, the plugin should use a sane default (preferrably the same as it was, so check the old one.. there are screenshots in the marketplace doc)
          maximumImagesCount: 10,
          title: 'Select photos',
          allowEdit:true
        // optional default no helper message above the picker UI
          // be careful with these options as they require additional processing
         
          //             outputType: imagePicker.OutputType.BASE64_STRING
        }
     
ImagePicker.getPictures(options).then((results) => {
  
  for (var i = 0; i < results.length; i++) {
    
      console.log('Image URI: ' + results[i]);
        window.resolveLocalFileSystemURL('file:///'+results[i], (fileEntry) => {
            var uuid = generateUUID();
            this.doImageResize(results[i], (_data) => {
        this.ngZone.run(() => {
          this.currentImage = _data
        })
      }, 640)
                    fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = uuid+'.jpg';
      var uploadTask = this.storageRef.child(this.currentUser+'/'+clothes+'/'+imgBlob.name).put(imgBlob);
        console.log(imgBlob.name+'fuck the popopopop');
       console.log("FUCK MY GERORIIIM");

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
       console.log('NIGGA WE unauthorized IT');
      break;

    case 'storage/canceled':
      // User canceled the upload
             console.log('NIGGA WE CANCELLED IT');

      break;

 
    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
                   console.log(error.serverResponse);

      break;
  }
}, function() {
       console.log('NIGGA WE MADE IT');
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
  console.log(downloadURL);
 
     this.db = firebase.database().ref(firebase.auth().currentUser.uid+'/'+clothes);
var newPostRef = this.db.push();


newPostRef.set(downloadURL);


});

      
};
          reader.onerror = (e) => {
            console.log("Failed file read: " + e.toString());
          };
          reader.readAsArrayBuffer(resFile);

        });
      }, (err) => {
        console.log(err);
        alert(JSON.stringify(err))
      });
  
    }
}, (err) => {
      console.log("resolveLocalFileSystemURL", err);
      alert(JSON.stringify(err))
    });
}
addPics1(){
    this.presentActionSheet();
   // this.dismiss();  
}
}