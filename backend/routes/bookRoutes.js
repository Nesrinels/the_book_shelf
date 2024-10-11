const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new books (single or multiple)
router.post('/', async (req, res) => {
  try {
    const books = req.body;

    // Check if the request is an array or a single object
    if (Array.isArray(books)) {
      // Validate that each book has the required fields (title, author, price)
      for (let book of books) {
        if (!book.title || !book.author || !book.price) {
          return res.status(400).json({ message: 'Title, author, and price are required for all books' });
        }
      }
      
      // Insert multiple books at once
      const newBooks = await Book.insertMany(books);
      res.status(201).json(newBooks);

    } else {
      const { title, author, genre, price, description, publishedYear, pages, inStock } = books;

      if (!title || !author || !price) {
        return res.status(400).json({ message: 'Title, author, and price are required' });
      }

      const book = new Book({
        title,
        author,
        genre,
        price,
        description,
        publishedYear,
        pages,
        inStock
      });

      const newBook = await book.save();
      res.status(201).json(newBook);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
