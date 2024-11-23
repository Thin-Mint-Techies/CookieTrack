const express = require('express');
const sharedController = require('../controllers/sharedController');
const router = express.Router();

// Shared routes for all roles

// Login/Register/Auth
//router.post('/login', sharedController.login);
//router.post('/register', sharedController.register);

// CRUD for Documents
//router.post('/document', sharedController.createDocument);
//router.get('/documents', sharedController.getAllDocuments);
//router.get('/document/:id', sharedController.getDocumentById);
//router.put('/document/:id', sharedController.updateDocument);
//router.delete('/document/:id', sharedController.deleteDocument);

// CRUD for Troops
router.post('/troop', sharedController.createTroop);
router.get('/troops', sharedController.getAllTroops);
router.get('/troop/:id', sharedController.getTroopById);
router.put('/troop/:id', sharedController.updateTroop);
router.delete('/troop/:id', sharedController.deleteTroop);
router.delete('/troops', sharedController.deleteAllTroops);

// CRUD for Rewards
//router.post('/reward', sharedController.createReward);
//router.get('/rewards', sharedController.getAllRewards);
//router.get('/reward/:id', sharedController.getRewardById);
//router.put('/reward/:id', sharedController.updateReward);
//router.delete('/reward/:id', sharedController.deleteReward);

// CRUD for Sale Data
//router.post('/sale', sharedController.createSaleData);
//router.get('/sales', sharedController.getAllSales);
//router.get('/sale/:id', sharedController.getSaleDataById);
//router.put('/sale/:id', sharedController.updateSaleData);
//router.delete('/sale/:id', sharedController.deleteSaleData);

// Notifications
//router.post('/notification', sharedController.createNotification);
//router.get('/notifications', sharedController.getAllNotifications);

// Cookie Suggestions (Pulling from Sale Data)
//router.get('/suggest-cookie', sharedController.suggestCookie);

module.exports = router;
