const { auth, Firestore } = require('../config/firebaseConfig');

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing or invalid' });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    // Fetch user role from Firestore
    const userDoc = await Firestore.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) return res.status(403).json({ error: 'User does not exist' });

    req.user.role = userDoc.data().role; // Attach role to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
}

function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}


/**
 * Registers a new user and saves role-based data to Firestore.
 * 
 * @param {Object} userData - User details.
 * @returns {Object} - Newly created user information.
 */
const registerUser = async (userData) => {
  const { email, password, role } = userData;

  if (!email || !password || !role) {
    throw new Error('Missing required fields: email, password, or role');
  }

  if (!['parent', 'leader'].includes(role)) {
    throw new Error('Invalid role. Role must be either "parent" or "leader"');
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({ email, password });

    // Save user details in Firestore
    const userRef = Firestore.collection('users').doc(userRecord.uid);
    await userRef.set({
      email,
      role,
      parents: role === 'leader' ? [] : undefined, // Only leaders have "parents"
    });

    return { uid: userRecord.uid, email, role };
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new Error('Failed to register user');
  }
};


/**
 * Logs in a user and fetches role-based data.
 * 
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Object} - User data and role-based information.
 */
const loginUser = async (email, password) => {
  try {
    // Fetch the user document from Firestore
    const userQuery = await Firestore.collection('users').where('email', '==', email).limit(1).get();

    if (userQuery.empty) {
      throw new Error('User not found');
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Role-based response
    if (userData.role === 'parent') {
      return {
        uid: userId,
        email: userData.email,
        role: 'parent',
        message: 'Parent login successful',
      };
    } else if (userData.role === 'leader') {
      // Fetch parents under the leader
      const parents = await Promise.all(
        (userData.parents || []).map(async (parentId) => {
          const parentDoc = await Firestore.collection('users').doc(parentId).get();
          return parentDoc.exists ? { id: parentId, ...parentDoc.data() } : null;
        })
      );

      return {
        uid: userId,
        email: userData.email,
        role: 'leader',
        parents: parents.filter((parent) => parent !== null),
        message: 'Leader login successful',
      };
    } else {
      throw new Error('Invalid role assigned');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error(error.message || 'Login failed');
  }
};


module.exports = { registerUser, loginUser, authenticateToken, authorizeRole };
