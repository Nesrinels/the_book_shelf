const express = require('express');
const router = express.Router();
const Review = require('../Models/Review');
const authMiddleware = require('../middleware/authMiddleware');

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username') // Assuming user has username field
            .populate('book', 'title author') // Assuming book has title and author fields
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reviews for a specific book
router.get('/book/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate('user', 'username')
            .populate('book', 'title author')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reviews by a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId })
            .populate('book', 'title author')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new review (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const existingReview = await Review.findOne({
          user: req.user._id,  // Ensure req.user._id exists
          book: req.body.book
        });
    
        if (existingReview) {
          return res.status(400).json({ message: 'You have already reviewed this book' });
        }
    
        const review = new Review({
          user: req.user._id,  // Use the user from the middleware
          book: req.body.book,
          rating: req.body.rating,
          comment: req.body.comment
        });
    
        const newReview = await review.save();
        res.status(201).json(newReview);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

// Update a review (only by the review author)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the author of the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only edit your own reviews' });
        }

        // Update only allowed fields
        if (req.body.rating) review.rating = req.body.rating;
        if (req.body.comment) review.comment = req.body.comment;

        const updatedReview = await review.save();
        await updatedReview.populate('user', 'username');
        await updatedReview.populate('book', 'title author');

        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a review (by review author or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is review author or admin
        const isAdmin = req.user.role === 'admin'; // Adjust based on your admin check
        if (review.user.toString() !== req.user._id.toString() && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get review statistics for a book
router.get('/stats/:bookId', async (req, res) => {
    try {
        const stats = await Review.aggregate([
            { $match: { book: req.params.bookId } },
            { 
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingCounts: {
                        $push: '$rating'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    averageRating: { $round: ['$averageRating', 1] },
                    totalReviews: 1,
                    ratingDistribution: {
                        1: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 1] } } } },
                        2: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 2] } } } },
                        3: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 3] } } } },
                        4: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 4] } } } },
                        5: { $size: { $filter: { input: '$ratingCounts', as: 'rating', cond: { $eq: ['$$rating', 5] } } } }
                    }
                }
            }
        ]);

        res.json(stats[0] || { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
