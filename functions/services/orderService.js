const { Firestore } = require('../firebaseConfig');
const { sendEmail } = require('../utils/emailSender');
const { orderDataFormat } = require('../dataFormat');
const {completedOrderDataFormat} = require('../dataFormat');


const createOrder = async ({ trooperName, trooperId, ownerId, ownerEmail, buyerEmail, parentName, contact, financialAgreement, orderContent, paymentType }) => {
  try {
    const newOrderRef = Firestore.collection('orders').doc();
    const newOrderData = {
      ...orderDataFormat,
      dateCreated: new Date().toISOString(),
      trooperId,
      trooperName,
      ownerId,
      ownerEmail,
      buyerEmail,
      parentName,
      contact,
      financialAgreement,
      orderContent,
      paymentType,
    };
    await newOrderRef.set(newOrderData);

    // Send email to owner
    /* 
    await sendEmail({
      to: ownerEmail,
      subject: 'Order Created',
      text: `Order ${newOrderRef.id} has been created for trooper ${trooperName}.`,
    });

    // Send email to buyer
    await sendEmail({
      to: parentEmail,
      subject: 'Order Created',
      text: `Order ${newOrderRef.id} placed for trooper ${trooperName}.`,
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

const updateOrder = async (id, { trooperName, trooperId, ownerId, ownerEmail, buyerEmail, parentName, contact, orderContent, paymentType }) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    const updatedOrderData = {
      trooperName,
      trooperId,
      ownerId,
      ownerEmail,
      buyerEmail,
      parentName,
      contact,
      orderContent,
      paymentType,
    };
    await ref.update(updatedOrderData);
    // Send email to owner
    /* 
    await sendEmail({
      to: ownerEmail,
      subject: 'Order Created',
      text: `Order ${ref.id} has been updated.`,
    });

    // Send email to buyer
    await sendEmail({
      to: parentEmail,
      subject: 'Order Created',
      text: `Order ${ref.id} has been updated.`,
    });
    */

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

const markOrderComplete = async (id, {pickupDetails}) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    const orderSnapshot = await ref.get();

    if (!orderSnapshot.exists) {
      throw new Error('Order not found');
    }

    const orderData = orderSnapshot.data();
    const completedOrderData = {
      ...orderData,
      pickupDetails,
      dateCompleted: new Date().toISOString(),
    };

    // Update order with dateCompleted
    await ref.update(completedOrderData);

    // Send email to owner
    await sendEmail({
      to: orderData.ownerEmail,
      subject: 'Order Completed',
      text: `Order ${id} has been completed for trooper ${orderData.trooperName}.`,
    });

    // Send email to buyer
    await sendEmail({
      to: orderData.buyerEmail,
      subject: 'Order Completed',
      text: `Order ${id} has been completed for trooper ${orderData.trooperName}.`,
    });

    return { message: 'Order marked as completed successfully' };
  } catch (error) {
    throw new Error(`Error marking Order as completed: ${error.message}`);
  }
};

// have not test, need a cron job using firebase functions
const archiveOrders = async () => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const snapshot = await Firestore.collection('orders')
      .where('dateCompleted', '<=', fourteenDaysAgo.toISOString())
      .get();

    if (!snapshot.empty) {
      const batch = Firestore.batch();
      snapshot.docs.forEach(doc => {
        const orderData = doc.data();
        const completedOrderRef = Firestore.collection('completedOrders').doc(doc.id);
        batch.set(completedOrderRef, {
          ...completedOrderDataFormat,
          ...orderData,
        });
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('Moved completed orders to completedOrders collection');
    }
  } catch (error) {
    console.error('Error moving completed orders:', error);
  }
};

const getUserOrders = async (userId) => {
  try {
    const snapshot = await Firestore.collection('orders').where('ownerId', '==', userId).get();
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
  markOrderComplete,
  archiveOrders,
};
