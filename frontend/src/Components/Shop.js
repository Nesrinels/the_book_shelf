import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const BookCard = ({ book }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div className="relative w-full pt-[150%]"> {/* This creates a 2:3 aspect ratio */}
    <img 
  src={book.imageUrl.startsWith('http') ? book.imageUrl : `http://localhost:3000${book.imageUrl}`} 
  alt={`Cover of ${book.title}`}
  className="absolute top-0 left-0 w-full h-full object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/api/placeholder/300/450";
  }}
/>

    </div>
    <div className="p-4 flex-grow">
      <h2 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
        {book.title}
      </h2>
      <p className="text-gray-600 mb-2">By {book.author}</p>
      <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {book.description}
      </p>
      <p className="text-2xl font-bold text-emerald-700">
        ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
      </p>
    </div>
    <div className="p-4 bg-gray-50">
      <button className="w-full bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300">
        View Details
      </button>
    </div>
  </div>
);

const LoadingBookCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div className="relative w-full pt-[150%] bg-gray-200"/> {/* Maintains 2:3 aspect ratio */}
    <div className="p-4 flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"/>
      <div className="h-8 bg-gray-200 rounded w-24"/>
    </div>
    <div className="p-4 bg-gray-50">
      <div className="h-10 bg-gray-200 rounded w-full"/>
    </div>
  </div>
);

const ShopPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await apiService.getAllBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Books</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill().map((_, index) => (
            <LoadingBookCard key={index} />
          ))
        ) : (
          books.map((book) => (
            <Link to={`/book/${book._id}`} key={book._id} className="block h-full">
              <BookCard book={book} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopPage;