const { Firestore } = require('../config/firebaseConfig');

// Service to create a new troop
const createTroop = async ({ name, email, userName, password, role, contactDetail, notificationPreference, assignedLeader, refreshToken }) => {
  try {
    const newTroopRef = Firestore.collection('troops').doc();
    await newTroopRef.set({
      name,
      email,
      userName: userName || null,
      password,
      role: role || 1,
      contactDetail: {
        address: contactDetail?.address || null,
        email: contactDetail?.email || null,
      },
      notificationPreference: {
        reminder: notificationPreference?.reminder || false,
        text: notificationPreference?.text || null,
        phone: notificationPreference?.phone || null,
        email: notificationPreference?.email || null,
      },
      assignedLeader: assignedLeader || [],
      refreshToken: refreshToken || null,
    });
    return newTroopRef.id;
  } catch (error) {
    throw new Error('Error creating troop');
  }
};

// Service to get all troops
const getAllTroops = async () => {
  try {
    const snapshot = await Firestore.collection('troops').get();
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
    const doc = await Firestore.collection('troops').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    throw new Error('Troop not found');
  } catch (error) {
    throw new Error('Error fetching troop');
  }
};

// Service to update a troop by ID
const updateTroop = async (id, { name, email, userName, password, role, contactDetail, notificationPreference, assignedLeader, refreshToken }) => {
  try {
    const ref = Firestore.collection('troops').doc(id);
    await ref.update({
      name,
      email,
      userName,
      password,
      role,
      contactDetail: {
        address: contactDetail?.address || null,
        email: contactDetail?.email || null,
      },
      notificationPreference: {
        reminder: notificationPreference?.reminder || false,
        text: notificationPreference?.text || null,
        phone: notificationPreference?.phone || null,
        email: notificationPreference?.email || null,
      },
      assignedLeader,
      refreshToken,
    });
    return { message: 'Troop updated successfully' };
  } catch (error) {
    throw new Error('Error updating troop');
  }
};

// Service to delete a troop by ID
const deleteTroop = async (id) => {
  try {
    const ref = Firestore.collection('troops').doc(id);
    await ref.delete();
    return { message: 'Troop deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting troop');
  }
};

// Service to delete all troops
const deleteAllTroops = async () => {
  try {
    const snapshot = await Firestore.collection('troops').get();
    const batch = Firestore.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return { message: 'All troops deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting all troops');
  }
};

module.exports = {
  createTroop,
  getAllTroops,
  getTroopById,
  updateTroop,
  deleteTroop,
  deleteAllTroops,
};
