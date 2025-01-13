const orderService = require('../services/orderService');
/*START OF Order CONTROLLER*/


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

//need more testing, need to go through roleCheck.js first
const getUserOrders = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: Missing ID token' });
  }

  try {
    const orders = await getUserOrders(userId);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  getUserOrders
};
