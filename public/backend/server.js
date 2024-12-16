const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sharedRoute = require('./routes/sharedRoute'); // Shared routes for all roles
const authRoutes = require('./routes/authRoute');
const firebaseConfig = require('./config/firebaseConfig'); // Firebase config for initialization


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
app.use('/', sharedRoute);
app.use('/api/users', authRoutes);
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
//RUN: npx nodemon server.js
