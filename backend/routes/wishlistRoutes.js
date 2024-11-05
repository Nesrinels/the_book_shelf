const express = require('express');
const router = express.Router();
const Wishlist = require('../Models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

// Get the wishlist for a specific user
router.get('/', authMiddleware, async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('user books');
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, books: [] });
        await wishlist.save();
      }
      res.json([wishlist]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Add a book to the wishlist
router.post('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { bookId } = req.body;
  
      let wishlist = await Wishlist.findOne({ user: userId }).populate('user books');
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId, books: [] });
        await wishlist.save();
  
        // Update the user's favorites field
        await User.findByIdAndUpdate(userId, { $push: { favorites: wishlist._id } });
      }
  
      if (!wishlist.books.map(b => b.toString()).includes(bookId)) {
        wishlist.books.push(bookId);
        await wishlist.save();
        res.status(200).json({ message: 'Book added to wishlist', wishlist });
      } else {
        res.status(200).json({ message: 'Book already in wishlist', wishlist });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Remove a book from the wishlist
router.delete('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { bookId } = req.body;

      // Find the wishlist for the user, create one if it doesn't exist
      let wishlist = await Wishlist.findOne({ user: userId }).populate('user books');
      if (!wishlist) {
        // Create a new wishlist if it doesn't exist
        wishlist = new Wishlist({ user: userId, books: [] });
        await wishlist.save();
      }

      // Check if the book exists in the wishlist
      const bookIndex = wishlist.books.findIndex(id => id.toString() === bookId);
      if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found in the wishlist' });
      }

      // Remove the book from the wishlist
      wishlist.books.splice(bookIndex, 1);
      await wishlist.save();

      // Return the updated wishlist
      res.status(200).json({ message: 'Book removed from wishlist', wishlist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
