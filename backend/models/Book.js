const mongoose = require('mongoose');

// Define the schema for books
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // The title of the book is required
  },
  author: {
    type: String,
    required: true, // The author of the book is required
  },
  genre: {
    type: String, // Optional, to categorize books
  },
  price: {
    type: Number,
    required: true, // The price of the book is required
  },
  description: {
    type: String, // A short summary of the book
  },
  publishedYear: {
    type: Number, // Year the book was published
  },
  pages: {
    type: Number, // Number of pages in the book
  },
  inStock: {
    type: Boolean, // Indicates if the book is available for sale
    default: true, // Default is true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

// Create the model for books
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;