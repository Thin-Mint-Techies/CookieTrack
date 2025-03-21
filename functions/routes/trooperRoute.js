const express = require('express');
const router = express.Router();
const trooperController = require('../controllers/trooperController');
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');




//requireLogin,
router.post('/trooper',  trooperController.createTrooper);

// requireLogin, checkRole(['leader']), 
router.get('/troopers',trooperController.getAllTroopers);

/*
router.get('/trooper/:id',
    requireLogin, 
    checkRole(['parent']),
    checkUserOwnership('troopers'), 
    trooperController.getTrooperById);
*/

//requireLogin,
router.get('/troopers/:id',  trooperController.getTrooperById);

//requireLogin,
router.put('/trooper/:id',  trooperController.updateTrooper);

//requireLogin, 
router.delete('/trooper/:id', trooperController.deleteTrooper);

//requireLogin,
router.get('/troopersOwnerId/:id',  trooperController.getAllTroopersByOwnerId);


module.exports = router;