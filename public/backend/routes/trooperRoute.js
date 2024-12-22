const express = require('express');
const trooperController = require('../controllers/trooperController');
const router = express.Router();


// CRUD for Troops
router.post('/troop', trooperController.createTroop);
router.get('/troops', trooperController.getAllTroops);
router.get('/troop/:id', trooperController.getTroopById);
router.put('/troop/:id', trooperController.updateTroop);
router.delete('/troop/:id', trooperController.deleteTroop);
router.delete('/troops', trooperController.deleteAllTroops);


module.exports = router;
