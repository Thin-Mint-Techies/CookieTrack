const { Firestore } = require('../firebaseConfig');

// Need to link to parent immediately, the parent or leader need to call this
const createTroop = async ({ name, email, assignedParent, saleData = [], contactDetail,rewardPoints }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    await newTroopRef.set({
      name,
      email,
      assignedParent, //need to be id
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
      saleData, // Array of objects containing "cookieNameAndID": "amountSold"
      currentReward, // need to be id
      rewardPoints,

    });
    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
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
    throw new Error(`Error fetching troops: ${error.message}`);

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
    throw new Error(`Error fetch troop by id: ${error.message}`);

  }
};

// Need to manage the fields
const updateTroopSales = async (troopId, saleData) => {
  try {
    const ref = Firestore.collection('troopers').doc(troopId);
    await ref.update({
      saleData, // Replacing or updating sales data
    });
    return { message: 'Sales data updated successfully' };
  } catch (error) {
    throw new Error(`Error updating troop sales data: ${error.message}`);
  }
};

// Need to manage the fields
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
    throw new Error(`Error updating troop by id: ${error.message}`);
  }
};

const deleteTroop = async (id) => {
  try {
    const ref = Firestore.collection('troopers').doc(id);
    await ref.delete();
    return { message: 'Troop deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting troop: ${error.message}`);
  }
};

// create an entire troop that link to the leader
const groupTrooper = async ({ name, email, assignedParent, saleData = [], contactDetail,rewardPoints }) => {
  try {
    const newTroopRef = Firestore.collection('troops').doc();
    await newTroopRef.set({
      name,
      email,
      assignedParent, //need to be id
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
      saleData, // Array of objects containing "cookieNameAndID": "amountSold"
      currentReward, // need to be id
      rewardPoints,

    });
    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
  }
};

module.exports = {
  createTroop,
  getAllTroops,
  getTroopById,
  updateTroop,
  updateTroopSales,
  deleteTroop,
};
