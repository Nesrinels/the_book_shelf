// src/components/BookReviews.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const BookReviews = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          apiService.getBookReviews(bookId),
          apiService.getBookReviewStats(bookId)
        ]);
        setReviews(reviewsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
        // Include the new review in the body of the POST request
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST', // Use POST to create a new review
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: bookId, // Pass the book ID
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const submittedReview = await response.json();
      setReviews(prevReviews => [submittedReview, ...prevReviews]); // Add the new review to the list
      setNewReview({ rating: 5, comment: '' }); // Reset form
      
      // Refresh stats
      const newStats = await apiService.getBookReviewStats(bookId);
      setStats(newStats);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Book Reviews</h2>
      
      {/* Review Stats */}
      {stats && (
        <div>
          <p>Average Rating: {stats.averageRating}</p>
          <p>Total Reviews: {stats.totalReviews}</p>
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmitReview}>
        <select
          value={newReview.rating}
          onChange={e => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
        >
          {[5, 4, 3, 2, 1].map(num => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
        
        <textarea
          value={newReview.comment}
          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Write your review..."
          required
        />
        
        <button type="submit">Submit Review</button>
      </form>

      {/* Reviews List */}
      <div>
        {reviews.map(review => (
          <div key={review._id}>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
            <p>By: {review.user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookReviews;