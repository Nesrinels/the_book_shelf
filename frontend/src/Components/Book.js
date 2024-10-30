import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api'; // Assuming you have a service to call your backend
import { Star, ShoppingCart, Heart} from 'lucide-react';

export default function BookProductPage() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the book details based on the ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await apiService.getBookById(id); // Fetch the book data by ID
        console.log("Fetched book data:", data);
        setBook(data);
      } catch (err) {
        setError('Failed to fetch the book. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
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
    <div className="min-h-screen bg-gray-50 py-10 mt-16">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-shrink-0 lg:w-1/2">
            <img
              src={book.fullImageUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full rounded-lg shadow-lg object-cover"
              style={{ maxHeight: '800px' }} // Adjust max height to make image larger
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">By {book.author}</p>

            <div className="flex items-center mb-4">
              {[...Array(book.rating)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-6 h-6 text-yellow-500" />
              ))}
              <span className="ml-3 text-lg text-gray-500">({book.reviewsCount} Reviews)</span>
            </div>

            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{book.description}</p>
            <p className="text-emerald-700 text-3xl font-semibold mb-8">${book.price}</p>

            <div className="flex space-x-4">
              <button className="px-6 py-3 rounded-lg bg-emerald-700 text-white font-medium text-lg flex items-center space-x-2 hover:bg-emerald-800 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="px-6 py-3 rounded-lg bg-pink-600 text-white font-medium text-lg flex items-center space-x-2 hover:bg-pink-700 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}