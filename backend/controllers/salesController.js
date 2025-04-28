const db = require('../database/db');


// GET all sales
const getSales = (req, res) => {
    const sql = `
    SELECT sales.id, products.name AS product_name, users.email AS sold_by,
           sales.quantity, sale_price_per_unit, total_sale_price, timestamp
    FROM sales
    JOIN products ON sales.product_id = products.id
    JOIN users ON sales.user_id = users.id
    ORDER BY timestamp DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({message: 'Error fetching sales', error: err.message});
    res.json(rows);
  });
};

// POST new sale
const createSale = (req, res) => {
    const { product_id, quantity, sale_price_per_unit } = req.body;

    if (!product_id || !quantity || !sale_price_per_unit) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const total_sale_price = quantity * sale_price_per_unit;
    
    // Insert sale
    const sql = `
    INSERT INTO sales (product_id, user_id, quantity, sale_price_per_unit, total_sale_price)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [product_id, req.user.id, quantity, sale_price_per_unit, total_sale_price], function (err) {
        if (err) return res.status(500).json({ message: 'Error creating sale', error: err.message });

        // Update product quantity after sale
        const updateSql = `
        UPDATE products
        SET quantity = quantity - ?
        WHERE id = ?
        `;
        db.run(updateSql, [quantity, product_id], function (err2) {
        if (err2) return res.status(500).json({ message: 'Error updating product quantity', error: err2.message });

        res.status(201).json({ message: 'Sale recorded successfully', saleId: this.lastID });
        });
    });
};

module.exports = {
    getSales,
    createSale
};