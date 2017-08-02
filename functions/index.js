const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var wrotedata;
/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
  const followerUid = event.params.followerUid;
  const followedUid = event.params.followedUid;
  // If un-follow we exit the function.
  if (!event.data.exists()) {
    return console.log('User ', followerUid, 'un-followed user', followedUid);
    
  }
  console.log('We have a new follower UID:', followerUid, 'for user:', followerUid);

  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`${followedUid}/notificationTokens`).once('value');
  const getUsernamePromise = admin.database().ref(`${followerUid}/username`).once('value');

  // Get the follower profile.
  const getFollowerProfilePromise = admin.auth().getUser(followerUid);

  return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise,getUsernamePromise]).then(results => {
    const tokensSnapshot = results[0];
    const follower = results[1];
    const username = results[2].val();
    
    // Check if there are any device tokens.
    if (!tokensSnapshot) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('Fetched follower profile', follower);

    // Notification details.
    const payload = {
      notification: {
        body: `${username} is now following you.`
      }
    };

    // Listing all tokens.
    const tokens = [tokensSnapshot.val()];
   

    // Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });
      return Promise.all(tokensToRemove);
    });
  });
});
exports.updateFeed = functions.database.ref('/userOutfits/{userId}/{outfitId}').onWrite(event => {

  const outfitId = event.params.outfitId;
  var user = event.params.userId;

  if(!event.data.val()){
    
      let followersRef = admin.database().ref('/following/'+user);
    //post was deleted
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let followerId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+outfitId).remove();
        console.log('Removed post from feed of user: '+ followerId);
      });
    });
  }else{
    //post was added
  
     let followersRef = admin.database().ref('/followers/'+user);
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let followerId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+outfitId).set(event.data.val());
        console.log('Added post to feed of user: '+ followerId);
      });
    });
  }
});
exports.updateFollowers = functions.database.ref('/following/{followerId}/{followedId}').onWrite(event => {

  const followerId = event.params.followerId;
  const followedId = event.params.followedId;


  if(!event.data.val()){
      // user was unfollowed
      let followersRef = admin.database().ref('/userOutfits/'+followedId);
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let outfitId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+outfitId).remove();
        console.log('Removed post from feed of user: '+ followerId);
      });
    });
  }else{
    //user was followed
     user = event.data.val().user;
     let followersRef = admin.database().ref('/userOutfits/'+followedId);
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let outfitId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+outfitId).set(event.data.val());
        console.log('Added post to feed of user: '+ followerId);
      });
    });
  }
});