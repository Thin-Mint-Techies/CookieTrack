const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const cookieRoute = require('./routes/cookieRoute');
const documentRoute = require('./routes/documentRoute');
const trooperRoute = require('./routes/trooperRoute');
const userRoute = require('./routes/userRoute');
const rewardRoute = require('./routes/rewardRoute');
const orderRoute  = require('./routes/orderRoute');
//const updateMonthlySales = require('./utils/updateSchedule');

const firebaseConfig = require('./config/firebaseConfig'); 
const admin = require('firebase-admin');  


const app = express();
const PORT = process.env.PORT || 5000;

// parse JSON requests
app.use(express.json());

// Enable CORS for frontend, make sure this matches your frontend URL
app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend URL if needed
  credentials: true,
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


/* Need to do these step before setting up monthly update
login into firebase CLI: firebase login
firebase init functions
deploy the function: firebase deploy --only functions
*/

/*
exports.scheduledMonthlySalesUpdate = functions.pubsub
    .schedule('0 0 1 * *') // At midnight on the 1st of each month
    .timeZone('America/Los_Angeles') // Adjust as per your timezone
    .onRun(async () => {
        console.log('Running monthly sales update...');
        await updateMonthlySales(); // Call your utility function
        console.log('Monthly sales update completed');
        return null;
    });
*/



//RUN: npx nodemon server.js
