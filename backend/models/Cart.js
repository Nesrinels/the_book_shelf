const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to calculate subtotal and total amount before saving
cartSchema.pre('save', function(next) {
  // Calculate subtotal for each item
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  // Calculate total amount
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(bookId, quantity = 1) {
  const book = await mongoose.model('Book').findById(bookId);
  if (!book) throw new Error('Book not found');
  
  const existingItem = this.items.find(item => item.book.toString() === bookId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.subtotal = existingItem.price * existingItem.quantity;
  } else {
    this.items.push({
      book: bookId,
      quantity: quantity,
      price: book.price,
      subtotal: book.price * quantity
    });
  }
  
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(bookId) {
  this.items = this.items.filter(item => item.book.toString() !== bookId.toString());
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function(bookId, quantity) {
  const item = this.items.find(item => item.book.toString() === bookId.toString());
  if (!item) throw new Error('Item not found in cart');
  
  item.quantity = quantity;
  item.subtotal = item.price * quantity;
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalAmount = 0;
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;