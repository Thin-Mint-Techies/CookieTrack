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
const inventoryRoute = require('./routes/inventoryRoute');
const saleDataRoute = require('./routes/saleDataRoute');
const firebaseConfig = require('./firebaseConfig');
const { sendEmail } = require('./utils/emailSender');
const { moveCompletedOrders, updateMonthlySales } = require('./utils/scheduler');




const app = express();
app.use(express.json());


const allowedOrigins = [
  'https://cookietrack-hub.web.app' ,
  'https://cookietrack-hub.firebaseapp.com'
];

app.use(cors({
  // Testing only
  //origin: true

  // Production
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


// Rate-limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Use shared routes for all requests related to the troop, documents, etc.
app.use('/', userRoute);
app.use('/', trooperRoute);
app.use('/', cookieRoute);
app.use('/', documentRoute);
app.use('/', rewardRoute);
app.use('/', orderRoute);
app.use('/', inventoryRoute);
app.use('/', saleDataRoute);
//app.use('/api/auth', authRoutes);

// DEPLOYMENT ONLY
//exports.api = functions.https.onRequest(app);




/*FROM HERE IS LOCAL ONLY, USE FOR TESTING*/
/*
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
*/

// Sheduled to move completed orders, run every week
// exports.scheduledMoveCompletedOrders = moveCompletedOrders;


// run locally: npx nodemon index.js
// deploy: firebase deploy --only functions