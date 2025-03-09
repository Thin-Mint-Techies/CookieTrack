const express = require('express');
const router = express.Router();
const trooperController = require('../controllers/trooperController');
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');



// CRUD for Troops
    // Trying to set up nested auth and access right
router.post('/trooper', trooperController.createTrooper);
//router.post('/trooper2', 
    //requireLogin,
    //checkRole,
    //trooperController.createTroop2Controller);
router.get('/troopers', trooperController.getAllTroopers);


router.get('/trooper/:id',
    requireLogin, 
    checkRole(['parent']),
    checkUserOwnership('troopers'), 
    trooperController.getTrooperById);


router.put('/trooper/:id', trooperController.updateTrooper);
router.delete('/trooper/:id', trooperController.deleteTrooper);
router.delete('/troopers', trooperController.deleteAllTroopers);


module.exports = router;