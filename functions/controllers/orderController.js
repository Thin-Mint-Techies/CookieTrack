const orderService = require('../services/orderService');



const createOrder = async (req, res) => {
  try {
    const orderId = await createOrder(req.body);
    console.log('Order created successfully:', { id: orderId });
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error('Failed to create order:', error.message);
    res.status(500).json({ message: error.message });
  }
};


const getAllOrder = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    console.log("Fetch all orders successfully", orders);
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
    console.log("Update order successfully", result);
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
    console.log("Delete order successfully", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete order', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting all Orders
/*
const deleteAllOrder = async (req, res) => {
  try {
    const result = await OrderService.deleteAllOrder();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
const markOrderComplete = async (req, res) => {
  const {id} = req.params;
  try {
    const orderId = await markOrderComplete(id, req.body);
    console.log('Order mark complete successfully:', { id: orderId });
    res.status(201).json({ message: 'Order mark complete successfully', orderId });
  } catch (error) {
    console.error('Failed to mark order complete:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const archivedOrders = async (req, res) => {
  try {
    const orderId = await createOrder(req.body);
    console.log('Order achived successfully:', { id: orderId });
    res.status(201).json({ message: 'Order archived successfully', orderId });
  } catch (error) {
    console.error('Failed to create order:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  const {id} = req.params;
  try {
    const orders = await getUserOrders(id);
    console.log("getUserOrders successfully", result);
    res.status(200).json({ orders });
  } catch (error) {
    console.log("Failed to getUserOrders", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByTrooperId= async (req, res) => {
  const {id} = req.params;
  try {
    const orders = await getOrdersByTrooperId(id);
    console.log("getOrdersByTrooperId successfully", result);
    res.status(200).json({ orders });
  } catch (error) {
    console.log("Failed to getOrdersByTrooperId", error.message);
    res.status(500).json({ message: error.message });
  }
};






module.exports = {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  
  getUserOrders,
  markOrderComplete,
  getOrdersByTrooperId
};
