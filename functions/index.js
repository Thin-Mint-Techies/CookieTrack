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


  // CREATE A CUSTOM TOKEN FOR TESTING PURPOSES
  /** 
  const uid = 'DDy2oZjpTUSVBLIVAPE7XnwBxJ52'; // Replace with the UID of the user you want to authenticate
  const uidAuthTest = 'w1BExPKXsLPn9VBXxLp9XSaFg6a2';
  const customToken = await admin.auth().createCustomToken(uidAuthTest);
  // Exchange the custom token for an ID token
  const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.COOKIETRACK_FIREBASE_API_KEY}`, {
    token: customToken,
    returnSecureToken: true
  });
  console.log('Bearer Token:', response.data.idToken);
  */

  /* SENDING EMAILS USING A TEMPLATE, FOR NOTICATION
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'bchau1010@gmail.com', // Change to your recipient
    from: 'thinminttechies@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    templateId: 'd-6c004f0cbb694488add70968a428b647',
    dynamicTemplateData: {
      name: 'John',
      orderNumber: '123456',
      // Add more dynamic data as needed
    },
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  */
};
initializeFirebase();





// run locally: npx nodemon index.js
// deploy: firebase deploy --only functions