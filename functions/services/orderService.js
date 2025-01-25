const { Firestore } = require('../firebaseConfig');

const createOrder = async ({ buyer,trooperSeller, descriptions, totalPayment ,amountOfCookies }) => {
  try {
    const newOrderRef = Firestore.collection('orders').doc();
    await newOrderRef.set({
      buyer,
      trooperSeller,
      descriptions, // address, delivery, etc...
      totalPayment,
      amountOfCookies,
    });
    return newOrderRef.id;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
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
    throw new Error(`Error fetching Orders: ${error.message}`);
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
    throw new Error(`Error deleting Order: ${error.message}`);
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
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserOrders,
};
