const { Firestore } = require('../firebaseConfig');
const { sendEmail } = require('../utils/emailSender');
const { orderDataFormat } = require('../dataFormat');
const { completedOrderDataFormat } = require('../dataFormat');
const { updateSaleData } = require('./test');



const createOrder = async ({ trooperName, trooperId, ownerId, ownerEmail, buyerEmail, parentName, contact, financialAgreement, orderContent, paymentType }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
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

      let inStock = true;
      let totalCost = 0;
      let boxTotal = 0;

      // Calculate totalCost and boxTotal
      orderContent.cookies.forEach(cookie => {
        cookie.cookieTotalCost = cookie.boxes * cookie.boxPrice;
        totalCost += cookie.cookieTotalCost;
        boxTotal += cookie.boxes;
      });

      newOrderData.orderContent.totalCost = totalCost;
      newOrderData.orderContent.boxTotal = boxTotal;

      // Check and update leader inventory
      const leaderInventoryRef = Firestore.collection('inventory').doc(leaderId);
      const leaderInventoryDoc = await transaction.get(leaderInventoryRef);

      if (!leaderInventoryDoc.exists) {
        throw new Error('Leader inventory not found');
      }

      const leaderInventory = leaderInventoryDoc.data().inventory;

      orderContent.cookies.forEach(cookie => {
        const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
        if (!inventoryItem || inventoryItem.boxes < cookie.boxes) {
          inStock = false;
        }
      });

      if (inStock) {
        // Update leader inventory
        orderContent.cookies.forEach(cookie => {
          const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
          inventoryItem.boxes -= cookie.boxes;
        });

        transaction.update(leaderInventoryRef, { inventory: leaderInventory });

        // Send email to leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Submitted',
          text: `Order ${newOrderRef.id} has been submitted for trooper ${trooperName}.`,
        });
      } else {
        // Add order to leader's order pile
        newOrderData.needToOrder = true;

        // Send email to parent and leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${newOrderRef.id} for trooper ${trooperName} needs attention.`,
        });

        await sendEmail({
          to: buyerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${newOrderRef.id} for trooper ${trooperName} needs attention.`,
        });
      }

      await transaction.set(newOrderRef, newOrderData);
    });

    return { message: 'Order created successfully' };
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

const updateOrder = async (id, { trooperName, trooperId, ownerId, ownerEmail, buyerEmail, parentName, contact, financialAgreement, orderContent, paymentType }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const orderRef = Firestore.collection('orders').doc(id);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }

      const updatedOrderData = {
        ...orderDataFormat,
        dateCreated: orderDoc.data().dateCreated,
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

      let inStock = true;
      let totalCost = 0;
      let boxTotal = 0;

      // Calculate totalCost and boxTotal
      orderContent.cookies.forEach(cookie => {
        cookie.cookieTotalCost = cookie.boxes * cookie.boxPrice;
        totalCost += cookie.cookieTotalCost;
        boxTotal += cookie.boxes;
      });

      updatedOrderData.orderContent.totalCost = totalCost;
      updatedOrderData.orderContent.boxTotal = boxTotal;

      // Check and update leader inventory
      const leaderInventoryRef = Firestore.collection('inventory').doc(ownerId);
      const leaderInventoryDoc = await transaction.get(leaderInventoryRef);

      if (!leaderInventoryDoc.exists) {
        throw new Error('Leader inventory not found');
      }

      const leaderInventory = leaderInventoryDoc.data().inventory;

      orderContent.cookies.forEach(cookie => {
        const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
        if (!inventoryItem || inventoryItem.boxes < cookie.boxes) {
          inStock = false;
        }
      });

      if (inStock) {
        // Update leader inventory
        orderContent.cookies.forEach(cookie => {
          const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
          inventoryItem.boxes -= cookie.boxes;
        });

        transaction.update(leaderInventoryRef, { inventory: leaderInventory });

        // Send email to leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Updated',
          text: `Order ${id} has been updated for trooper ${trooperName}.`,
        });
      } else {
        // Add order to leader's order pile
        updatedOrderData.needToOrder = true;

        // Send email to parent and leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${id} for trooper ${trooperName} needs attention.`,
        });

        await sendEmail({
          to: buyerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${id} for trooper ${trooperName} needs attention.`,
        });
      }

      transaction.update(orderRef, updatedOrderData);
    });

    return { message: 'Order updated successfully' };
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
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


const deleteOrder = async (id) => {
  try {
    const ref = Firestore.collection('orders').doc(id);
    await ref.delete();
    return { message: 'Order deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting Order: ${error.message}`);
  }
};

const markOrderComplete = async (id, { pickupDetails }) => {
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
    await updateSaleData({ ...completedOrderData, id });


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

// have not test, need to use with a cron job using firebase functions
// maybe archive immediately after finish?
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
        // id of completedOrders is the id of the original order
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

const getOrdersByTrooperId = async (trooperId) => {
  try {
    const snapshot = await Firestore.collection('orders').where('trooperId', '==', trooperId).get();
    if (snapshot.empty) {
      throw new Error('No orders found for the given trooper ID');
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching orders by trooper ID: ${error.message}`);
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
  getOrdersByTrooperId
};
