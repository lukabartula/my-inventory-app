const db = require('../database/db');
const PDFDocument = require('pdfkit');


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

const downloadSalesPDF = (req, res) => {
  console.log('🔁 PDF sales route hit');

  const sql = `
    SELECT sales.id, products.name AS product_name, users.email AS sold_by,
           sales.quantity, sale_price_per_unit, total_sale_price, timestamp
    FROM sales
    JOIN products ON sales.product_id = products.id
    JOIN users ON sales.user_id = users.id
    ORDER BY timestamp DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      if (!res.headersSent) {
        return res.status(500).json({ message: 'Failed to fetch sales' });
      } else {
        res.end();
        return;
      }
    }

    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=sales.pdf');

      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      doc.pipe(res);

      doc.fontSize(18).text('Sales Report', { align: 'center' });
      doc.moveDown(1.5);

      const headers = ['ID', 'Product', 'Qty', 'Price/Unit', 'Total', 'Sold By', 'Timestamp'];
      const colWidths = [30, 70, 30, 60, 50, 140, 120];
      const startX = 30;
      let startY = 100;

      doc.fontSize(10).font('Helvetica-Bold');
      headers.forEach((header, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(header, x, startY);
      });

      startY += 20;
      doc.moveTo(startX, startY - 5).lineTo(570, startY - 5).stroke();
      doc.font('Helvetica');

      rows.forEach((row, index) => {
        const data = [
          row.id,
          row.product_name,
          row.quantity,
          `$${row.sale_price_per_unit.toFixed(2)}`,
          `$${row.total_sale_price.toFixed(2)}`,
          row.sold_by,
          new Date(row.timestamp).toLocaleString()
        ];

        data.forEach((text, i) => {
          const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.text(String(text), x, startY, { width: colWidths[i] - 4 });
        });

        startY += 18;

        if (startY > 750) {
          doc.addPage();
          startY = 100;

          doc.font('Helvetica-Bold');
          headers.forEach((header, i) => {
            const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.text(header, x, startY);
          });
          startY += 20;
          doc.moveTo(startX, startY - 5).lineTo(570, startY - 5).stroke();
          doc.font('Helvetica');
        }
      });

      doc.end();
      console.log('✅ PDF sales sent');
    } catch (e) {
      console.error('❌ PDF generation error:', e);
      if (!res.headersSent) {
        res.status(500).send('Failed to generate sales PDF');
      } else {
        res.end();
      }
    }
  });
};


module.exports = {
    getSales,
    createSale,
    downloadSalesPDF
};