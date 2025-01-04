const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();


// CRUD for orders
router.post('/order', orderController.createOrder);
router.get('/order', orderController.getAllOrder);
router.put('/order/:id', orderController.updateOrder);
router.delete('/order/:id', orderController.deleteOrder);
router.get('/userOrder', orderController.getUserOrders);

module.exports = router;
