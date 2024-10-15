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
    default: '/images/1984.jpeg' // Default image
  }
}, {
  timestamps: true
});

// Virtual for full image URL
bookSchema.virtual('fullImageUrl').get(function() {
  // If the imageUrl is already an absolute URL (like from a CDN or remote server)
  if (this.imageUrl.startsWith('http')) {
    return this.imageUrl;
  }
  // Otherwise, assume it's a local image hosted on your server
  return `http://localhost:3000${this.imageUrl}`; // No need to replace dots here
});

// Ensure virtuals are included when converting the document to JSON or an object
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);