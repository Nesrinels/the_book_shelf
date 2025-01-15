const express = require('express');
const router = express.Router();
const Book = require('../Models/Book');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes (no authentication required)

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET books by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const books = await Book.find({ genre: req.params.genre }); // Assuming 'genre' is a field in your Book schema
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found for this genre' });
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (authentication and admin permissions required)

// POST new books (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const book = new Book({
    title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      price: req.body.price,
      description: req.body.description,
      publishedYear: req.body.publishedYear,
      pages: req.body.pages,
      inStock: req.body.inStock,
      imageUrl: req.body.imageUrl,
      averageRating: req.body.averageRating || 0, 
      readers: req.body.readers || [], 
      reviewsCount: req.body.reviewsCount || 0, 
    });


  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a book (admin only)
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    Object.keys(req.body).forEach((key) => {
      if (book[key] !== undefined) {
        book[key] = req.body[key];
      }
    });


    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
