const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


router.post('/order', requireLogin, orderController.createOrder);
router.get('/order', requireLogin, checkRole(['leader']), orderController.getAllOrder);
router.put('/order/:id', requireLogin, orderController.updateOrder);
router.delete('/order/:id', requireLogin, checkRole(['leader']), orderController.deleteOrder);

router.get('/ordersUser/:id', requireLogin, orderController.getUserOrders);
router.get('/ordersTrooper/:id',requireLogin, orderController.getOrdersByTrooperId);
router.put('/orderComplete/:id', requireLogin, orderController.markOrderComplete);

//router.get('/archiveOrder', orderController.archivedOrders);




module.exports = router;
