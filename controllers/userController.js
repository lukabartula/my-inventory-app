const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Register new user
const signupUser = (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  // Simple validation
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert into DB
  const sql = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [first_name, last_name, email, hashedPassword, role], function (err) {
    if (err) {
      return res.status(500).json({ message: 'User creation failed', error: err.message });
    }

    res.status(201).json({ message: 'User created', userId: this.lastID });
  });
};

// Login existing user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '24h' });

    res.json({ message: 'Login successful', token });
  });
};

// Get all users (admin only)
const getAllUsers = (req, res) => {
  const sql = 'SELECT id, first_name, last_name, email, role FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    res.json(rows);
  });
};

// Update user by ID
const updateUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, role } = req.body;

  const sql = `
    UPDATE users
    SET first_name = ?, last_name = ?, email = ?, role = ?
    WHERE id = ?
  `;
  db.run(sql, [first_name, last_name, email, role, id], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to update user', error: err.message });
    res.json({ message: 'User updated successfully' });
  });
};

// Delete user by ID
const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to delete user', error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?';
  db.get(sql, [id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Failed to get user', error: err.message });
    res.json(user);
  });
};


module.exports = {
  signupUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
};
