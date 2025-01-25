const express = require('express');
const { registerController, loginController, googleLogin } = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../services/authService');

const router = express.Router();

/*
NOT USE 
*/


// Public routes
router.post('/register', registerController); 
router.post('/google-login', googleLogin); 
router.post('/login', loginController);

// Protected route example
/*
router.get('/protected', authenticateToken, authorizeRole('leader'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Manager!' });
});
*/

module.exports = router;
