const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const firebaseConfig = require('./config/firebaseConfig'); 
const userRoute = require('./routes/userRoute');
const trooperRoute = require('./routes/trooperRoute');
const authRoute = require('./routes/authRoute');
const cookieRoute = require('./routes/cookieRoute');
const documentRoute = require('./routes/documentRoute');
const rewardRoute = require('./routes/rewardRoute');
const orderRoute = require('./routes/orderRoute');

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}
const app = express();

// parse JSON requests
app.use(express.json());

// Enable CORS for frontend, make sure this matches your frontend URL
app.use(cors({
  origin: ['https://cookietrack-hub.web.app', 'https://cookietrack-hub.firebaseapp.com', 'http://localhost:5173'], // Update this to match your frontend URL if needed
  credentials: true,
}));

// Use shared routes for all requests related to the troop, documents, etc.
app.use('/', userRoute);
app.use('/', trooperRoute);
app.use('/', authRoute);
app.use('/', cookieRoute);
app.use('/', documentRoute);
app.use('/', rewardRoute);
app.use('/', orderRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);