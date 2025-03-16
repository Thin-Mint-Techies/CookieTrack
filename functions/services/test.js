const { Firestore } = require('../firebaseConfig');

//INVENTORY SERVICE
// Update Inventory when Order is Created
const updateInventoryOnOrderCreated = async (transaction, orderContent) => {
  for (const item of orderContent) {
    const { varietyId, boxes } = item;

    // Update Parent Inventory
    const parentInventorySnapshot = await transaction.get(
      Firestore.collection('inventory')
        .where('varietyId', '==', varietyId)
        .where('ownerType', '==', 'parent')
    );
    parentInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      const newBoxes = inventoryData.boxes - boxes;
      const inventoryRef = Firestore.collection('inventory').doc(doc.id);
      // atomic transaction using firestore
      transaction.update(inventoryRef, { boxes: newBoxes });
    });

    // Update Leader Inventory
    const leaderInventorySnapshot = await transaction.get(
      Firestore.collection('inventory')
        .where('varietyId', '==', varietyId)
        .where('ownerType', '==', 'leader')
    );

    leaderInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      const newBoxes = inventoryData.boxes - boxes;
      const inventoryRef = Firestore.collection('inventory').doc(doc.id);
      transaction.update(inventoryRef, { boxes: newBoxes });
    });
  }
};

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
      transaction.set(newOrderRef, newOrderData);

      // Update Inventory
      await updateInventoryOnOrderCreated(transaction, orderContent);
    });

    console.log('Order created and inventory updated successfully');
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

module.exports = {
  updateInventoryOnOrderCreated,
  createOrder,
};


/*
const updateInventoryOnOrderCreated = async (transaction, orderContent) => {
  for (const item of orderContent) {
    const { varietyId, boxes } = item;

    // Check Parent Inventory
    const parentInventorySnapshot = await transaction.get(
      Firestore.collection('inventory')
        .where('varietyId', '==', varietyId)
        .where('ownerType', '==', 'parent')
    );

    let parentHasEnough = true;
    parentInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      if (inventoryData.boxes < boxes) {
        parentHasEnough = false;
      }
    });

    // Check Leader Inventory
    const leaderInventorySnapshot = await transaction.get(
      Firestore.collection('inventory')
        .where('varietyId', '==', varietyId)
        .where('ownerType', '==', 'leader')
    );
    let leaderHasEnough = true;
    leaderInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      if (inventoryData.boxes < boxes) {
        leaderHasEnough = false;
      }
    });

    if (!parentHasEnough || !leaderHasEnough) {
      // Send email to parent and leader
      await sendEmail({
        to: [parentEmail, leaderEmail],
        subject: 'Insufficient Inventory',
        text: `There are not enough cookies of variety ${varietyId} to fulfill the order.`,
      });

      // Update leader's needToOrder field
      leaderInventorySnapshot.forEach(doc => {
        const inventoryData = doc.data();
        const needToOrder = inventoryData.needToOrder || [];
        needToOrder.push({ varietyId, boxes });
        const inventoryRef = Firestore.collection('inventory').doc(doc.id);
        transaction.update(inventoryRef, { needToOrder });
      });

      // Abort the order creation
      throw new Error(`Not enough cookies of variety ${varietyId} to fulfill the order.`);
    }
      // Update Parent Inventory
    parentInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      const newBoxes = inventoryData.boxes - boxes;
      const inventoryRef = Firestore.collection('inventory').doc(doc.id);
      transaction.update(inventoryRef, { boxes: newBoxes });
    });

    // Update Leader Inventory
    leaderInventorySnapshot.forEach(doc => {
      const inventoryData = doc.data();
      const newBoxes = inventoryData.boxes - boxes;
      const inventoryRef = Firestore.collection('inventory').doc(doc.id);
      transaction.update(inventoryRef, { boxes: newBoxes });
    });
  }
};
*/