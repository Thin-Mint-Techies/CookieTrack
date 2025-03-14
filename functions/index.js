const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
require('dotenv').config();
const axios = require('axios');

const cookieRoute = require('./routes/cookieRoute');
const documentRoute = require('./routes/documentRoute');
const trooperRoute = require('./routes/trooperRoute');
const userRoute = require('./routes/userRoute');
const rewardRoute = require('./routes/rewardRoute');
const orderRoute = require('./routes/orderRoute');
const firebaseConfig = require('./firebaseConfig');
const { sendEmail } = require('./utils/emailSender');
const { moveCompletedOrders, updateMonthlySales } = require('./utils/scheduler');




const app = express();
// parse JSON requests
app.use(express.json());


const allowedOrigins = [
  'http://localhost:5000',
  'https://your-frontend-domain.com'
];

app.use(cors({
  // Testing only
  origin: true

  // Production
  /*origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like mobile apps or Postman) or those in the list
      callback(null, true);
    } else {
      // Block other origins
      callback(new Error('Not allowed by CORS'));
    }
  } */

}));

// Use shared routes for all requests related to the troop, documents, etc.
app.use('/', userRoute);
app.use('/', trooperRoute);
app.use('/', cookieRoute);
app.use('/', documentRoute);
app.use('/', rewardRoute);
app.use('/', orderRoute);
//app.use('/api/auth', authRoutes);

// DEPLOYMENT ONLY
//exports.api = functions.https.onRequest(app);




/*FROM HERE IS LOCAL ONLY, USE FOR TESTING*/
const PORT = process.env.PORT || 5000;
const initializeFirebase = async () => {
  try {
    // Initialize Firebase 
    if (!admin.apps.length) {
      admin.initializeApp(firebaseConfig);
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


// Sheduled to move completed orders, run every week
// exports.scheduledMoveCompletedOrders = moveCompletedOrders;


// run locally: npx nodemon index.js
// deploy: firebase deploy --only functions