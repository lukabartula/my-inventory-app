express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const { getSales, createSale } = require('../controllers/salesController');

// get all sales
router.get('/',verifyToken, getSales);

// create new sale
router.post('/', verifyToken, createSale);

module.exports = router;