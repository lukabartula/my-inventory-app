const express = require('express');
const router = express.Router();

// Import the controller that handles user logic
const { signupUser, loginUser } = require('../controllers/userController');

// Route: POST /api/users/signup
router.post('/signup', signupUser);

// Route: POST /api/users/login
router.post('/login', loginUser);

// Export the router so server.js can use it
module.exports = router;
