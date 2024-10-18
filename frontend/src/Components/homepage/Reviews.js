import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/api/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const reviewData = await response.json();
        console.log('Fetched reviews:', reviewData);
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching review:', error.message);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews(); 
  }, []); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="w-full text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 text-lg font-semibold">{rating}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 relative overflow-hidden bg-white">
      <h2 className="text-3xl font-bold text-emerald-900 mb-8">What Customers Said</h2>
      
      <div className="relative">
        <div 
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-4"
              >
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex flex-col items-center text-center">
                    <Quote className="text-emerald-600 mb-4" size={40} />

                    <div className="mb-6">
                      {review.book && (
                        <div className="flex flex-col items-center">
                          <img
                            src={review.book.fyllImageUrl}
                            alt={review.book.title}
                            className="w-24 h-32 object-cover rounded-md mb-3"
                          />
                          <h4 className="text-lg font-semibold text-emerald-700">
                            {review.book.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            by {review.book.author}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 italic mb-6 text-lg">
                      {review.comment}
                    </p>
                    
                    <div className="mb-4">
                      {renderStars(review.rating)}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-emerald-900">
                        {review.user?.username || 'Anonymous'}
                      </h3>
                      <p className="text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;