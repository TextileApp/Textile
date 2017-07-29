const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var wrotedata;
exports.Pushtrigger = functions.database.ref('/messages/{messageId}').onWrite((event) => {
    wrotedata = event.data.val();

    admin.database().ref('/pushtokens').orderByChild('uid').once('value').then((alltokens) => {
        var rawtokens = alltokens.val();
        var tokens = [];
        processtokens(rawtokens).then((processedtokens) => {
            
            for (var token of processedtokens) {
                tokens.push(token.devtoken);
            }
        
        var payload = {
            
                "notification":{
                    "title":"From" + wrotedata.sendername,
                    "body":"Msg" + wrotedata.message,
                    "sound":"default",
                    },
                "data":{
                    "sendername":wrotedata.sendername,
                    "message":wrotedata.message
                }
        }      
            return admin.messaging().sendToDevice(tokens, payload).then((response) => {
                console.log('Pushed notifications');
            }).catch((err) => {
                console.log(err);
            })
        })    
    })
})

function processtokens(rawtokens) {
    var promise = new Promise((resolve, reject) => {
         var processedtokens = []
    for (var token in rawtokens) {
        processedtokens.push(rawtokens[token]);
    }
    resolve(processedtokens);
    })
    return promise;    
    
}