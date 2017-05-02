import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { OutfitsPage } from '../pages/outfits/outfits';
import { ContactPage } from '../pages/contact/contact';
import { closetMenuPage } from '../pages/closetMenu/closetMenu';
import { brandsPage } from '../pages/brands/brands';
import { PopoverContentPage } from '../pages/contact/popover';
import { HomePage,imagePicker } from '../pages/home/home';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';
import { AuthService } from '../providers/auth-service';
import * as firebase from 'firebase';
import { ShareService } from '../providers/ShareService';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { SwingModule } from 'angular2-swing';
import { ImageCropperComponent } from'../pages/cropper/img-cropper';

export const firebaseConfig = {
    apiKey: "AIzaSyCbJvS86BwyrrfTy3lwJ71tt0zkoTz6wRU",
    authDomain: "streetwear-3906e.firebaseapp.com",
    databaseURL: "https://streetwear-3906e.firebaseio.com",
    storageBucket: "streetwear-3906e.appspot.com",
    messagingSenderId: "307268348961"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '3a4b03cd'
  }
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    OutfitsPage,
    ContactPage,
    HomePage,
    LoginPage,
    RegisterPage,
    ResetpwdPage,
    imagePicker,
    closetMenuPage,
    brandsPage,
    ImageCropperComponent,
    PopoverContentPage
    
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
     
    }, {}
  ),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
     SwingModule,CloudModule.forRoot(cloudSettings)
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OutfitsPage,
    ContactPage,
    HomePage,
    imagePicker,
    closetMenuPage,
    brandsPage,
    LoginPage,
    RegisterPage,
    ResetpwdPage,
    ImageCropperComponent,
    PopoverContentPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,ShareService
  ],
})
export class AppModule {}
