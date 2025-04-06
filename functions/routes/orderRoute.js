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
//requireLogin
router.put('/orderPayment/:id', orderController.updateOrderPaidAmount);
//requireLogin, checkRole(['leader']),
router.delete('/order/:id',  orderController.deleteOrder);

//requireLogin, 
router.get('/ordersTrooper/:id',orderController.getOrdersByTrooperId);
//requireLogin,
router.put('/orderComplete/:id',  orderController.markOrderComplete);

//router.get('/archiveOrder', orderController.archivedOrders);

// requireLogin, 
router.get('/ordersOwner/:id',orderController.getOrdersByOwnerId);
//requireLogin, 
router.put('/orderComplete/:id', orderController.markOrderComplete);
//requireLogin,
router.put('/orderPickup/:id',  orderController.parentPickup);
//requireLogin, checkRole(['leader']),
router.put('/archiveOrders',  orderController.archiveOrders);

//requireLogin, checkRole(['leader']),
router.put('/updateNeedToOrder/:orderId', orderController.updateNeedToOrder);

module.exports = router;
