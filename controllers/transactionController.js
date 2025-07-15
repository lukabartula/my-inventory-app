const db = require('../database/db');
const PDFDocument = require('pdfkit');

// GET all transactions
const getTransactions = (req, res) => {
    const sql = `
    SELECT transactions.id, product_id, name AS product_name, user_id, quantity_change, change_type, reason, timestamp
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
    const {product_id, quantity_change, change_type, reason} = req.body;

    if (!product_id || !quantity_change || !change_type) {
        return res.status(400).json({message: 'All fields required.'});
    }

    if (!['in', 'out'].includes(change_type)) {
        return res.status(400).json({message: 'Invalid change_type (must be "in" our "out").'});
    }

    // inserting into transactions
    const insertSql = `
    INSERT INTO transactions (product_id, user_id, quantity_change, change_type, reason)VALUES (?, ?, ?, ?, ?)
    `;
    db.run(insertSql, [product_id, req.user.id, quantity_change, change_type, reason], function(err) {
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

const downloadTransactionsPDF = (req, res) => {
  console.log('🔁 PDF download route hit');

  const sql = `
    SELECT transactions.id, products.name AS product_name, users.email AS user_email,
           quantity_change, change_type, reason, timestamp
    FROM transactions
    JOIN products ON transactions.product_id = products.id
    JOIN users ON transactions.user_id = users.id
    ORDER BY timestamp DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      if (!res.headersSent) {
        return res.status(500).json({ message: 'Failed to fetch transactions' });
      } else {
        res.end();
        return;
      }
    }

    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      doc.pipe(res);

      doc.fontSize(18).text('Transaction Report', { align: 'center' });
      doc.moveDown(1.5);

      const headers = ['ID', 'Product', 'User', 'Type', 'Qty', 'Reason', 'Timestamp'];
      const colWidths = [30, 70, 140, 50, 30, 80, 140];
      const startX = 30;
      let startY = 100;

      // Draw table headers
      doc.fontSize(10).font('Helvetica-Bold');
      headers.forEach((header, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(header, x, startY);
      });

      startY += 20;
      doc.moveTo(startX, startY - 5).lineTo(570, startY - 5).stroke();
      doc.font('Helvetica');

      // Draw rows
      rows.forEach((row, index) => {
        const data = [
          row.id,
          row.product_name,
          row.user_email,
          row.change_type,
          row.quantity_change,
          row.reason || '—',
          new Date(row.timestamp).toLocaleString()
        ];

        data.forEach((text, i) => {
          const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.text(String(text), x, startY, { width: colWidths[i] - 4 });
        });

        startY += 18;

        // Start new page if near bottom
        if (startY > 750) {
          doc.addPage();
          startY = 100;

          // Redraw header on new page
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
      console.log('✅ PDF sent successfully');
    } catch (e) {
      console.error('❌ PDF generation error:', e);
      if (!res.headersSent) {
        res.status(500).send('Failed to generate PDF');
      } else {
        res.end();
      }
    }
  });
};



module.exports = {
    getTransactions,
    createTransaction,
    downloadTransactionsPDF
};