const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');  // Realtime Database
const { getFirestore } = require('firebase-admin/firestore');  // Firestore
const { getAuth } = require('firebase-admin/auth');  // Firebase Authentication
const { getStorage } = require('firebase-admin/storage');  // Firebase Storage
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with credentials from environment variables
initializeApp({
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
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,  
});

const db = getDatabase(); 
const Firestore = getFirestore();
const auth = getAuth();
const storage = getStorage();  

module.exports = {
  db,
  Firestore,
  auth,
  storage
};
