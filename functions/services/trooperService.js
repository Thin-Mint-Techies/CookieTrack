const { Firestore } = require('../firebaseConfig');
const notificationService = require('./notificationService');

// Need to link to parent immediately, the parent or leader need to call this
const createTrooperExp = async ({ name, email, assignedParent, saleData = [], contactDetail,rewardPoints }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    const troopData = {
      name,
      email,
      assignedParent, //need to be id
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
    };

    // optional fields
    if (saleData.length > 0) {
      troopData.saleData = saleData; // Array of objects containing "cookieNameAndID": "amountSold"
    }
    if (currentReward) {
      troopData.currentReward = currentReward; // need to be id
    }

    await newTroopRef.set(troopData);

    // Need notification service to notify the parent
    // Mabe in controller instead of here?
    // Have not test
    await notificationService.sendNotificationToUser(
      assignedParent,
      'New Trooper Assigned',
      `You have been assigned a new trooper: ${name}`
    );

    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
  }
};


const createTrooper = async ({ name, email, assignedParent, saleData = [], contactDetail,rewardPoints }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    const troopData = {
      name,
      email,
      assignedParent, //need to be id
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
    };

    // optional fields
    if (saleData.length > 0) {
      troopData.saleData = saleData; // Array of objects containing "cookieNameAndID": "amountSold"
    }
    if (currentReward) {
      troopData.currentReward = currentReward; // need to be id
    }

    await newTroopRef.set(troopData);

    // Need notification service to notify the parent
    // Mabe in controller instead of here?
    // Have not test
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

// create an entire troop that link to the leader
const createTroop = async ({ name, email, assignedParent, saleData = [], contactDetail,rewardPoints }) => {
  try {
    const newTroopRef = Firestore.collection('troops').doc();
    await newTroopRef.set({
      troopName,
      leader, // need to be id
      troopers: [],
      totalSaleData: [], // get all data from the trooopers
    });
    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
  }
};


// Read a troop by ID
const getTroopById = async (id) => {
  try {
    const troopRef = Firestore.collection('troops').doc(id);
    const doc = await troopRef.get();
    if (!doc.exists) {
      throw new Error('Troop not found');
    }
    return doc.data();
  } catch (error) {
    throw new Error(`Error fetching troop: ${error.message}`);
  }
};

// Update a troop by ID
const updateTroop = async (id, updateData) => {
  try {
    const troopRef = Firestore.collection('troops').doc(id);
    await troopRef.update(updateData);
    return { message: 'Troop updated successfully' };
  } catch (error) {
    throw new Error(`Error updating troop: ${error.message}`);
  }
};

// Delete a troop by ID
const deleteTroop = async (id) => {
  try {
    const troopRef = Firestore.collection('troops').doc(id);
    await troopRef.delete();
    return { message: 'Troop deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting troop: ${error.message}`);
  }
};

module.exports = {
  createTrooper,
  getAllTroopers,
  getTrooperById,
  updateTrooper,
  updateTrooperSales,
  deleteTrooper,
  
  createTroop,
  getTroopById,
  updateTroop,
  deleteTroop,
};
