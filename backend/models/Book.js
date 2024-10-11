const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  pages: {
    type: Number,
    min: 1
  },
  inStock: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '/images/book-cover.jpg' // Default image
  }
}, {
  timestamps: true
});

// Virtual for full image URL
bookSchema.virtual('fullImageUrl').get(function() {
  if (this.imageUrl.startsWith('http')) {
    return this.imageUrl;
  }
  // Assuming your Express app serves the images under /images
  return `http://localhost:3000${this.imageUrl.replace('.', '')}`; // Replacing './' to match your Express static route
});

// Ensure virtuals are included when converting document to JSON
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
