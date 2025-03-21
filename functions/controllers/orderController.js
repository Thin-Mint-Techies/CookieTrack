const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const orderId = await orderService.createOrder(req.body);
    console.log('Order created successfully:', { id: orderId });
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error('Failed to create order:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    console.log('Fetch all orders successfully', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch all orders', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await orderService.updateOrder(id, req.body);
    console.log('Update order successfully', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update order', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await orderService.deleteOrder(id);
    console.log('Delete order successfully', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete order', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await orderService.getUserOrders(id);
    console.log('getUserOrders successfully', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log('Failed to getUserOrders', error.message);
    res.status(500).json({ message: error.message });
  }
};

const markOrderComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await orderService.markOrderComplete(id, req.body);
    console.log('Order marked complete successfully:', result);
    res.status(200).json({ message: 'Order marked complete successfully', result });
  } catch (error) {
    console.error('Failed to mark order complete:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const archiveOrders = async (req, res) => {
  try {
    const result = await orderService.archiveOrders(req.body);
    console.log('Orders archived successfully:', result);
    res.status(200).json({ message: 'Orders archived successfully', result });
  } catch (error) {
    console.error('Failed to archive orders:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByTrooperId = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await orderService.getOrdersByTrooperId(id);
    console.log('getOrdersByTrooperId successfully', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log('Failed to getOrdersByTrooperId', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByParentId = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await orderService.getOrdersByParentId(id);
    console.log('getOrdersByParentId successfully', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log('Failed to getOrdersByParentId', error.message);
    res.status(500).json({ message: error.message });
  }
};

const parentPickup = async (req, res) => {
  const { id } = req.params;
  const { parentEmail } = req.body;
  try {
    const result = await orderService.parentPickup(id, parentEmail);
    console.log('Order marked as picked up successfully:', result);
    res.status(200).json({ message: 'Order marked as picked up successfully', result });
  } catch (error) {
    console.error('Failed to mark order as picked up:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserOrders,
  markOrderComplete,
  archiveOrders,
  getOrdersByTrooperId,
  getOrdersByParentId,
  parentPickup
};