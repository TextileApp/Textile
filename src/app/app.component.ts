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
      this.initPushNotification();

});
}
  initPushNotification() {

    const options: PushOptions = {
      android: {
        senderID: '307268348961'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
           
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  

  
    

hideSplashScreen() {
if (Splashscreen) {
setTimeout(() => {
Splashscreen.hide();
}, 100);
}
}
}