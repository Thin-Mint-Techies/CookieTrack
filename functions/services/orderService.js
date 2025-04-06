const { Firestore } = require('../firebaseConfig');
const { sendEmail } = require('../utils/emailSender');
const { completedOrderDataFormat } = require('../dataFormat');
//const { updateSaleData } = require('./test');
const { updateSaleData } = require('./saleDataService');
const { isPositiveFloat, isPositiveInt } = require('../utils/caculation')

const createOrder = async ({ dateCreated, trooperId, trooperName, ownerId, ownerEmail, ownerName, buyerEmail, contact, pickupLocation, orderContent, cashPaid, cardPaid, saleDataId }) => {
  try {
    let newOrderRef, newOrderData;
    await Firestore.runTransaction(async (transaction) => {
      newOrderRef = Firestore.collection('orders').doc();
      newOrderData = {
        dateCreated,
        dateCompleted: '',
        trooperId,
        trooperName,
        ownerId,
        ownerEmail,
        ownerName,
        buyerEmail,
        contact,
        financialAgreement: "Agreed",
        status: "Not ready for pickup",
        pickupLocation,
        orderContent,
        cashPaid,
        cardPaid,
        saleDataId
      };
      let inStock = true;
      let totalCost = 0;
      let boxTotal = 0;

      // Check leader existence
      const leaderInventoryRef = Firestore.collection('inventory').doc("troop-inventory");
      const leaderInventoryDoc = await transaction.get(leaderInventoryRef);
      if (!leaderInventoryDoc.exists) {
        throw new Error('Leader inventory not found');
      }

      // Check LeaderInventory
      const leaderInventory = leaderInventoryDoc.data().inventory;
      orderContent.cookies.forEach(cookie => {
        const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
        if (!inventoryItem || inventoryItem.boxes < cookie.boxes) {
          inStock = false;
        }
      });

      // Calculate totalCost and boxTotal
      orderContent.cookies.forEach(cookie => {
        cookie.cookieTotalCost = (cookie.boxes * parseFloat(cookie.boxPrice.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        totalCost += parseFloat(cookie.cookieTotalCost.replace(/[^0-9.-]+/g, ""));
        boxTotal += cookie.boxes;
      });
      newOrderData.orderContent.totalCost = totalCost.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      newOrderData.orderContent.boxTotal = boxTotal;

      // Process the order
      if (inStock) {
        // Update leader inventory
        orderContent.cookies.forEach(cookie => {
          const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
          inventoryItem.boxes -= cookie.boxes;
        });
        transaction.update(leaderInventoryRef, { inventory: leaderInventory });
        //Order is ready for pickup
        newOrderData.status = "Ready for pickup";

        // Send email to leader
        /* await sendEmail({
          to: ownerEmail,
          subject: 'Order Submitted',
          text: `Order ${newOrderRef.id} has been submitted for trooper ${trooperName}.`,
        });
        await sendEmail({
          to: parentEmail,
          subject: 'Order Submitted',
          text: `Order ${newOrderRef.id} has been submitted for trooper ${trooperName}.`,
        }); */
      } else {
        // Update the need to order list with missing boxes
        const needToOrder = [];
        orderContent.cookies.forEach(cookie => {
          const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
          const availableBoxes = inventoryItem ? inventoryItem.boxes : 0;

          if (availableBoxes < cookie.boxes) {
            needToOrder.push({
              orderId: newOrderRef.id,
              varietyId: cookie.varietyId,
              variety: cookie.variety,
              boxes: cookie.boxes - availableBoxes,
              boxPrice: parseFloat(cookie.boxPrice.replace(/[^0-9.-]+/g, ""))
            });
          }
        });

        transaction.update(leaderInventoryRef, { needToOrder: Firestore.FieldValue.arrayUnion(...needToOrder) });
        newOrderData.status = "Not ready for pickup";
        // Send email to parent and leader
        /* await sendEmail({
          to: ownerEmail,
          subject: 'Cannot Fulfill Order',
          text: `Order ${newOrderRef.id} for trooper ${trooperName} does not have enough inventory.`,
        });

        await sendEmail({
          to: buyerEmail,
          subject: 'Cannot Fulfill Order',
          text: `Order ${newOrderRef.id} for trooper ${trooperName} does not have enough inventory.`,
        }); */
      }

      await transaction.set(newOrderRef, newOrderData);
    });

    return { id: newOrderRef.id, status: newOrderData.status };
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

const updateOrder = async (id, { trooperId, trooperName, ownerEmail, ownerName, buyerEmail, contact, pickupLocation, orderContent, cashPaid, cardPaid, saleDataId }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      // Get original order data
      const orderRef = Firestore.collection('orders').doc(id);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      const originalOrderData = orderDoc.data();

      // Create updated order data
      const updatedOrderData = {
        ...originalOrderData,
        trooperId,
        trooperName,
        ownerEmail,
        ownerName,
        buyerEmail,
        contact,
        status: "Not ready for pickup",
        pickupLocation,
        orderContent,
        cashPaid,
        cardPaid,
        saleDataId
      };

      // Get leader inventory
      const leaderInventoryRef = Firestore.collection('inventory').doc("troop-inventory");
      const leaderInventoryDoc = await transaction.get(leaderInventoryRef);
      if (!leaderInventoryDoc.exists) {
        throw new Error('Leader inventory not found');
      }
      const leaderInventory = leaderInventoryDoc.data().inventory;

      // Calculate differences and update inventory
      let inStock = true;
      let totalCost = 0;
      let boxTotal = 0;

      //Need to update troop inventory based on the difference of the cookie boxes from the update
      orderContent.cookies.forEach(newCookie => {
        // Find matching cookies in original order and leader inventory
        const originalCookie = originalOrderData.orderContent.cookies.find(c => c.varietyId === newCookie.varietyId);
        const inventoryItem = leaderInventory.find(item => item.varietyId === newCookie.varietyId);

        if (!inventoryItem) {
          inStock = false;
          //return;
        }

        // Calculate difference in boxes
        const originalBoxes = originalCookie ? originalCookie.boxes : 0;
        const boxDifference = newCookie.boxes - originalBoxes;

        // Check if change is possible with current inventory
        if (inventoryItem.boxes < boxDifference) {
          inStock = false;
          //return;
        }

        // Update inventory based on difference
        inventoryItem.boxes -= boxDifference;

        // Calculate costs
        newCookie.cookieTotalCost = (newCookie.boxes * parseFloat(newCookie.boxPrice.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        totalCost += parseFloat(newCookie.cookieTotalCost.replace(/[^0-9.-]+/g, ""));
        boxTotal += newCookie.boxes;
      });

      updatedOrderData.orderContent.totalCost = totalCost.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      updatedOrderData.orderContent.boxTotal = boxTotal;

      if (inStock) {
        transaction.update(leaderInventoryRef, { inventory: leaderInventory });
        updatedOrderData.status = "Ready for pickup";

        /* // Send email to leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Updated',
          text: `Order ${id} has been updated for trooper ${trooperName}.`,
        }); */
      } else {
        const needToOrder = [];
        orderContent.cookies.forEach(cookie => {
          const inventoryItem = leaderInventory.find(item => item.varietyId === cookie.varietyId);
          const availableBoxes = inventoryItem ? inventoryItem.boxes : 0;

          if (availableBoxes < cookie.boxes) {
            needToOrder.push({
              orderId: orderRef.id,
              varietyId: cookie.varietyId,
              variety: cookie.variety,
              boxes: cookie.boxes - availableBoxes,
              boxPrice: parseFloat(cookie.boxPrice.replace(/[^0-9.-]+/g, ""))
            });
          }
        });

        transaction.update(leaderInventoryRef, { needToOrder: Firestore.FieldValue.arrayUnion(...needToOrder) });
        newOrderData.status = "Not ready for pickup";
        /* // Send email to parent and leader
        await sendEmail({
          to: ownerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${id} for trooper ${trooperName} needs attention.`,
        });

        await sendEmail({
          to: buyerEmail,
          subject: 'Order Needs Attention',
          text: `Order ${id} for trooper ${trooperName} needs attention.`,
        }); */
      }

      transaction.update(orderRef, updatedOrderData);
    });

    return { message: 'Order updated successfully' };
  } catch (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
};

const updateOrderPaidAmount = async (id, { trooperId, ownerId, cashPaid, cardPaid }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      // Get original order data
      const orderRef = Firestore.collection('orders').doc(id);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      const originalOrderData = orderDoc.data();

      // Calculate payment differences
      const originalPaidAmount = parseFloat(originalOrderData.cashPaid?.replace(/[^0-9.-]+/g, "") || "0") + parseFloat(originalOrderData.cardPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const newPaidAmount = parseFloat(cashPaid?.replace(/[^0-9.-]+/g, "") || "0") + parseFloat(cardPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const paymentDifference = newPaidAmount - originalPaidAmount;

      // Calculate new owe amount for order
      const orderTotalCost = parseFloat(originalOrderData.orderContent.totalCost.replace(/[^0-9.-]+/g, "") || "0");
      const newOrderOweAmount = orderTotalCost - newPaidAmount;

      // Get trooper inventory
      const trooperInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('trooperId', '==', trooperId));
      if (trooperInventorySnapshot.empty) {
        throw new Error('Trooper inventory not found');
      }
      const trooperDoc = trooperInventorySnapshot.docs[0];
      const trooperInventory = trooperDoc.data();

      // Get parent inventory
      const parentInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('ownerId', '==', ownerId));
      if (parentInventorySnapshot.empty) {
        throw new Error('Parent inventory not found');
      }
      const parentDoc = parentInventorySnapshot.docs[0];
      const parentInventory = parentDoc.data();

      // Update owe amounts for both trooper and parent
      const trooperCurrentOwe = parseFloat(trooperInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");
      const parentCurrentOwe = parseFloat(parentInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");

      // Reduce owe amount by payment difference (if payment increased, owe decreases)
      const newTrooperOwe = trooperCurrentOwe - paymentDifference;
      const newParentOwe = parentCurrentOwe - paymentDifference;

      // Update all documents in transaction
      transaction.update(trooperDoc.ref, {
        owe: newTrooperOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      transaction.update(parentDoc.ref, {
        owe: newParentOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      // Update order with new payment amounts and owe amount
      const updatedOrderData = {
        ...originalOrderData,
        cashPaid,
        cardPaid,
        orderContent: {
          ...originalOrderData.orderContent,
          owe: newOrderOweAmount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })
        }
      };

      transaction.update(orderRef, updatedOrderData);
    });

    return { message: 'Order payment updated successfully' };
  } catch (error) {
    throw new Error(`Failed to update order payment: ${error.message}`);
  }
};

const deleteOrder = async (id) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const orderRef = Firestore.collection('orders').doc(id);
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }

      transaction.delete(orderRef);
    });

    return { message: 'Order deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting Order: ${error.message}`);
  }
};

// parent confirm the cookies is correct and pickup the cookies
const parentPickup = async (orderId, ownerEmail) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const orderRef = Firestore.collection('orders').doc(orderId);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      const orderData = orderDoc.data();

      // Get parent inventory
      const parentInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('ownerId', '==', orderData.ownerId));
      if (parentInventorySnapshot.empty) {
        throw new Error('Parent inventory not found');
      }
      const parentDoc = parentInventorySnapshot.docs[0];
      const parentInventory = parentDoc.data();

      // Get trooper inventory
      const trooperInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('trooperId', '==', orderData.trooperId));
      if (trooperInventorySnapshot.empty) {
        throw new Error('Trooper inventory not found');
      }
      const trooperDoc = trooperInventorySnapshot.docs[0];
      const trooperInventory = trooperDoc.data();

      // Update parent and trooper inventory with order cookies
      orderData.orderContent.cookies.forEach(orderCookie => {
        // Update parent inventory
        const existingParentCookie = parentInventory.inventory.find(
          cookie => cookie.varietyId === orderCookie.varietyId
        );
        if (existingParentCookie) {
          existingParentCookie.boxes += orderCookie.boxes;
        } else {
          parentInventory.inventory.push({
            varietyId: orderCookie.varietyId,
            variety: orderCookie.variety,
            boxes: orderCookie.boxes,
            boxPrice: orderCookie.boxPrice
          });
        }

        // Update trooper inventory
        const existingTrooperCookie = trooperInventory.inventory.find(
          cookie => cookie.varietyId === orderCookie.varietyId
        );
        if (existingTrooperCookie) {
          existingTrooperCookie.boxes += orderCookie.boxes;
        } else {
          trooperInventory.inventory.push({
            varietyId: orderCookie.varietyId,
            variety: orderCookie.variety,
            boxes: orderCookie.boxes,
            boxPrice: orderCookie.boxPrice
          });
        }
      });

      // Calculate amount owed
      const totalCost = parseFloat(orderData.orderContent.totalCost.replace(/[^0-9.-]+/g, ""));
      const cashPaid = parseFloat(orderData.cashPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const cardPaid = parseFloat(orderData.cardPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const paidAmount = cashPaid + cardPaid;
      const amountOwed = totalCost - paidAmount;

      // Get current owe amounts as numbers
      const parentCurrentOwe = parseFloat(parentInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");
      const trooperCurrentOwe = parseFloat(trooperInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");

      // Calculate new owe amounts
      const newParentOwe = parentCurrentOwe + amountOwed;
      const newTrooperOwe = trooperCurrentOwe + amountOwed;

      // Update parent inventory document
      transaction.update(parentDoc.ref, {
        inventory: parentInventory.inventory,
        owe: newParentOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      // Update trooper inventory document
      transaction.update(trooperDoc.ref, {
        inventory: trooperInventory.inventory,
        owe: newTrooperOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      // Update order status
      const updatedOrderData = {
        ...orderData,
        status: 'Picked up',
        datePickedUp: new Date().toLocaleDateString("en-US"),
        orderContent: {
          ...orderData.orderContent,
          owe: amountOwed.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })
        }
      };
      transaction.update(orderRef, updatedOrderData);

      // Send email to parent for confirmation
      /* await sendEmail({
        to: ownerEmail,
        subject: 'Order Picked Up',
        text: `Order ${orderId} for trooper ${orderData.trooperName} has been marked as picked up. Amount owed: ${amountOwed.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
      }); */
    });

    return { message: 'Order marked as picked up successfully' };
  } catch (error) {
    throw new Error(`Failed to mark order as picked up: ${error.message}`);
  }
};

// done only after the owe amount in order hit 0 or below
const markOrderComplete = async (orderId) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      // Get order data
      const orderRef = Firestore.collection('orders').doc(orderId);
      const orderSnapshot = await transaction.get(orderRef);
      if (!orderSnapshot.exists) {
        throw new Error('Order not found');
      }
      const orderData = orderSnapshot.data();

      // Get trooper inventory
      const trooperInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('trooperId', '==', orderData.trooperId));
      if (trooperInventorySnapshot.empty) {
        throw new Error('Trooper inventory not found');
      }
      const trooperDoc = trooperInventorySnapshot.docs[0];
      const trooperInventory = trooperDoc.data();

      // Get parent inventory
      const parentInventorySnapshot = await transaction.get(Firestore.collection('inventory').where('ownerId', '==', orderData.ownerId));
      if (parentInventorySnapshot.empty) {
        throw new Error('Parent inventory not found');
      }
      const parentDoc = parentInventorySnapshot.docs[0];
      const parentInventory = parentDoc.data();

      // Update trooper inventory
      const updatedTrooperInventory = trooperInventory.inventory.map(cookie => {
        const orderCookie = orderData.orderContent.cookies.find(
          oc => oc.varietyId === cookie.varietyId
        );
        if (orderCookie) {
          return {
            ...cookie,
            boxes: cookie.boxes - orderCookie.boxes
          };
        }
        return cookie;
      }).filter(cookie => cookie.boxes > 0); // Remove cookies with 0 boxes

      // Update parent inventory
      const updatedParentInventory = parentInventory.inventory.map(cookie => {
        const orderCookie = orderData.orderContent.cookies.find(
          oc => oc.varietyId === cookie.varietyId
        );
        if (orderCookie) {
          return {
            ...cookie,
            boxes: cookie.boxes - orderCookie.boxes
          };
        }
        return cookie;
      }).filter(cookie => cookie.boxes > 0); // Remove cookies with 0 boxes

      // Calculate the final amounts to be paid
      const totalCost = parseFloat(orderData.orderContent.totalCost.replace(/[^0-9.-]+/g, ""));
      const cashPaid = parseFloat(orderData.cashPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const cardPaid = parseFloat(orderData.cardPaid?.replace(/[^0-9.-]+/g, "") || "0");
      const totalPaid = cashPaid + cardPaid;

      // Calculate the current owe amounts
      const trooperCurrentOwe = parseFloat(trooperInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");
      const parentCurrentOwe = parseFloat(parentInventory.owe?.replace(/[^0-9.-]+/g, "") || "0");

      // Calculate new owe amounts by removing only the remaining unpaid amount
      const remainingUnpaid = totalCost - totalPaid;
      const newTrooperOwe = Math.abs(trooperCurrentOwe - remainingUnpaid);
      const newParentOwe = Math.abs(parentCurrentOwe - remainingUnpaid);

      // Update trooper inventory
      transaction.update(trooperDoc.ref, {
        inventory: updatedTrooperInventory,
        owe: newTrooperOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      // Update parent inventory
      transaction.update(parentDoc.ref, {
        inventory: updatedParentInventory,
        owe: newParentOwe.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      });

      // Update order status
      const completedOrderData = {
        ...orderData,
        status: 'Completed',
        dateCompleted: new Date().toLocaleDateString("en-US"),
      };
      transaction.update(orderRef, completedOrderData);

      // Update sale data
      await updateSaleData(orderData.saleDataId, {
        orderId: orderId,
        orderContent: orderData.orderContent
      });

      // Send email to owner
      /* await sendEmail({
        to: orderData.ownerEmail,
        subject: 'Order Completed',
        text: `Order ${id} has been completed for trooper ${orderData.trooperName}.`,
      });

      // Send email to buyer
      await sendEmail({
        to: orderData.buyerEmail,
        subject: 'Order Completed',
        text: `Order ${id} has been completed for trooper ${orderData.trooperName}.`,
      }); */
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

const getOrdersByOwnerId = async (ownerId) => {
  try {
    const snapshot = await Firestore.collection('orders').where('ownerId', '==', ownerId).get();
    if (snapshot.empty) {
      throw new Error('No orders found for the given owner ID');
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching orders by owner ID: ${error.message}`);
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


// Create order -> update needToOrder -> leaderClick fill from inventory -> fill all cookie
const updateNeedToOrder = async (orderId, updatedCookies) => {
  try {
    await Firestore.runTransaction(async (transaction) => {

      // Get the troop inventory document
      const troopInventoryRef = Firestore.collection('inventory').doc('troop-inventory');
      const troopInventoryDoc = await transaction.get(troopInventoryRef);
      if (!troopInventoryDoc.exists) {
        throw new Error('Troop inventory not found');
      }

      const troopInventory = troopInventoryDoc.data();
      const needToOrder = troopInventory.needToOrder || [];

      // Update the needToOrder field
      updatedCookies.forEach(updatedCookie => {
        const needToOrderItem = needToOrder.find(item => item.varietyId === updatedCookie.varietyId);

        if (needToOrderItem) {
          // Reduce the boxes in needToOrder based on the updated cookies
          needToOrderItem.boxes -= updatedCookie.boxes;
        }
      });

      // Update the troop inventory document
      transaction.update(troopInventoryRef, { needToOrder });

      // Get the original order document
      const orderRef = Firestore.collection('orders').doc(orderId);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error('Original order not found');
      }

      const orderData = orderDoc.data();

      // Update the order status and notify the parent
      const updatedOrderData = {
        ...orderData,
        status: 'Ready for pickup',
      };

      transaction.update(orderRef, updatedOrderData);

      // Notify the parent via email
      /* await sendEmail({
        to: ownerEmail,
        subject: 'Order Ready for Pickup',
        text: `Order ${originalOrderId} is now ready for pickup.`,
      }); */
    });

    return { message: 'Need to order updated and parent notified successfully' };
  } catch (error) {
    throw new Error(`Failed to update need to order: ${error.message}`);
  }
};






module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  updateOrderPaidAmount,
  deleteOrder,
  markOrderComplete,
  archiveOrders,
  getOrdersByTrooperId,
  getOrdersByOwnerId,
  parentPickup,
  updateNeedToOrder
};
