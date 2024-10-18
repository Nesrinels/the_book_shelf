const express = require('express');
const router = express.Router();
const Review = require('../Models/Review');
const Book = require ('./../models/Book');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


//Get all reviews
router.get('/', async (req, res) => {
    try{
        const reviews = await Review.find()
        .populate('user', 'username')
        .populate('book', 'title author imageUrl')
        .sort({ createdAt: -1});
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

// Post (create) a new review
router.post('/', authMiddleware, async (req, res) => {
    const {bookId, rating, comment} = req.body;
    //making sure all fields are provided 
    if (!bookId || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        //we should check if the book exists 
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        //Create new review
        const review = new Review({
            user: req.user._id,
            book: bookId,
            rating,
            comment,
        });
        //save the review
        await review.save();
        res.status(201).json({ message: 'Review Posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//Update a review 

router.patch('/id/:id', authMiddleware, async (req, res) => {

    try {
        const { id } = req.params;
        const updates = req.body;

        // Find the review by ID and update it
        const updatedReview = await Review.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update review', error });
    }
});

module.exports = router;