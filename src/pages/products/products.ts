import { Component, Inject, NgZone} from '@angular/core';
import { Camera } from 'ionic-native';
import { PhotoViewer } from 'ionic-native';
import { NavController,PopoverController,ActionSheetController,ModalController,NavParams } from 'ionic-angular';
import { FirebaseApp,FirebaseListObservable,AngularFire } from 'angularfire2';
import * as firebase from 'firebase';
import { PopoverContentPage } from './popover';
import { AuthService } from '../../providers/auth-service';
import {ShareService} from '../../providers/ShareService';
import { Events } from 'ionic-angular';
import { ImageCropperComponent } from "../cropper/img-cropper";
const ShopStyle = require('shopstyle-sdk');
const shopstyle = new ShopStyle('uid8976-38160824-19');


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  
  
})


export class productsPage {
  

    pet: string = "Hats";
  assetCollection: any;
isEnabled: boolean;
noProducts: boolean;
isDeleteEnabled: boolean;
    selectedItem: any;
  icons: string[];
 items1: FirebaseListObservable<any>;
 selectedItems:Array<any>;
	options: any;
  db: any;
  uploadType: number = 0;
  public currentUser: any;
  public photoRef:any;
  storageRef: any;
  brand: any;
  brandID: any;
  whichType:any;
  internalType:string;
  currentImage
  grid: Array<Array<string>>;
af: AngularFire;



  constructor(public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private params: NavParams,public navCtrl: NavController,@Inject(FirebaseApp) firebaseApp: any,public events: Events,private ngZone: NgZone,public popoverCtrl: PopoverController,af: AngularFire,private _auth: AuthService,private shareService: ShareService
 ) {
  this.isEnabled = false;
    const authObserver = af.auth.subscribe( user => {
        if (user) {
    this.noProducts = false;
    this.whichType = this.params.get("type");
    console.log(this.whichType);
    this.brand = this.params.get("brand");
    console.log(this.brand);
 this.items1 = af.database.list('Database/'+this.whichType+'/'+this.brand);


 
        } 
});

     //this.grid = Array(Math.ceil(this.items.length/2));

     console.log("FUCK EM ALL");

      

    }
saveToCloset()
{
  
this.navCtrl.popToRoot();
  }
  selectPiece(item){
  if(item.selected != null)
  {
if(item.selected == true)
{
item.selected = false;
}
else if(item.selected == false)
{
item.selected = true;
}

  }
  else
  {
   item.selected = true;
  }

}





 






}