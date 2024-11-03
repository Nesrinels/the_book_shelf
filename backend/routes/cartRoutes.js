const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const Book = require('../Models/Book');
const auth = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        
        const  {bookId} = req.body.book;
        
        
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: 'User not authenticated' });
        // }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
                totalAmount: 0
            });
        }
        
        const existingItemIndex = cart.items.findIndex(
            item => item.book.toString() === bookId
        );
        
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
        
        // Calculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.subtotal, 0);
        
        await cart.save();
        await cart.populate('items.book', 'title author price imageUrl');
        
        res.status(200).json(cart);
        
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            message: 'Failed to add item to cart',
            error: error.message 
        });
    }
});

// Get cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.book', 'title author price imageUrl');

        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch cart',
            error: error.message 
        });
    }
});


// Remove item from cart
router.delete('/remove/:bookId', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Ensure items array exists
        if (!cart.items) {
            return res.status(404).json({ message: 'No items found in cart' });
        }

        // Filter out the item to be removed
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.book.toString() !== req.params.bookId);
        
        // Check if an item was actually removed
        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Book not found in cart' });
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.subtotal, 0);
        
        await cart.save();
        await cart.populate('items.book', 'title author price imageUrl');
        
        res.status(200).json(cart);
        
    } catch (error) {
        console.error('Delete from cart error:', error);
        res.status(500).json({ 
            message: 'Failed to remove item from cart',
            error: error.message 
        });
    }
});


module.exports = router;