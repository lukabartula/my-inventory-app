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

module.exports = {
  signupUser,
  loginUser
};
