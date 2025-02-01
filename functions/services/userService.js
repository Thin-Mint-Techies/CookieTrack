const { Firestore } = require('../firebaseConfig');
require('dotenv').config();
const SECRET_CODE = process.env.SECRET_CODE;


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
        role, 
        trooperIds,
        contactDetail: {
          address: contactDetail?.address || null,
          phone: contactDetail?.phone || null
        },
      });
      return newUserRef.id;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
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

// Service to get a user by ID
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

// NEED A LOOK, make sure that role cannot be update
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
      throw new Error(`Error updating user: ${error.message}`);
    }
  };
  

// Service to delete a user by ID
const deleteUser = async (id) => {
  try {
    const ref = Firestore.collection('users').doc(id);
    await ref.delete();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};


// Combine createUser and updateUser into a single function
const createUserRevise = async ({ name, email, password, role, contactDetail, trooperIds = [], secretCode }) => {
  try {
    // Validate role and secret code
    if (role === 'leader' || role === 'manager') {
      if (secretCode !== SECRET_CODE) {
        throw new Error('Invalid secret code for elevated roles');
      }
    } else if (role !== 'parent') {
      throw new Error('Invalid role');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({ email, password });

    // Save user details in Firestore
    const newUserRef = Firestore.collection('users').doc(userRecord.uid);
    await newUserRef.set({
      name,
      email,
      role,
      trooperIds,
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
      parents: role === 'leader' ? [] : undefined, // Only leaders have "parents"
    });

    return { uid: userRecord.uid, email, role };
  } catch (error) {
    console.error('Error during user creation:', error);
    throw new Error('Failed to create user');
  }
};




////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
const registerUser = async ({ name, email, password, role, contactDetail, trooperIds = [], secretCode }) => {
  try {
    // Validate role and secret code
    if (role === 'leader' || role === 'manager') {
      if (secretCode !== SECRET_CODE) {
        throw new Error('Invalid secret code for elevated roles');
      }
    } else if (role !== 'parent') {
      throw new Error('Invalid role');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({ email, password });

    // Save user details in Firestore
    const newUserRef = Firestore.collection('users').doc(userRecord.uid);
    await newUserRef.set({
      name,
      email,
      role,
      trooperIds,
      contactDetail: {
        address: contactDetail?.address || null,
        phone: contactDetail?.phone || null
      },
      parents: role === 'leader' ? [] : undefined, // Only leaders have "parents"
    });

    return { uid: userRecord.uid, email, role };
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new Error('Failed to register user');
  }
};


const loginUser = async (email, password) => {
  try {
    // Fetch the user document from Firestore
    const userQuery = await Firestore.collection('users').where('email', '==', email).limit(1).get();

    if (userQuery.empty) {
      throw new Error('User not found');
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    // For Firebase Auth, you would typically use Firebase Authentication SDK on the client side
    
    // Generate a custom token (if needed)
    const customToken = await auth.createCustomToken(userDoc.id);

    // Return user details
    return { uid: userDoc.id, email: user.email, role: user.role, token: customToken };
  } catch (error) {
    console.error('Error during user login:', error);
    throw new Error('Failed to login user');
  }
};

const logoutUser = async () => {
  try {
    await auth().signOut(); 
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during user logout:', error);
    throw new Error('Failed to logout user');
  }
};



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

