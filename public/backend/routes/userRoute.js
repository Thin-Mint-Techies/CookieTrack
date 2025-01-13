const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 



router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Notifications
//router.post('/notification', userController.createNotification);
//router.get('/notifications', userController.getAllNotifications);


module.exports = router;
