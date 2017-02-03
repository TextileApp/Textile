import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage,imagePicker } from '../pages/home/home';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';
import { AuthService } from '../providers/auth-service';
import * as firebase from 'firebase';

import { SwingModule } from 'angular2-swing';
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

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    RegisterPage,
    ResetpwdPage,
    imagePicker,
    
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
     
    }, {}
  ),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
     SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    imagePicker,
    LoginPage,
    RegisterPage,
    ResetpwdPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
