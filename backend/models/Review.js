const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', reviewSchema);