const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userController = {
  // Registration function
  registerUser: async (req, res) => {
    const { username, password, role } = req.body;

    try {
      // Check if the user already exists
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const user = await User.create({
        username,
        password: hashedPassword,
        role: role || 'User', // Default role: User
      });

      res.status(201).json({
        id: user._id,
        username: user.username,
        role: user.role,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error during registration', error: err.message });
    }
  },

  // Authentication function
loginUser : async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Ensure these fields are sent in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token and user details in the response
    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }

}};

module.exports = userController;
