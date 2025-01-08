const requireLogin = (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please log in to continue.' });
  }
  next(); // Proceed to the next middleware or controller
};


const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Permission denied. Insufficient role.' });
    }
    next(); // Proceed to the next middleware or controller
  };
};

module.exports = {
  checkRole,
  requireLogin
};