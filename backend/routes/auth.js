const express = require('express');
const User = require('../Models/User');
const Cart = require('../Models/Cart'); 
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
        return res.status(401).json({ message: 'Authentication required' });
      }
  
      const userId = req.params.userId || req.user._id; // Use the authenticated user's ID if no specific ID is provided
      
      const user = await User.findById(userId)
        .populate('booksRead.book')
        .populate('groups')
        .populate('following', 'username email')
        .populate('friends', 'username email')
        .select('-password');
        
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Now any authenticated user can view any profile
      res.json(user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      // Add debugging logs
      console.log('Authenticated user ID:', req.user._id);
      console.log('Target user ID:', req.params.userId);
      console.log('User role:', req.user.role);
      
      // Convert ObjectId to string for comparison if needed
      const authenticatedUserId = req.user._id.toString();
      const targetUserId = req.params.userId;

      // Check if the requesting user has permission to update this profile
      if (authenticatedUserId !== targetUserId && req.user.role !== 'admin') {
        console.log('Auth failed - authenticated user:', authenticatedUserId);
        console.log('Auth failed - target user:', targetUserId);
        console.log('Auth failed - user role:', req.user.role);
        return res.status(403).json({ 
          message: 'Unauthorized to update this profile',
          authenticatedUser: authenticatedUserId,
          targetUser: targetUserId,
          role: req.user.role
         });
      }

      // Remove sensitive fields from the update data
      const updateData = { ...req.body };
      delete updateData.password; // Prevent password update through this route
      delete updateData.role; // Prevent role update through this route


      const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password'); // Exclude password from response

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ 
        message: 'Error updating profile', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
},


deleteUser: async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the requesting user has permission to delete
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }

    // Find and delete the user's cart
    await Cart.findOneAndDelete({ user: userId });

    // Remove user from all groups
    await Group.updateMany(
      { members: userId },
      { $pull: { members: userId }}
    );

    // Remove user from other users' friends and following lists
    await User.updateMany(
      { $or: [{ friends: userId }, { following: userId }] },
      { 
        $pull: { 
          friends: userId,
          following: userId 
        }
      }
    );

    // Finally delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
},


getUser: async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password') // Exclude password
      .lean(); // Makes query faster by returning a plain JS object
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
},
updateReadingChallenge: async (req, res) => {
  try {
    const { userId } = req.params;
    const challengeData = req.body;

    // Verify user permissions
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update reading challenge' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { readingChallenge: challengeData } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser.readingChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

getLastYearBooks: async (req, res) => {
  try {
    const { userId } = req.params;
    const lastYear = new Date().getFullYear() - 1;

    const user = await User.findById(userId)
      .populate('booksRead.book')
      .select('booksRead');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter books read in the last year
    const lastYearBooks = user.booksRead.filter(book => {
      const readDate = new Date(book.dateRead);
      return readDate.getFullYear() === lastYear;
    });

    res.json(lastYearBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
// Get friends
getFriends: async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('friends', 'username email profilePicture bio') // Added bio field
      .select('friends');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Error fetching friends', error: error.message });
  }
},

// Add friend
addFriend: async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.body;

    // Check if users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if they're already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Users are already friends' });
    }

    // Add friend to both users (mutual friendship)
    user.friends.push(friendId);
    friend.friends.push(userId);

    // Also add to following
    if (!user.following.includes(friendId)) {
      user.following.push(friendId);
    }
    if (!friend.following.includes(userId)) {
      friend.following.push(userId);
    }

    await user.save();
    await friend.save();

    // Populate friend data before sending response
    const populatedUser = await User.findById(userId)
      .populate('friends', 'username email profilePicture bio')
      .select('friends');

    res.json({ 
      message: 'Friend added successfully',
      friends: populatedUser.friends
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Error adding friend', error: error.message });
  }
},

// Remove friend
removeFriend: async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Remove friend and following relationships from both users
    await User.findByIdAndUpdate(userId, {
      $pull: { 
        friends: friendId,
        following: friendId
      }
    });
    
    await User.findByIdAndUpdate(friendId, {
      $pull: { 
        friends: userId,
        following: userId
      }
    });

    // Get updated friends list
    const updatedUser = await User.findById(userId)
      .populate('friends', 'username email profilePicture bio')
      .select('friends');

    res.json({ 
      message: 'Friend removed successfully',
      friends: updatedUser.friends
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Error removing friend', error: error.message });
  }
},

// Get friend suggestions
getFriendSuggestions: async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get users who aren't already friends or being followed
    const suggestions = await User.find({
      _id: { 
        $nin: [...user.friends, ...user.following, userId] 
      }
    })
    .select('username email profilePicture bio')
    .limit(10); // Limit to 10 suggestions

    res.json(suggestions);
  } catch (error) {
    console.error('Error getting friend suggestions:', error);
    res.status(500).json({ message: 'Error getting friend suggestions', error: error.message });
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

    // Create a new cart for the user
    const cart = await Cart.create({ user: newUser._id });
    // Associate the cart with the user
    newUser.cart = cart._id;
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
      const adminId = 'admin';
      const token = jwt.sign({ userId: adminId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/users/:userId', authMiddleware, userController.getProfile);

router.put('/users/:userId', authMiddleware, userController.updateProfile);

router.delete('/users/:userId', authMiddleware, userController.deleteUser);
router.get('/user/:userId', authMiddleware, userController.getUser);
// Protected profile route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'This is your profile', userId: req.user });
});

router.put('/users/:userId/reading-challenge', authMiddleware, userController.updateReadingChallenge);
router.get('/users/:userId/last-year-books', authMiddleware, userController.getLastYearBooks);
router.get('/profile/:userId/friends', authMiddleware, userController.getFriends);
router.post('/users/:userId/friends', authMiddleware, userController.addFriend);
router.delete('/users/:userId/friends/:friendId', authMiddleware, userController.removeFriend);
router.get('/users/:userId/friend-suggestions', authMiddleware, userController.getFriendSuggestions);

module.exports = router;
