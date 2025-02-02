const express = require('express');
const router = express.Router();
const trooperController = require('../controllers/trooperController');
const { requireLogin, checkRole } = require('../utils/roleCheck');



// CRUD for Troops
    // Trying to set up nested auth and access right
router.post('/trooper', trooperController.createTrooper);
//router.post('/trooper2', 
    //requireLogin,
    //checkRole,
    //trooperController.createTroop2Controller);
router.get('/troopers',checkRole('parent'), trooperController.getAllTroopers);
router.get('/trooper/:id', trooperController.getTrooperById);
router.put('/trooper/:id', trooperController.updateTrooper);
router.delete('/trooper/:id', trooperController.deleteTrooper);
router.delete('/troopers', trooperController.deleteAllTroopers);


module.exports = router;