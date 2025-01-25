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



exports.api = functions.https.onRequest(app);


