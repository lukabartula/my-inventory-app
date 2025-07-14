const db = require('../database/db');

// GET total revenue and num of sales
const getRevenue = (req, res) => {
    const sql = `
        SELECT SUM(total_sale_price) as totalRevenue, COUNT(*) as totalSales FROM sales
    `;

    db.get(sql, [], (err, row) => {
        if (err) return res.status(500).json({message: 'Error fetching revenue.', error: err.message});
        res.json(row);
    });
};

// GET best selling products
const getBestProducts = (req, res) => {
    const sql = `
        SELECT products.name as productName, SUM(sales.quantity) as totalSold
        FROM sales
        JOIN products ON sales.product_id = products.id
        GROUP BY product_id
        ORDER BY totalSold DESC
        LIMIT 5
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({message: 'Error fetching best selling products.', error: err.message});
        res.json(rows);
    });
};

// GET monthly revenue
const getMonthlyRevenue = (req, res) => {
    const sql = `
        SELECT strftime('%Y-%m', timestamp) AS month, SUM(total_sale_price) as monthlyRevenue
        FROM sales
        GROUP BY month
        ORDER BY month
    `;

    db.all(sql, [], (err, rows) => {
        if(err) return res.status(500).json({message: 'Error fetching monthly revenues.', error: err.message});
        res.json(rows);
    });
};

const getSummaryStats = (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM products) AS totalProducts,
            (SELECT COUNT(*) FROM products WHERE quantity < 5) AS lowStockCount,
            (SELECT SUM(total_sale_price) FROM sales) AS totalRevenue,
            (SELECT COUNT(*) FROM sales) AS totalSales
    `;

    db.get(sql, [], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error fetching summary stats', error: err.message });
        res.json(row);
    });
};

const getLowStockProducts = (req, res) => {
  const sql = `
    SELECT id, name, sku, quantity
    FROM products
    WHERE quantity < 5
    ORDER BY quantity ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching low stock products.', error: err.message });
    res.json(rows);
  });
};

const getMonthlyProfit = (req, res) => {
  const sql = `
    SELECT 
      strftime('%Y-%m', sales.timestamp) AS month,
      SUM(sales.quantity * sales.sale_price_per_unit) AS totalRevenue,
      SUM(sales.quantity * products.cost_price) AS totalCost,
      SUM(sales.quantity * sales.sale_price_per_unit) - SUM(sales.quantity * products.cost_price) AS totalProfit
    FROM sales
    JOIN products ON sales.product_id = products.id
    GROUP BY month
    ORDER BY month;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to calculate monthly profit', error: err.message });
    }
    // Rename for frontend clarity
    const formatted = rows.map(row => ({
      month: row.month,
      monthlyProfit: row.totalProfit
    }));
    res.json(formatted);
  });
};



module.exports = {
    getRevenue,
    getBestProducts,
    getMonthlyRevenue,
    getSummaryStats,
    getLowStockProducts,
    getMonthlyProfit
};