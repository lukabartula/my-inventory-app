const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const { getRevenue, getBestProducts, getMonthlyRevenue, getSummaryStats } = require('../controllers/analyticsController');

// all protected
router.get('/revenue', verifyToken, getRevenue);
router.get('/best-products', verifyToken, getBestProducts);
router.get('/monthly-revenue', verifyToken, getMonthlyRevenue);
router.get('/summary', verifyToken, getSummaryStats);

module.exports = router;