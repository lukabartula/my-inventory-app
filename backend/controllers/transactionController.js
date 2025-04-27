const db = require('../database/db');

// GET all transactions
const getTransactions = (req, res) => {
    const sql = `
    SELECT transactions.id, product_id, name AS product_name, user_id, quantity_change, change_type, timestamp
    FROM transactions
    JOIN products ON transactions.product_id = products.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({message: 'Error fetching transactions.', error: err.message});
        }
        res.json(rows);
    });
};

// POST new transaction
const createTransaction = (req, res) => {
    const {product_id, quantity_change, change_type} = req.body;

    if (!product_id || !quantity_change || !change_type) {
        return res.status(400).json({message: 'All fields required.'});
    }

    if (!['in', 'out'].includes(change_type)) {
        return res.status(400).json({message: 'Invalid change_type (must be "in" our "out").'});
    }

    // inserting into transactions
    const insertSql = `
    INSERT INTO transactions (product_id, user_id, quantity_change, change_type)VALUES (?, ?, ?, ?)
    `;
    db.run(insertSql, [product_id, req.user.id, quantity_change, change_type], function(err) {
        if (err) return res.status(500).json({message: 'Error creating transaction', error: err.message});

        // updating product quantity
        const updateSql = `
        UPDATE products
        SET quantity = quantity + ?
        WHERE id = ?
        `;

        const qtyChange = change_type === 'in' ? quantity_change : -quantity_change;
        db.run(updateSql, [qtyChange, product_id], function (err2) {
            if (err2) return res.status(500).json({message: 'Error updating product quantity.', error: err.message});

            res.status(201).json({message: 'Transaction logged successfully.'});
        });
    });
};

module.exports = {
    getTransactions,
    createTransaction
};