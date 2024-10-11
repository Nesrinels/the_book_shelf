const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET all books
router.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new book
router.post('/api/books', async (req, res) => {
  const { title, author, genre, price, description, publishedYear, pages, inStock } = req.body;
  const book = new Book({
    title,
    author,
    genre,
    price,
    description,
    publishedYear,
    pages,
    inStock,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
