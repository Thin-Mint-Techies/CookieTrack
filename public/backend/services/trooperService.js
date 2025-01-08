const { Firestore } = require('../config/firebaseConfig');

// Service to create a new troop
const createTroop = async ({ name, email, assignedParent, saleData = [] }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    await newTroopRef.set({
      name,
      email,
      assignedParent, 
      saleData, // Array of objects containing cookie references and amountSold
      currentReward,
    });
    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, 'Error creating troop');
  }
};


const createTroop2 = async ({ name, email, assignedParent }) => {
  try {

    // Create the troop document
    const newTroopRef = Firestore.collection('troopers').doc();
    await newTroopRef.set({
      name,
      email,
      assignedParent, // Parent ID tied to the troop
    });

    return { success: true, troopId: newTroopRef.id };
  } catch (error) {
    return { success: false, message: `Error creating troop: ${error.message}` };
  }
};


// Service to get all troops
const getAllTroops = async () => {
  try {
    const snapshot = await Firestore.collection('troopers').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No troops found');
  } catch (error) {
    throw new Error('Error fetching troops');
  }
};

// Service to get a troop by ID
const getTroopById = async (id) => {
  try {
    const doc = await Firestore.collection('troopers').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    throw new Error('Troop not found');
  } catch (error) {
    throw new Error('Error fetching troop');
  }
};

// Service to update troop sales data
const updateTroopSales = async (troopId, saleData) => {
  try {
    const ref = Firestore.collection('troopers').doc(troopId);
    await ref.update({
      saleData, // Replacing or updating sales data
    });
    return { message: 'Sales data updated successfully' };
  } catch (error) {
    throw new Error('Error updating troop sales data');
  }
};

// Service to update a troop by ID
const updateTroop = async (id, { name, email, assignedParent, saleData }) => {
  try {
    const ref = Firestore.collection('troopers').doc(id);
    await ref.update({
      name,
      email,
      assignedParent,
      saleData,
      currentReward,
    });
    return { message: 'Troop updated successfully' };
  } catch (error) {
    throw new Error('Error updating troop');
  }
};

// Service to delete a troop by ID
const deleteTroop = async (id) => {
  try {
    const ref = Firestore.collection('troopers').doc(id);
    await ref.delete();
    return { message: 'Troop deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting troop');
  }
};

module.exports = {
  createTroop,
  createTroop2,
  getAllTroops,
  getTroopById,
  updateTroop,
  updateTroopSales,
  deleteTroop,
};
