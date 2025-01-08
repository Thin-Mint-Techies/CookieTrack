const express = require('express');
const router = express.Router();
const trooperController = require('../controllers/trooperController');
const { requireLogin, checkRole } = require('../utils/roleCheck');



// CRUD for Troops
router.post('/troop', trooperController.createTroop);
router.post('/troop2', 
    //requireLogin,
    //checkRole,
    trooperController.createTroop2Controller);
router.get('/troops', trooperController.getAllTroops);
router.get('/troop/:id', trooperController.getTroopById);
router.put('/troop/:id', trooperController.updateTroop);
router.delete('/troop/:id', trooperController.deleteTroop);
router.delete('/troops', trooperController.deleteAllTroops);


module.exports = router;
