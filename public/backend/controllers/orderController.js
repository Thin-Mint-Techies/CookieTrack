const orderService = require('../services/orderService');
/*START OF Order CONTROLLER*/

// Controller for creating a new Order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.uid; // Get user ID from Firebase Auth token
    const { name,description,totalAmount } = req.body;
    const orderId = await createOrder({ userId,name,description,totalAmount });
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all Orders
const getAllOrder = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller for updating a Order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await orderService.updateOrder(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a Order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await orderService.deleteOrder(id);
    res.status(200).json(result);
  } catch (error) {
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

//have not tested
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
