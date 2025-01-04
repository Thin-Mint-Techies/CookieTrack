const { Firestore } = require('../config/firebaseConfig');

const createOrder = async ({ userId, name, description, price }) => {
  try {
    const newOrderRef = Firestore.collection('orders').doc();
    await newOrderRef.set({
      name,
      userId,
      description,
      totalAmount,
    });
    return newOrderRef.id;
  } catch (error) {
    throw new Error('Error creating Order');
  }
};

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

//have not tested
// this function check for login first
const getUserOrders = async (userId) => {
  try {
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const snapshot = await Firestore.collection('orders')
      .where('userId', '==', userId)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No orders found');
  } catch (error) {
    throw new Error('Error fetching orders: ' + error.message);
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserOrders,
};
