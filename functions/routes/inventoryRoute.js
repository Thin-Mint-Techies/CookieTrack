const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();


router.post('/parentInventory', inventoryController.createParentInventory);
router.put('/parentInventory/:id', inventoryController.updateParentInventory);
router.post('/leaderInventory', inventoryController.createLeaderInventory);
router.put('/leaderInventory/:id', inventoryController.updateLeaderInventory);
router.get('/inventory', inventoryController.getAllInventories);
router.delete('/inventory/:id', inventoryController.deleteInventory);


module.exports = router;
