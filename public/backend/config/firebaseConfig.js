const { initializeApp, cert } = require('firebase-admin/app');
// this is for realtime database
const { getDatabase } = require('firebase-admin/database');
// firestore for more complex nested data
const { getFirestore } = require('firebase-admin/firestore');  
// auth provider
const { getAuth } = require('firebase-admin/auth');  
// firestore storage: allow upload of documents and images
const { getStorage } = require('firebase-admin/storage');  
const admin = require('firebase-admin');
require('dotenv').config();  


// get the data needed from the environment to run the app (data provided by Firebase)
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
  databaseURL: process.env.FIREBASE_DB_URL,
  //NEED TO FETCH THIS FROM FIREBASE
  //storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  
});

// realtimeDB
const db = admin.database(); 

// Firestore
// const db = getFirestore();  
// Firebase Authentication
const auth = admin.getAuth();  
// Firebase Storage
//const storage = admin.getStorage();  

module.exports = {db};
module.exports = {auth};
//module.exports = {storage};

