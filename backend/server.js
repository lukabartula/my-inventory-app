// backend/server.js

// Load core dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Loading route files
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const productRoutes = require('./routes/productRoutes'); 
const transactionRoutes = require('./routes/transactionRoutes');

// Initialize Express app
const app = express();

// Port (can be set via .env or fallback to 5000)
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());               // Allows frontend (React) to call backend
app.use(express.json());       // Parses JSON in requests

// Route mounting
app.use('/api/users', userRoutes);  // Everything in userRoutes is prefixed with /api/users
app.use('/api/products', productRoutes); // Everything in productRoutes is prefixed with /api/products
app.use('/api/transactions', transactionRoutes);
app.use('/api/test', testRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Inventory Backend API is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
