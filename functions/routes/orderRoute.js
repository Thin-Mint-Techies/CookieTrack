const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


//requireLogin,
router.post('/order',  orderController.createOrder);

//requireLogin, checkRole(['leader']),
router.get('/order',  orderController.getAllOrders);
//requireLogin, 
router.put('/order/:id', orderController.updateOrder);
//requireLogin, checkRole(['leader']),
router.delete('/order/:id',  orderController.deleteOrder);

//requireLogin,
router.get('/ordersUser/:id',  orderController.getUserOrders);
//requireLogin, 
router.get('/ordersTrooper/:id',orderController.getOrdersByTrooperId);
//requireLogin,
router.put('/orderComplete/:id',  orderController.markOrderComplete);

//router.get('/archiveOrder', orderController.archivedOrders);

// requireLogin, 
router.get('/ordersParent/:id',orderController.getOrdersByParentId);
//requireLogin, 
router.put('/orderComplete/:id', orderController.markOrderComplete);
//requireLogin,
router.put('/orderPickup/:id',  orderController.parentPickup);
//requireLogin, checkRole(['leader']),
router.put('/archiveOrders',  orderController.archiveOrders);


module.exports = router;
