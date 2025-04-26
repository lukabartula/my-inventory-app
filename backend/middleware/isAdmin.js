const isAdmin = (req, res, next) => {
    // req.user should already exist because verifyToken ran before
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin → continue
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  
  module.exports = isAdmin;
  