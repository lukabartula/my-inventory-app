const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const {
    getTransactions,
    createTransaction
} = require('../controllers/transactionController');

// Get all transactions (protected)
router.get('/', verifyToken, getTransactions);

// Create a new transaction (protected)
router.post('/', verifyToken, createTransaction);

module.exports = router;
