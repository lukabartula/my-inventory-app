express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const { getSales, createSale, downloadSalesPDF } = require('../controllers/salesController');

// get all sales
router.get('/',verifyToken, getSales);

// create new sale
router.post('/', verifyToken, createSale);

// Download sales as PDF (protected)
router.get('/download/pdf', verifyToken, downloadSalesPDF);

module.exports = router;