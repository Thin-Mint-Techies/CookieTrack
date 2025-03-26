const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


//requireLogin, 
router.post('/parentInventory', inventoryController.createParentInventory);

//requireLogin, checkRole(['leader']),
router.post('/leaderInventory',  inventoryController.createLeaderInventory);

router.post('/trooperInventory',  inventoryController.createTrooperInventory);

// requireLogin,
router.put('/parentInventory/:id',inventoryController.updateParentInventory);

// requireLogin, checkRole(['leader']), 
router.put('/leaderInventory',inventoryController.updateLeaderInventory);

//requireLogin,
router.put('/trooperInventory/:id',  inventoryController.updateTrooperInventory);

//requireLogin, 
router.put('/trooperCookie/:trooperId', inventoryController.updateTrooperCookie);

//requireLogin, checkRole(['leader']),
router.get('/inventories',  inventoryController.getAllInventories);

router.get('/leaderInventory',  inventoryController.getLeaderInventory);

//requireLogin,
router.get('/inventory/:id',  inventoryController.getInventoryByOwnerId);

// requireLogin, checkRole(['leader']),
router.delete('/inventory/:id', inventoryController.deleteInventory);

module.exports = router;