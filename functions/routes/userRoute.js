const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 



router.post('/user', userController.createUser);
router.get('/user', userController.getAllUser);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

// Notifications
//router.post('/notification', userController.createNotification);
//router.get('/notifications', userController.getAllNotifications);


module.exports = router;
