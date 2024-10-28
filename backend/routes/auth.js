const express = require('express');
const User = require('../Models/User');
const Group = require('../Models/Group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Load environment variables
require('dotenv').config();

// Define user controller functions first
const userController = {
  getProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required ' });
      }
      const user = await User.findById(req.params.userId)
        .populate('booksRead.book')
        .populate('groups')
        .populate('following', 'username email')
        .populate('friends', 'username email')
        .select('-password');      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

       // Add null checks
       const requestingUserId = req.user._id ? req.user._id.toString() : null;
       const requestedUserId = req.params.userId;
 
       if (!requestingUserId || (requestingUserId !== requestedUserId && req.user.role !== 'admin')) {
         return res.status(403).json({ message: 'Unauthorized to view this profile' });
       }
 
       res.json(user);
     } catch (error) {
       console.error('Profile fetch error:', error);
       res.status(500).json({ message: 'Error fetching profile', error: error.message });
     }
   },

  updateProfile: async (req, res) => {
    try {
      // Check if the requesting user has permission to update this profile
      if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update this profile' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('Received login data:', req.body);
  const { email, password, role } = req.body;

  try {
    // Admin login check
    if (role === 'admin' && email === 'admin@example.com' && password === 'admin') {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token, message: 'Admin login successful' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for regular users after successful authentication
    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send back the token and a success message
    res.status(201).json({
      token,
      message: 'Login successful',
      data: { userId: user._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile routes - now userController is defined before these routes
router.get('/users/:userId', authMiddleware, userController.getProfile);
router.put('/users/:userId', authMiddleware, userController.updateProfile);


router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Protected profile route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'This is your profile', userId: req.user });
});

module.exports = router;