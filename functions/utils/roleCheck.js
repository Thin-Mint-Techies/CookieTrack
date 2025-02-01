const admin = require('firebase-admin');
const xss = require('xss');

const requireLogin1 = (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in to continue.' });
  }
  next(); // Proceed to the next middleware or controller
};


const requireLogin = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in to continue.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken); //verify the login token
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token.' });
  }
};



//have not test
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Permission denied. Insufficient role.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};


//have not test
const checkUserOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    const { uid } = req.user;
    // remove xss if not needed or it's causing issues
    const userIdFromRequest = xss(req.params[userIdParam] || req.body[userIdParam]);

    if (!userIdFromRequest || uid !== userIdFromRequest) {
      return res.status(403).json({ success: false, message: 'Permission denied. You can only access your own data.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};

/** 
const verifyLoginIdToken = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid ID token');
  }
};
*/


module.exports = {
  checkRole,
  requireLogin,
  requireLogin1,
  checkUserOwnership
};