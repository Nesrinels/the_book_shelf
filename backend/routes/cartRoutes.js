const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const Book = require('../Models/Book');
const auth  = require('../middleware/authMiddleware');


// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
      const { bookId } = req.body;
      

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      // Get user's cart (you'll need to implement your own logic based on your setup)
      let cart = await Cart.findOne({ user: req.user.id }); // Assuming you have authentication
      
      if (!cart) {
        cart = new Cart({
          user: req.user.id,
          items: [],
          totalAmount: 0
        });
      }
      
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.book.toString() === bookId);
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += 1;
        cart.items[existingItemIndex].subtotal =
            cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
      } else {
        cart.items.push({
          book: bookId,
          quantity: 1,
          price: book.price,
          subtotal: book.price
        });
      }
      
      await cart.save();

      await cart.populate('items.book', 'title author price imageUrl');

      res.status(200).json(cart);
      
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ message: 'Failed to add item to cart' });
    }
  });
  
  // Get cart
  router.get('/', auth, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.book', 'title author price imageUrl');
      
      if (!cart) {
        return res.status(200).json({ items: [], totalAmount: 0 });
      }
      
      res.status(200).json(cart);
      
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  });
  
  router.delete('/remove/:bookId', auth, async (req, res) => {
    try {
      const cart = await Cart.findOne(
        { userId: req.user.id },
      );
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = cart.items.filter(
        item => item.book.toString() !== req.params.bookId
      );
      
      await cart.save();

      await cart.populate('items.book', 'title author price imageUrl');
      
      res.status(200).json(cart);
      
    } catch (error) {
      console.error('Delete from cart error:', error);
      res.status(500).json({ message: 'Failed to remove item from cart' });
    }
  });

  // Update item quantity
router.put('/update/:bookId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(
            item => item.book.toString() === req.params.bookId
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        item.subtotal = item.price * quantity;
        
        await cart.save();
        await cart.populate('items.book', 'title author price imageUrl');
        
        res.status(200).json(cart);

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Failed to update cart' });
    }
});
  module.exports = router;