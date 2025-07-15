const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const {
    getTransactions,
    createTransaction,
    downloadTransactionsPDF
} = require('../controllers/transactionController');

// Get all transactions (protected)
router.get('/', verifyToken, getTransactions);

// Create a new transaction (protected)
router.post('/', verifyToken, createTransaction);

// Download transactions as PDF (protected)
router.get('/download/pdf', verifyToken, downloadTransactionsPDF);


module.exports = router;
