import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';
import { Star, ShoppingCart, Heart} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function BookProductPage() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();
  const [notification, setNotification] = useState(null);

  const { addItem: addToWishlist, removeItem: removeFromWishlist, wishlistItems } = useWishlist();

  const isInWishlist = wishlistItems.some((item) => item._id === book._id);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist) {
        await removeFromWishlist(book._id);
        setNotification({
          message: 'Removed from wishlist!',
          type: 'success'
        });
      } else {
        await addToWishlist(book);
        setNotification({
          message: 'Added to wishlist!',
          type: 'success'
        });
      }
    } catch (error) {
      setNotification({
        message: error?.message || 'Failed to update wishlist. Please try again later.',
        type: 'error'
      });
    }
  };


  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart) return;

    setAddingToCart(true);
    try {
      await addItem({
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.fullImageUrl,
      });

      setNotification({
        message: 'Successfully added to cart!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: error?.message || 'Failed to add to cart. Please try again later.',
        type: 'error'
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Fetch the book details based on the ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await apiService.getBookById(id); // Fetch the book data by ID
        console.log("Fetched book data:", data);
        setBook(data.data);
      } catch (err) {
        setError('Failed to fetch the book. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewData = await apiService.getReviewsByBookId(id);
        setReviews(reviewData.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchBook();
    fetchReviews();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2">
          <img
            src={book.fullImageUrl}
            alt={`Cover of ${book.title}`}
            style={{ width: '530px', height: 'auto' }}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="w-full lg:w-1/2 lg:pl-8 mt-4 lg:mt-0">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 text-lg mb-4">By {book.author}</p>
          <p className="text-gray-500 mb-4">{book.description}</p>
          <p className="text-2xl font-bold text-emerald-700 mb-6">${book.price}</p>
          <button 
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="bg-emerald-700 text-white py-2 px-4 rounded-lg mr-2">
            <ShoppingCart size={18} className="inline-block mr-2" /> Add to Cart
          </button>
          <button
        onClick={handleAddToWishlist}
        className={`bg-pink-600 text-white py-2 px-4 rounded-lg ${
          isInWishlist ? 'hover:bg-pink-700' : 'hover:bg-pink-700'
        }`}
      >
        <Heart size={18} className="inline-block mr-2" />{' '}
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-t pt-4 mt-4">
                  <p className="font-semibold">{review.user.username}</p>
                  <div className="flex items-center mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 w-5 h-5" />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}