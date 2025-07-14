const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin'); 

// Import the controller that handles user logic
const { 
    signupUser, 
    loginUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById
} = require('../controllers/userController');

// Route: POST /api/users/signup
router.post('/signup', signupUser);

// Route: POST /api/users/login
router.post('/login', loginUser);

// Admin-only routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// Export the router so server.js can use it
module.exports = router;
