import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;
  

  constructor(platform: Platform, af: AngularFire) {
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
      Splashscreen.hide();
    });
  }
}
