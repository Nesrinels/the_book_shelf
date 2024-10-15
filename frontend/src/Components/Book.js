import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api'; // Assuming you have a service to call your backend
import { Star} from 'lucide-react';

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
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8 mt-20">
      {/* Book details UI goes here */}
      <div className="md:w-1/2">
        <img src={book.fullImageUrl} alt={book.title} className="w-full rounded-lg shadow-lg" />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(book.rating)].map((_, i) => (
              <Star key={i} fill="currentColor" className="w-5 h-5" />
            ))}
          </div>
          <span className="ml-2 text-gray-600">({book.reviewsCount} Reviews)</span>
        </div>
        <div className="text-gray-700">
          {book.description}
        </div>
        <div className="text-2xl font-bold text-emerald-600 mt-4">
          ${book.price}
        </div>
      </div>
    </div>
  );
}
