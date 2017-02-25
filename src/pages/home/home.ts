import { Component, ViewChild, ViewChildren, QueryList, Inject, OnInit, NgZone, NgModule} from '@angular/core';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import {OutfitsPage} from '../outfits/outfits';
import { NavController,ModalController,NavParams,ViewController,ToastController,LoadingController,PopoverController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
//import { PopoverContentPage } from '../contact/popover';
import {closetMenuPage} from '../closetMenu/closetMenu';
import { ContactPage } from '../contact/contact';
import { Http } from '@angular/http';
import { ImagePicker, File} from 'ionic-native';
import {ShareService} from '../../providers/ShareService';
import { FirebaseApp,FirebaseListObservable,AngularFire} from 'angularfire2';

import 'rxjs/Rx';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';
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
  card1Activated:boolean;
  showCard1:boolean;
  showPic1:boolean;
 showDelete1:boolean;
  modifyingState:boolean;
  card2Activated:boolean;
  showCard2:boolean;
  showPic2:boolean;
  showDelete2:boolean;
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
  isEmpty: boolean;
  allHats: Array<any>;
  allShirts: Array<any>;
  allPants: Array<any>;
  allShoes: Array<any>;

  constructor(public navCtrl: NavController,public af:AngularFire, public loadingCtrl: LoadingController,public authService: AuthService,private http: Http, private ngZone: NgZone,public modalCtrl: ModalController,public toastCtrl: ToastController) {
           
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
      }
    });

  }
  ngOnInit() {
    // subscribe to the auth object to check for the login status
    // of the user, if logged in, save some user information and
    // execute the firebase query...
    // .. otherwise
    // show the login modal page
    this.showDelete2 = false;
    this.showDelete1 = false;
    this.showCard1 = true;
    this.showCard2 = true;
    this.showPic1 = true;
    this.showPic2 = true;
    this.didSaveThisOutfit = false;
  const authObserver = this.af.auth.subscribe( user => {
      this.ngZone.run(() => {
        if (user) {
          console.log("in auth subscribe", user)
          this.currentUser = user.uid;

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
    this.navCtrl.push(closetMenuPage);
  }
  openModal1(imagesArray) {
  this.didSaveThisOutfit = false;
let modal = this.modalCtrl.create(imagePicker,{images:imagesArray,user:this.currentUser,type:"Hats"});
     modal.onDidDismiss(data => {
    if(data){
    this.cards1.unshift(data.image);
    this.cards1.pop();
    }
   });
   modal.present();
 }
   openModal2(imagesArray) {
       this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, { "images":imagesArray,"user":this.currentUser,"type":"Tops"});
     modal.onDidDismiss(data => {
         if(data){
    this.cards2.unshift(data.image);
    this.cards2.pop();
         }
   });
   modal.present();
 }

  openModal3(imagesArray) {
      this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, { images:imagesArray,user:this.currentUser,type:"Bottoms"});
     modal.onDidDismiss(data => {
          if(data){
    this.cards3.unshift(data.image);
    this.cards3.pop();
          }
   });
   modal.present();
 }

  openModal4(imagesArray) {
      this.didSaveThisOutfit = false;

let modal = this.modalCtrl.create(imagePicker, { images:imagesArray,user:this.currentUser,type:"Shoes"});
     modal.onDidDismiss(data => {
          if(data){
    this.cards4.unshift(data.image);
    this.cards4.pop();
          }
   });
   modal.present();
 }

startEditing()
{
this.showCard1 = true;
this.showCard2 = true;

}
 pressEvent(e) {
   this.modifyingState = true;
   this.startEditing();
   if(this.showPic1 == true){
     this.showDelete1 = true;
   }
   else{
this.card1Activated = false;

   }
   if(this.showPic2 == true){
     this.showDelete2 = true;
   }
   else{
this.card2Activated = false;
   }
 

  
  }
  
  activateCard1(){

  this.showPic1 = true;
  this.card1Activated = true;
  this.doneEditing();

}
activateCard2(){
  this.showPic2 = true;
  this.card2Activated = true;
  this.doneEditing();
}

    doneEditing(){
  this.showDelete1 = false;
  this.showDelete2 = false;
  this.card1Activated = true;
  this.card2Activated = true;

  }
  removeCard1()
  {
    this.showCard1 = false;
    this.showPic1 = false;
    this.doneEditing();
    this.modifyingState = false;
  }



    removeCard2()
  {
    this.showCard2 = false;
    this.showPic2 = false;
    this.doneEditing();
    this.modifyingState = false;
  }

loadData() {

   let loader = this.loadingCtrl.create({
    content: ""
  });
  //Show the loading indicator
  loader.present();
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

      this.cards1 = result1;

    });
  }
});

firebase.database().ref(this.currentUser+'/Hats/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result1.indexOf(element);
if (index > -1) {
    result1.splice(index, 1);
}
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
   this.cards2 = result2;
});
  }
});
  firebase.database().ref(this.currentUser+'/Tops/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result2.indexOf(element);
if (index > -1) {
    result2.splice(index, 1);
}
}
});
this.cards3 = result3;
  var result3 = [];
//this.cards3 = [];

firebase.database().ref(this.currentUser+'/Bottoms/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result3.indexOf(element);
if (index > -1) {
    result3.splice(index, 1);
}
}
});
this.cards3 = result3;


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
                            loader.dismiss();

                  
    });
  }
  else{
               loader.dismiss();

  }
}); 
this.cards4 = result4;

firebase.database().ref(this.currentUser+'/Shoes/').on('child_removed', function(data) {
var element = data.val();
if(element){
var index = result4.indexOf(element);
if (index > -1) {
    result4.splice(index, 1);
}
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
    this.navCtrl.push(OutfitsPage);
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
    this.didSaveThisOutfit = true;
  }
  else if(this.didSaveThisOutfit == true){
var newChildRef = firebase.database().ref(firebase.auth().currentUser.uid+'/outfits/');
  newChildRef.remove(function(error) {


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
  



@Component({template: `
<ion-header>

  <ion-toolbar>
    <ion-title>
      Choose a photo
    </ion-title>
      <ion-buttons start>
    <button icon-only ion-button (click)="dismiss()">
        <ion-icon name="close" color="navcolor"> </ion-icon>
      </button>
    </ion-buttons>
     <ion-buttons end>
        <button ion-button color = "navcolor" icon-only (click)="addPics()">
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
 storageRef: any;
  currentImage
 currentUser: any;
 type: string;
 
 constructor( private params: NavParams,
    public viewCtrl: ViewController,public popoverCtrl: PopoverController,private ngZone: NgZone,private shareService: ShareService,@Inject(FirebaseApp) firebaseApp: any,) {
     this.storageRef = firebaseApp.storage().ref();

   // this.images = this.params.get('images');
  this.currentUser = this.params.get("user");
  this.images = this.params.get("images");
 for (let entry of this.images) {
    console.log(entry); // 1, "string", false
} 
  this.type = this.params.get("type");

}
 dismiss() {
   if(this.pickedImage){
   let data = { image:this.pickedImage };
      this.viewCtrl.dismiss(data);
   }
   else{
    this.viewCtrl.dismiss();  
   }
 }

  chooseImage(tapimage) {
    this.pickedImage = tapimage;
    
    this.dismiss();
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
  
 addPics()
{
var clothes = this.type;
  
  console.log(clothes);
var options =  {
          // if no title is passed, the plugin should use a sane default (preferrably the same as it was, so check the old one.. there are screenshots in the marketplace doc)
          maximumImagesCount: 10,
          title: 'Select photos',
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
}