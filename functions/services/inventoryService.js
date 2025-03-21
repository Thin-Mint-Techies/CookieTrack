const { Firestore } = require('../firebaseConfig');
const { parentInventoryDataFormat, leaderInventoryDataFormat, trooperInventoryDataFormat } = require('../dataFormat');

const createParentInventory = async ({ ownerId, trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    const newInventoryRef = Firestore.collection('inventory').doc();
    const newInventoryData = {
      ...parentInventoryDataFormat,
      ownerId,
      trooperId,
      trooperName,
      trooperNumber,
      inventory,
    };
    await newInventoryRef.set(newInventoryData);
    return newInventoryRef.id;
  } catch (error) {
    throw new Error(`Error creating Parent Inventory: ${error.message}`);
  }
};

const createLeaderInventory = async ({ ownerId, inventory, needToOrder }) => {
  try {
    const newInventoryRef = Firestore.collection('inventory').doc();
    const newInventoryData = {
      ...leaderInventoryDataFormat,
      ownerId,
      inventory,
      needToOrder,
    };
    await newInventoryRef.set(newInventoryData);
    return newInventoryRef.id;
  } catch (error) {
    throw new Error(`Error creating Leader Inventory: ${error.message}`);
  }
};

const createTrooperInventory = async ({ parentId, trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    const newInventoryRef = Firestore.collection('inventory').doc();
    const newInventoryData = {
      ...trooperInventoryDataFormat,
      parentId,
      trooperId,
      trooperName,
      trooperNumber,
      inventory,
    };
    await newInventoryRef.set(newInventoryData);
    return newInventoryRef.id;
  } catch (error) {
    throw new Error(`Error creating Trooper Inventory: ${error.message}`);
  }
};

const updateParentInventory = async (id, { trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const ref = Firestore.collection('inventory').doc(id);
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error('Parent inventory not found');
      }

      const updatedInventoryData = {
        trooperId,
        trooperName,
        trooperNumber,
        inventory,
      };
      transaction.update(ref, updatedInventoryData);
    });

    return { message: 'Parent Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Parent Inventory: ${error.message}`);
  }
};

const updateLeaderInventory = async (id, { inventory, needToOrder }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const ref = Firestore.collection('inventory').doc(id);
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error('Leader inventory not found');
      }

      const updatedInventoryData = {
        inventory,
        needToOrder
      };
      transaction.update(ref, updatedInventoryData);
    });

    return { message: 'Leader Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Leader Inventory: ${error.message}`);
  }
};

const updateTrooperInventory = async (id, { ownerId, trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const ref = Firestore.collection('inventory').doc(id);
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        throw new Error('Trooper inventory not found');
      }

      const updatedInventoryData = {
        ownerId,
        trooperId,
        trooperName,
        trooperNumber,
        inventory,
      };
      transaction.update(ref, updatedInventoryData);
    });

    return { message: 'Trooper Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Trooper Inventory: ${error.message}`);
  }
};

// 
const updateTrooperCookie = async (trooperId, cookiesToAdd) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const parentSnapshot = await transaction.get(Firestore.collection('inventory').where('trooperId', '==', trooperId));
      if (parentSnapshot.empty) {
        throw new Error('No parent inventory found for the given trooper ID');
      }

      const parentDoc = parentSnapshot.docs[0];
      const parentInventory = parentDoc.data().inventory;

      let sufficientCookies = true;
      cookiesToAdd.forEach(cookieToAdd => {
        const parentCookie = parentInventory.find(item => item.varietyId === cookieToAdd.varietyId);
        if (!parentCookie || parentCookie.boxes < cookieToAdd.boxes) {
          sufficientCookies = false;
        }
      });

      if (!sufficientCookies) {
        throw new Error('Not enough cookies in parent inventory');
      }

      const trooperRef = Firestore.collection('inventory').doc(trooperId);
      const trooperDoc = await transaction.get(trooperRef);
      if (!trooperDoc.exists) {
        throw new Error('Trooper inventory not found');
      }

      const trooperInventory = trooperDoc.data().inventory;

      cookiesToAdd.forEach(cookieToAdd => {
        const parentCookie = parentInventory.find(item => item.varietyId === cookieToAdd.varietyId);
        parentCookie.boxes -= cookieToAdd.boxes;

        const trooperCookie = trooperInventory.find(item => item.varietyId === cookieToAdd.varietyId);
        if (trooperCookie) {
          trooperCookie.boxes += cookieToAdd.boxes;
        } else {
          trooperInventory.push(cookieToAdd);
        }
      });

      transaction.update(trooperRef, { inventory: trooperInventory });
      transaction.update(parentDoc.ref, { inventory: parentInventory });
    });

    return { message: 'Trooper Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Trooper Inventory: ${error.message}`);
  }
};

const getAllInventories = async () => {
  try {
    const snapshot = await Firestore.collection('inventory').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No Inventories found');
  } catch (error) {
    throw new Error(`Error fetching all Inventories: ${error.message}`);
  }
};

const deleteInventory = async (id) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    await ref.delete();
    return { message: 'Inventory deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting Inventory: ${error.message}`);
  }
};

const getInventoryByOwnerId = async (ownerId) => {
  try {
    const snapshot = await Firestore.collection('inventory').where('ownerId', '==', ownerId).get();
    if (snapshot.empty) {
      throw new Error('No inventory found for the given owner ID');
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching inventory by owner ID: ${error.message}`);
  }
};

module.exports = {
  createParentInventory,
  createLeaderInventory,
  createTrooperInventory,
  updateParentInventory,
  updateLeaderInventory,
  updateTrooperCookie,
  getAllInventories,
  getInventoryByOwnerId,
  deleteInventory,
};