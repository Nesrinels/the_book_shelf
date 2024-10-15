const express = require('express');
const router = express.Router();
const Book = require('../models/Book');  // Make sure the path to your model is correct
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
router.get('/id/:id', async (req, res) => {
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
    description: req.body.description,
    publishDate: req.body.publishDate,
    pageCount: req.body.pageCount,
    genre: req.body.genre,
    isbn: req.body.isbn
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a book (admin only)
router.patch('/id/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.body.title != null) {
      book.title = req.body.title;
    }
    if (req.body.author != null) {
      book.author = req.body.author;
    }
    if (req.body.description != null) {
      book.description = req.body.description;
    }
    if (req.body.publishDate != null) {
      book.publishDate = req.body.publishDate;
    }
    if (req.body.pageCount != null) {
      book.pageCount = req.body.pageCount;
    }
    if (req.body.genre != null) {
      book.genre = req.body.genre;
    }
    if (req.body.isbn != null) {
      book.isbn = req.body.isbn;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book (admin only)
router.delete('/id/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
