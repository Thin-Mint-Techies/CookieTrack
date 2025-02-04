const { Firestore } = require('../firebaseConfig');
const notificationService = require('./notificationService');

// Need to link to parent immediately, the parent or leader need to call this
const createTrooper = async ({ name, email, assignedParent, contactDetail }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    const accessId = [assignedParent];
    const troopData = {
      name,
      email,
      assignedParent, // uid of parent
      accessId, // uid of parent
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
    };

    await newTroopRef.set(troopData);
    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
  }
};


// Service to get all troops
const getAllTroopers = async () => {
  try {
    const snapshot = await Firestore.collection('troopers').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No troops found');
  } catch (error) {
    console.log("getAllTroopers Service", error);
    throw new Error(`Error fetching troops: ${error.message}`);

  }
};

// Service to get a troop by ID
const getTrooperById = async (id) => {
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
const updateTrooperSales = async (troopId, saleData) => {
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
const updateTrooper = async (id, { name, email, assignedParent, saleData }) => {
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

const deleteTrooper = async (id) => {
  try {
    const ref = Firestore.collection('troopers').doc(id);
    await ref.delete();
    return { message: 'Troop deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting troop: ${error.message}`);
  }
};

const addTrooperAccessId = async (troopId, accessId) => {
  try {
    const troopRef = Firestore.collection('troopers').doc(troopId);
    const troopDoc = await troopRef.get();

    if (!troopDoc.exists) {
      throw new Error('Troop not found');
    }

    let { accessId: currentAccessIds } = troopDoc.data();

    if (!currentAccessIds.includes(accessId)) {
      currentAccessIds.push(accessId);
    }

    await troopRef.update({ accessId: currentAccessIds });
  } catch (error) {
    throw new Error(`Error adding accessId: ${error.message}`);
  }
};

const deleteTrooperAccessId = async (troopId, accessId) => {
  try {
    const troopRef = Firestore.collection('troopers').doc(troopId);
    const troopDoc = await troopRef.get();

    if (!troopDoc.exists) {
      throw new Error('Troop not found');
    }

    let { accessId: currentAccessIds } = troopDoc.data();
    currentAccessIds = currentAccessIds.filter(id => id !== accessId);

    await troopRef.update({ accessId: currentAccessIds });
  } catch (error) {
    throw new Error(`Error deleting accessId: ${error.message}`);
  }
};


module.exports = {
  createTrooper,
  getAllTroopers,
  getTrooperById,
  updateTrooper,
  updateTrooperSales,
  deleteTrooper,
};
