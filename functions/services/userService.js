const { Firestore } = require('../firebaseConfig');
require('dotenv').config();
const SECRET_CODE = process.env.SECRET_CODE;
const auth = require('../firebaseConfig').auth;


const registerUser = async ({ name, email, role, secretCode, password, phone }) => {
  try {
    // check for secret code for elevated roles
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

    // Save user details in Firestore, the docId is the uid of the user
    const newUserRef = Firestore.collection('users').doc(userRecord.uid);
    await newUserRef.set({
      name,
      email,
      phone,
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

const updateUser = async (id, { name, email, phone}) => {
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
      phone
    });

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

const attachRoleAsCustomClaim = async (userId) => {
  try {
    const userRef = Firestore.collection('users').doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }

    const userData = userSnapshot.data();
    const { role } = userData;

    if (!role) {
      throw new Error('Role not found in user data');
    }

    // Attach custom claim
    await auth.setCustomUserClaims(userId, { role });

    // Remove role field from Firestore document
    await userRef.update({
      role: admin.firestore.FieldValue.delete(),
    });

    return { message: 'Role attached as custom claim and removed from Firestore document' };
  } catch (error) {
    throw new Error(`Error attaching role as custom claim: ${error.message}`);
  }
};


module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  attachRoleAsCustomClaim
};

