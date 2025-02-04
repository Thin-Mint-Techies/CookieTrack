const admin = require('firebase-admin');
const { Firestore } = require('../firebaseConfig');
const xss = require('xss');


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

//working
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {

    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken); 
    req.user = decodedToken;

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

// use doc accessId array
// have not test
const checkUserOwnershipRef = (collectionName, docIdParam = 'id') => {
  return async (req, res, next) => {
    const { uid } = req.user;
    const docId = req.params[docIdParam] || req.body[docIdParam];

    if (!docId) {
      return res.status(403).json({ success: false, message: 'Permission denied. Invalid document ID.' });
    }

    try {
      const doc = await Firestore.collection(collectionName).doc(docId).get();
      if (!doc.exists) {
        return res.status(403).json({ success: false, message: 'Permission denied. Document not found.' });
      }

      const docData = doc.data();
      const accessIds = docData.accessId || [];

      if (!accessIds.includes(uid)) {
        return res.status(403).json({ success: false, message: 'Permission denied. You do not have access to this document.' });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error('Error checking document ownership:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
};

// use user refId array
const checkUserOwnership = (userIdParam = 'userId', itemType) => {
  return async (req, res, next) => {
    const { uid } = req.user;
    const itemIdFromRequest = xss(req.params[userIdParam] || req.body[userIdParam]);

    if (!itemIdFromRequest) {
      return res.status(403).json({ success: false, message: 'Permission denied. Invalid item ID.' });
    }

    try {
      const userDoc = await Firestore.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(403).json({ success: false, message: 'Permission denied. User not found.' });
      }

      const userData = userDoc.data();
      const itemIds = userData[`${itemType}Ids`] || [];

      if (!itemIds.includes(itemIdFromRequest)) {
        return res.status(403).json({ success: false, message: `Permission denied. You do not own this ${itemType}.` });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error('Error checking user ownership:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
};


module.exports = {
  checkRole,
  requireLogin,
  checkUserOwnership
};