const { Firestore } = require('../config/firebaseConfig');

// Service to create a new Order
const createOrder = async ({ name, description, price }) => {
  try {
    const newOrderRef = Firestore.collection('orders').doc();
    await newOrderRef.set({
      name,
      description
    });
    return newOrderRef.id;
  } catch (error) {
    throw new Error('Error creating Order');
  }
};

// Service to get all Orders
const getAllOrders = async () => {
  try {
    const snapshot = await Firestore.collection('orders').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No Orders found');
  } catch (error) {
    throw new Error('Error fetching Orders');
  }
};

// Service to update a Order by ID
const updateOrder = async (id, { name, description, price }) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    await ref.update({
      name,
      description,
    });
    return { message: 'Order updated successfully' };
  } catch (error) {
    throw new Error('Error updating Order');
  }
};

// Service to delete a Order by ID
const deleteOrder = async (id) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    await ref.delete();
    return { message: 'Order deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting Order');
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
