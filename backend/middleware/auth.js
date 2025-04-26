const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers['authorization'];

  // 2. If no header, deny access
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 3. Extract the token from the "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // 4. Verify the token
    const secretKey = 'secretkey'; // ⚡ Later, use process.env.JWT_SECRET
    const decoded = jwt.verify(token, secretKey);

    // 5. Attach the decoded payload to request
    req.user = decoded; // decoded will have user id and role

    next(); // 6. Pass control to the next middleware/controller
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
