/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');  
const functions = require('firebase-functions');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const cookieRoute = require('./routes/cookieRoute');
const documentRoute = require('./routes/documentRoute');
const trooperRoute = require('./routes/trooperRoute');
const userRoute = require('./routes/userRoute');
const rewardRoute = require('./routes/rewardRoute');
const orderRoute  = require('./routes/orderRoute');
const firebaseConfig = require('./firebaseConfig'); 



const app = express();
// parse JSON requests
app.use(express.json());

/*CORS might need to be update to this, have not test
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000', // Localhost for development
  'https://your-frontend-domain.com' // Your frontend production domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like mobile apps or Postman) or those in the list
      callback(null, true);
    } else {
      // Block other origins
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

*/

app.use(cors({
  origin: true
}));

// Use shared routes for all requests related to the troop, documents, etc.
app.use('/', userRoute);
app.use('/', trooperRoute);
app.use('/', authRoute);
app.use('/', cookieRoute);
app.use('/', documentRoute);
app.use('/', rewardRoute);
app.use('/',orderRoute);
//app.use('/api/auth', authRoutes);

// DEPLOYMENT ONLY
//exports.api = functions.https.onRequest(app);


// LOCAL ONLY

const PORT = process.env.PORT || 5000;
const initializeFirebase = async () => {
  try {
    // Initialize Firebase (ensure your Firebase config is correct)
    if (!admin.apps.length) {
      admin.initializeApp(firebaseConfig); // Firebase configuration should be set up correctly
    }
    console.log('Firebase initialized successfully!');

    // Start the Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    process.exit(1); // Exit if Firebase initialization fails
  }
};
initializeFirebase();



// run locally: npx nodemon index.js
// deploy: firebase deploy --only functions