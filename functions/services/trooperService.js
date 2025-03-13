const { Firestore } = require('../firebaseConfig');
const notificationService = require('./notificationService');
const admin = require('firebase-admin');
const {trooperDataFormat} = require('../dataFormat');

const createTrooper = async ({ troopNumber, trooperName, ownerId, troopLeader, age, grade, shirtSize, boxesSold, currentBalance  }) => {
  try {
    const newTroopRef = Firestore.collection('troopers').doc();
    const troopData = {
      troopNumber,
      trooperName,
      ownerId, //uid of parent
      troopLeader,
      age,
      grade,
      shirtSize,
      currentBalance,
      boxesSold,
      // from here down is not sure
      squad: '',
      currentReward: [],
    };

    await newTroopRef.set(troopData);

    return newTroopRef.id;
  } catch (error) {
    throw new Error(error, `Error creating troop: ${error.message}`);
  }
};


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

const updateTrooper = async (troopNumber, trooperName, ownerId, troopLeader, age, grade, shirtSize, boxesSold, currentBalance, squad, currentReward) => {
  try {
    const ref = Firestore.collection('troopers').doc(troopId);
    await ref.update({
      troopNumber,
      trooperName,
      ownerId, //uid of parent
      troopLeader,
      age,
      grade,
      shirtSize,
      currentBalance,
      boxesSold,
      squad,
      currentReward,
    });
    return { message: 'Sales data updated successfully' };
  } catch (error) {
    throw new Error(`Error updating troop sales data: ${error.message}`);
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

const getAllTroopersByOwnerId = async (userId) => {
  try {
    // Query the troopers collection where assignedParent matches the userId
    const snapshot = await Firestore.collection('troopers').where('ownerId', '==', userId).get();
    if (snapshot.empty) {
      throw new Error('No troopers found for the given user ID');
    }

    // Map the fetched documents to an array of trooper data
    const troopers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return troopers;
  } catch (error) {
    throw new Error(`Error fetching troopers by assigned parent: ${error.message}`);
  }
};



module.exports = {
  createTrooper,
  getAllTroopers,
  getTrooperById,
  updateTrooper,
  deleteTrooper,
  getAllTroopersByOwnerId,
};
