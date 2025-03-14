const express = require('express');
const router = express.Router();
const trooperController = require('../controllers/trooperController');
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');



// CRUD for Troops
    // Trying to set up nested auth and access right
router.post('/trooper', requireLogin, trooperController.createTrooper);
//router.post('/trooper2', 
    //requireLogin,
    //checkRole,
    //trooperController.createTroop2Controller);
router.get('/troopers', requireLogin, checkRole(['leader']), trooperController.getAllTroopers);

/*
router.get('/trooper/:id',
    requireLogin, 
    checkRole(['parent']),
    checkUserOwnership('troopers'), 
    trooperController.getTrooperById);
*/

router.get('/troopers/:id',requireLogin,  trooperController.getTrooperById);
router.put('/trooper/:id',requireLogin,  trooperController.updateTrooper);
router.delete('/trooper/:id', requireLogin, trooperController.deleteTrooper);
router.get('/troopersOwnerId/:ownerId',requireLogin,  trooperController.getAllTroopersByOwnerId);


module.exports = router;