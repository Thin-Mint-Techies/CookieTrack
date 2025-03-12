const { Firestore } = require('../firebaseConfig');
const { parentInventoryDataFormat, leaderInventoryDataFormat } = require('../dataFormat');

// Create Parent Inventory
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

// Create Leader Inventory
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

// Get All Inventories
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

// Update Parent Inventory
const updateParentInventory = async (id, {trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    const updatedInventoryData = {
      trooperId,
      trooperName,
      trooperNumber,
      inventory,
    };
    await ref.update(updatedInventoryData);
    return { message: 'Parent Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Parent Inventory: ${error.message}`);
  }
};

// Update Leader Inventory
const updateLeaderInventory = async (id, {inventory, needToOrder }) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    const updatedInventoryData = {
      inventory,
      needToOrder
    };
    await ref.update(updatedInventoryData);
    return { message: 'Leader Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Leader Inventory: ${error.message}`);
  }
};

// Delete Inventory
const deleteInventory = async (id) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    await ref.delete();
    return { message: 'Inventory deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting Inventory: ${error.message}`);
  }
};

module.exports = {
  createParentInventory,
  createLeaderInventory,
  getAllInventories,
  updateParentInventory,
  updateLeaderInventory,
  deleteInventory,
};