const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  address:{
    type: String,
    required: true,
  },
  profilePicture:{
    type: String,
    default:"https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
  },
  bio: {
    type: String,
    maxLength: 500
  },
  readingChallenge: {
    year: Number,
    goal: Number,
    current: Number
  },
  lastYearBooks: {
    year: Number,
    count: Number
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  booksRead: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    dateRead: Date,
    rating: Number
  }],
  currentlyReading: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    startDate: Date,
    progress: Number
  }],

  role: { 
    type: String, 
    enum: ['user', 'admin'],  
    default: 'user'           
  },
  favorites:[
    { type:mongoose.Types.ObjectId,
    ref:"books",
  }],
  cart:[
    { type:mongoose.Types.ObjectId,
    ref:"books",
  }],
  orders:[
    { type:mongoose.Types.ObjectId,
    ref:"order",
  }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Only hash password if modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to update password (if necessary)
userSchema.methods.updatePassword = async function(newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
