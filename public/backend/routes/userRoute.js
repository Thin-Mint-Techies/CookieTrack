const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 

// user routes for all roles



// Login/Register/Auth
//router.post('/login', userController.login);
//router.post('/register', userController.register);

// CRUD for Documents
//router.post('/document', upload.single('file'), userController.uploadDocument);
//router.get('/documents', userController.getAllDocuments);
//router.get('/document/:id', userController.getDocumentById);
//router.put('/document/:id', userController.updateDocument);
//router.delete('/document/:id', userController.deleteDocument);

// CRUD for Troops
router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
//router.delete('/users', userController.deleteAllTroops);

// CRUD for Rewards
//router.post('/reward', userController.createReward);
//router.get('/rewards', userController.getAllRewards);
//router.get('/reward/:id', userController.getRewardById);
//router.put('/reward/:id', userController.updateReward);
//router.delete('/reward/:id', userController.deleteReward);

// CRUD for Sale Data
//router.post('/sale', userController.createSaleData);
//router.get('/sales', userController.getAllSales);
//router.get('/sale/:id', userController.getSaleDataById);
//router.put('/sale/:id', userController.updateSaleData);
//router.delete('/sale/:id', userController.deleteSaleData);

// Notifications
//router.post('/notification', userController.createNotification);
//router.get('/notifications', userController.getAllNotifications);

// Cookie Suggestions (Pulling from Sale Data)
//router.get('/suggest-cookie', userController.suggestCookie);

module.exports = router;
