const db = require("./db");

db.serialize(() => {
  console.log("Creating tables...");

  //creating the users table
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('admin', 'staff'))
        )
    `);

  //creating the products table
  db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT,
          quantity INTEGER NOT NULL DEFAULT 0,
          cost_price REAL NOT NULL,
          selling_price REAL NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

  //creating the transactions table
  db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          user_id INTEGER,
          quantity_change INTEGER,
          change_type TEXT NOT NULL CHECK(change_type IN ('in', 'out')),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id)
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

  console.log("Tables created successfully!");
});
