const { Firestore } = require('../firebaseConfig');
const { sendEmail } = require('../utils/emailSender');

const emailAuth = {
  user: 'tao734509@gmail.com',
  pass: '73450911Hh',
};

// need rework
const createOrder = async ({ trooperName, trooperId, trooperNumber, ownerId, dateCreated, SU, paymentType, orderContent, pickupDetails }) => {
  try {
    const newOrderRef = Firestore.collection('orders').doc();
    await newOrderRef.set({
      trooperName,
      trooperId,
      trooperNumber,
      ownerId, // id of the parent of the trooper
      ownerEmail,
      buyerEmail,
      dateCreated: dateCreated || new Date().toISOString(),
      SU,
      paymentType: paymentType || {
        cash: 0,
        credit: 0,
      },
      orderContent: orderContent || [{
        cookies: [{
          variety: "",
          cases: 0,
          packages: 0,
        }],
        totalMoney: 0,
        owe: 0,
        totalPackages: 0,
        totalCases: 0,
      }],
      pickupDetails: pickupDetails || [{
        receivedBy: '',
        troopNumber: '',
      }, {
        receivedFrom: '',
        troopNumber: '',
      }],
    });

    // Send email to owner
    /*
    await sendEmail({
      to: ownerEmail,
      subject: 'Order Created',
      text: `An order has been created for trooper ${trooperName}.`,
    });

    // Send email to buyer
    await sendEmail({
      to: buyerEmail,
      subject: 'Order Created',
      text: `You have created an order for trooper ${trooperName}.`,
    });
    */
    
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
const updateOrder = async (id, { trooperName, trooperId, trooperNumber, ownerId, dateCreated, SU, paymentType, orderContent, pickupDetails }) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    await ref.update({
      trooperName,
      trooperId,
      trooperNumber,
      ownerId,
      dateCreated,
      SU,
      paymentType,
      orderContent,
      pickupDetails,
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
const getUserOrders = async (userId) => {
  try {
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const snapshot = await Firestore.collection('orders')
      .where('ownerId', '==', userId)
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
