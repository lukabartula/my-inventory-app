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
    const { sku, name, category, quantity, cost_price, selling_price } = req.body;

    if (!sku || !name || !quantity || !cost_price || !selling_price) {
        return res.status(400).json({ message: 'Required fields missing.' });
    }

    const checkSql = 'SELECT * FROM products WHERE sku = ?';
    db.get(checkSql, [sku], (err, existingProduct) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking existing product.', error: err.message });
        }

        if (existingProduct) {
            // Update the quantity of the existing product
            const updateSql = 'UPDATE products SET quantity = quantity + ? WHERE sku = ?';
            db.run(updateSql, [quantity, sku], function (updateErr) {
                if (updateErr) {
                    return res.status(500).json({ message: 'Error updating product quantity.', error: updateErr.message });
                }
                return res.status(200).json({ message: 'Product quantity updated successfully.' });
            });
        } else {
            // Insert a new product
            const insertSql = `
                INSERT INTO products (sku, name, category, quantity, cost_price, selling_price)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.run(insertSql, [sku, name, category, quantity, cost_price, selling_price], function (insertErr) {
                if (insertErr) {
                    return res.status(500).json({ message: 'Error creating product.', error: insertErr.message });
                }
                return res.status(201).json({ message: 'Product created successfully.', productId: this.lastID });
            });
        }
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