const { Firestore } = require('../config/firebaseConfig');

// Secret code for elevated roles
const SECRET_CODE = '123';

// Service to create a new user
const createUser = async ({ name, email, role, contactDetail, trooperIds = [], secretCode }) => {
    try {
      // Validate role and secret code
      if (role === 'leader' || role === 'manager') {
        if (secretCode !== SECRET_CODE) {
          throw new Error('Invalid secret code for elevated roles');
        }
      } else if (role !== 'parent') {
        throw new Error('Invalid role');
      }
  
      // Role is set here and cannot be changed later
      const newUserRef = Firestore.collection('users').doc();
      await newUserRef.set({
        name,
        email,
        role, // Role is locked here
        trooperIds,
        contactDetail: {
          address: contactDetail?.address || null,
          phone: contactDetail?.phone || null,
        },
      });
      return newUserRef.id;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  };
  
// Service to get all users
const getAllUsers = async () => {
  try {
    const snapshot = await Firestore.collection('users').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No users found');
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

// Service to get a user by ID
const getUserById = async (id) => {
  try {
    const doc = await Firestore.collection('users').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    throw new Error('User not found');
  } catch (error) {
    throw new Error('Error fetching user');
  }
};

const updateUser = async (id, { name, email, trooperIds, contactDetail }) => {
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
        trooperIds,
        contactDetail: {
          address: contactDetail?.address || null,
          phone: contactDetail?.phone || null,
        },
      });
      return { message: 'User updated successfully' };
    } catch (error) {
      throw new Error('Error updating user');
    }
  };
  

// Service to delete a user by ID
const deleteUser = async (id) => {
  try {
    const ref = Firestore.collection('users').doc(id);
    await ref.delete();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting user');
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
