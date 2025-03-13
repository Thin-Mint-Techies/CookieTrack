const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();


router.post('/order', orderController.createOrder);
router.get('/order', orderController.getAllOrder);
router.put('/order/:id', orderController.updateOrder);
router.delete('/order/:id', orderController.deleteOrder);
router.get('/userOrder', orderController.getUserOrders);
router.get('/completeOrder', orderController.markOrderComplete);
router.get('/archiveOrder', orderController.archivedOrders);




module.exports = router;
