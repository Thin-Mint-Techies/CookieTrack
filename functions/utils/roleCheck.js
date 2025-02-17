const admin = require('firebase-admin');
const { Firestore } = require('../firebaseConfig');
const xss = require('xss');


// Working, next will pass the req.user to the next middleware, token is decoded
const requireLogin = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in to continue.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken); //verify the login token
    req.user = decodedToken;
    //console.log('decodedToken:', decodedToken);
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token.' });
  }
};

//inital version of checkrole
const checkRoleInit = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Permission denied. Insufficient role.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ status: false, message: 'Permission denied. No role found.' });
    }
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ status: false, message: 'Permission denied. Insufficient role.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};

//working
/** 
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    // if there are no auth headers, return an error
    if(!req.headers.authorization) {
      return res.status(403).json({ status: false, message: 'No authorization header' });
    }

    // get the token from the header
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken); 
    req.user = decodedToken;

    // if there is no user or role, return an error
    if (!req.user || !req.user.role) {
      return res.status(403).json({ status: false, message: 'Permission denied. No role found.' });
    }
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ status: false, message: 'Permission denied. Insufficient role.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};
*/


// use doc ownerId, for multiple doc
// have not test
// might need to refactor
const checkUserOwnership = (collectionName, docIdParam = 'id') => {
  return async (req, res, next) => {
    const { uid } = req.user;
    const docIds = req.params[docIdParam] || req.body[docIdParam];

    if (!docIds) {
      return res.status(403).json({ success: false, message: 'Permission denied. Invalid document ID.' });
    }

    // check for multiple doc
    const docIdArray = Array.isArray(docIds) ? docIds : [docIds];

    try {
      for (const docId of docIdArray) {
        const doc = await Firestore.collection(collectionName).doc(docId).get();
        if (!doc.exists) {
          return res.status(403).json({ success: false, message: 'Permission denied. Document not found.' });
        }

        const docData = doc.data();
        const accessIds = docData.ownerId;

        if (!accessIds.includes(uid)) {
          return res.status(403).json({ success: false, message: 'Permission denied. You do not have access to this document.' });
        }
      }
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error('Error checking document ownership:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
};


module.exports = {
  checkRole,
  requireLogin,
  checkUserOwnership
};