import { Component } from '@angular/core';
import { Platform,AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  rootPage;
  

  constructor(platform: Platform, af: AngularFire,public push: Push, public alertCtrl: AlertController) {
    platform.ready().then(() => {
    const authObserver = af.auth.subscribe( user => {
  if (user) {
    this.rootPage = HomePage;
    authObserver.unsubscribe();
  } else {
    this.rootPage = LoginPage;
    authObserver.unsubscribe();
  }
});
     StatusBar.styleDefault();
    this.hideSplashScreen();
});
}

  

  
    

hideSplashScreen() {
if (Splashscreen) {
setTimeout(() => {
Splashscreen.hide();
}, 100);
}
}
}