const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = require('../controllers/productController');
const isAdmin = require('../middleware/isAdmin');
  
  // Get all products (protected)
router.get('/', verifyToken, getProducts);

// Create a product (protected)
router.post('/', verifyToken, createProduct);

// Update a product (protected)
router.put('/:id', verifyToken, updateProduct);

// Delete a product (protected)
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
