const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const cookieRoute = require('./routes/cookieRoute');
const documentRoute = require('./routes/documentRoute');
const trooperRoute = require('./routes/trooperRoute');
const userRoute = require('./routes/userRoute');
const rewardRoute = require('./routes/rewardRoute');
const updateMonthlySales = require('./utils/updateMonthlySales');

const firebaseConfig = require('./config/firebaseConfig'); // Firebase config for initialization
const functions = require('firebase-functions');
const admin = require('firebase-admin');  // Firebase Admin SDK (Ensure you have set up Firebase Admin SDK correctly)


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for frontend, make sure this matches your frontend URL
app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend URL if needed
  credentials: true,
}));

// Use shared routes for all requests related to the troop, documents, etc.
app.use('/user', userRoute);
app.use('/user', trooperRoute);
app.use('/user', authRoute);
app.use('/', cookieRoute);
app.use('/user', documentRoute);
app.use('/', rewardRoute);




//app.use('/api/auth', authRoutes);

exports.scheduledUpdateMonthlySales = functions.pubsub
  .schedule('0 0 1 * *') // Runs at midnight on the 1st of every month
  .timeZone('UTC') // Adjust time zone as needed
  .onRun(async () => {
    await updateMonthlySales();
  });


// Initialize Firebase and start the server
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

// Call the Firebase initialization function
initializeFirebase();
//RUN: npx nodemon server.js
