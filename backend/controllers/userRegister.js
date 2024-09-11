const db = require('../config/dbconnections');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const InsertUser = (req, res) => {
  const { username, number, password, passwordConfirm } = req.body;

  // Check if the password and password confirmation match
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Password and password confirmation do not match' });
  }

  // Check if the username already exists in the database
  const checkUsernameQuery = 'SELECT * FROM login WHERE username = ?';
  db.query(checkUsernameQuery, [username], (error, usernameResults) => {
    if (error) throw error;

    if (usernameResults.length > 0) {
      // Username already exists, return an error
      return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
    }

    // Email and username are unique, proceed with hashing the password and registration
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) throw err;

      const insertUserQuery = 'INSERT INTO login (username,  number, password, password_changed) VALUES (?, ?, ?, ?)';
      db.query(insertUserQuery, [username, number, hashedPassword, 0], (error, result) => {
        if (error) throw error;

        // Redirect to /login after successful registration
        res.status(200).json({ message: 'Account registered successfully', redirect: '/login'});
      });
    });
  });
};

module.exports = { InsertUser };
