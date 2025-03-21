const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');



router.post('/user', userController.createUser);

//requireLogin, 
router.get('/user',  userController.getAllUser);

//requireLogin,
router.get('/user/:id', userController.getUserById);

//requireLogin,
router.put('/user/:id',  userController.updateUser);

// requireLogin, checkRole(['leader']),
router.delete('/user/:id', userController.deleteUser);

router.post('/attachRoleAsCustomClaim/:id', userController.attachRoleAsCustomClaim);

router.get('/getRole/:id', userController.getRole);



// Notifications
//router.post('/notification', userController.createNotification);
//router.get('/notifications', userController.getAllNotifications);


module.exports = router;