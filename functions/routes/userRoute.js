const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');



router.post('/user', userController.createUser);
router.get('/user',   userController.getAllUser);
router.get('/user/:id',requireLogin, userController.getUserById);
router.put('/user/:id', requireLogin, userController.updateUser);
router.delete('/user/:id', requireLogin, checkRole(['leader']), userController.deleteUser);
router.post('/attachRoleAsCustomClaim/:id', userController.attachRoleAsCustomClaim);
router.get('/getRole/:id', userController.getRole);



// Notifications
//router.post('/notification', userController.createNotification);
//router.get('/notifications', userController.getAllNotifications);


module.exports = router;