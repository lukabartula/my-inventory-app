const db = require('../database/db');

// GET all products
const getProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({message: 'Error fetching products.', error: err.message});
        res.json(rows);
    });
};

// POST new product
const createProduct = (req, res) => {
    const {name, category, quantity, cost_price, selling_price} = req.body;

    if (!name || !quantity || !cost_price || !selling_price) {
        return res.status(400).json({message: 'Required fields missing.'});
    }

    const sql = 'INSERT INTO products (name, category, quantity, cost_price, selling_price) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [name, category, quantity, cost_price, selling_price], function (err) {
        if (err) return res.status(500).json({ message: 'Error creating product.', error: err.message});
        res.status(201).json({message: 'Product created successfully.', productId: this.lastID});
    });
};

//PUT update a product
const updateProduct = (req, res) => {
    const {id} = req.params;
    const {name, category, quantity, cost_price, selling_price} = req.body;

    const sql = `
    UPDATE products
    SET name = ?, category = ?, quantity = ?, cost_price = ?, selling_price = ?
    WHERE id = ?
    `;
    db.run(sql, [name, category, quantity, cost_price, selling_price, id], function (err) {
        if (err) return res.status(500).json({message: 'Error updating product.', error: err.message});
        res.json({ message: 'Product updated successfully' });
    });
};

//DELETE deleting a product
const deleteProduct = (req, res) => {
    const { id } = req.params;
  
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) return res.status(500).json({ message: 'Error deleting product', error: err.message });
      res.json({ message: 'Product deleted successfully' });
    });
};

module.exports = {
    getProducts,
    updateProduct,
    deleteProduct,
    createProduct
};