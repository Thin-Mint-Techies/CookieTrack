const { Firestore } = require('../firebaseConfig');
require('dotenv').config();
const SECRET_CODE = process.env.SECRET_CODE;
const auth = require('../firebaseConfig').auth;


const registerUser = async ({ name, email, role, secretCode, password }) => {
  try {
    // Validate role and secret code
    if (role === 'leader' || role === 'manager') {
      if (secretCode !== SECRET_CODE) {
        throw new Error('Invalid secret code for elevated roles. Cannot create account');
      }
    } else if (role !== 'parent') {
      throw new Error('Invalid role');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({ email, password });
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Save user details in Firestore
    const newUserRef = Firestore.collection('users').doc(userRecord.uid);
    await newUserRef.set({
      name,
      email,
    });

    return { uid: userRecord.uid, email, role };
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new Error('Failed to register user');
  }
};

const getAllUsers = async () => {
  try {
    const snapshot = await Firestore.collection('users').get();
    if (!snapshot.empty) {
      // return all users here
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No users found');
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const doc = await Firestore.collection('users').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    throw new Error('User not found');
  } catch (error) {
    throw new Error(`Error fetching user by id: ${error.message}`);
  }
};

const updateUser = async (id, { name, email, newTrooperIds, contactDetail,removeTrooperIds }) => {
  try {
    const ref = Firestore.collection('users').doc(id);

    // Fetch the current user data
    const doc = await ref.get();
    if (!doc.exists) {
      throw new Error('User not found');
    }

    // Update only non-role fields
    await ref.update({
      name,
      email,
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null,
      },
      parents: role === 'leader' ? [] : undefined, // Only leaders have "parents"
    });

    // add new trooper, using array operations
    if (newTrooperIds && newTrooperIds.length > 0) {
      updateData.trooperIds = Firestore.FieldValue.arrayUnion(...newTrooperIds);
    }

    // remove trooper, using array operations
    if (removeTrooperIds && removeTrooperIds.length > 0) {
      updateData.trooperIds = Firestore.FieldValue.arrayRemove(...removeTrooperIds);
    }
    
    return { message: 'User updated successfully' };
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};
  
const deleteUser = async (id) => {
  try {
    const ref = Firestore.collection('users').doc(id);
    await ref.delete();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};


module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

