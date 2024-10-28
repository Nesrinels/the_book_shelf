const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    maxLength: 1000
  },
  coverImage: {
    type: String,
    default: "https://example.com/default-group-cover.jpg"  // Replace with your default image
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentBook: {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    startDate: Date,
    endDate: Date,
    discussionDate: Date
  },
  readingHistory: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    startDate: Date,
    endDate: Date,
    completed: Boolean
  }],
  discussions: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    messages: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  rules: [{
    type: String,
    trim: true
  }],
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ createdBy: 1 });

// Method to check if a user is a member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if a user is an admin
groupSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member && member.role === 'admin';
};

// Method to add a new member
groupSchema.methods.addMember = async function(userId, role = 'member') {
  if (!this.isMember(userId)) {
    this.members.push({
      user: userId,
      role: role
    });
    await this.save();
  }
};

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;