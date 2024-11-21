const express = require('express');
const troopRoute = require('./routes/troopRoute.js');
const admin = require('firebase-admin');  // Firebase Admin SDK
const firebaseConfig = require('./config/firebaseConfig'); 
require('dotenv').config();
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  // UPDATE THIS TO MATCH THE FRONTEND
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use('/', troopRoute);

//Start the server, run using `npx nodemon server.js`
const initializeFirebase = async () => {
  try {
    // Firebase is initialized automatically via firebaseConfig
    console.log('Firebase initialized successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
};

initializeFirebase();