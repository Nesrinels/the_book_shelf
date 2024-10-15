import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { ShoppingCart, Heart } from 'lucide-react';

const categories = ['All', 'Fiction', 'Romance', 'Dystopian', 'Fantasy', 'Historical Fiction', 'Adventure'];

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full pt-[150%]">
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
        <p className="text-2xl font-bold text-emerald-700 mb-4">
          ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
        </p>
      </div>
      <div className="p-4 bg-gray-50 space-y-2">
        <button className="w-full bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300">
          View Details
        </button>
        <div className={`flex space-x-2 mt-2 ${isHovered ? '' : 'opacity-0'} transition-opacity duration-300`}>
          <button className="w-full bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300 flex items-center justify-center">
            <ShoppingCart className="mr-1" size={16} />
          </button>
          <button className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition duration-300 flex items-center justify-center">
            <Heart className="mr-1" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingBookCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div className="relative w-full pt-[150%] bg-gray-200"/> 
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
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Function to filter books based on selected genre
  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'All') return true;
    return book.genre === selectedCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-6">Our Books</h1>

      {/* Genres Filter */}
      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-emerald-800 transition-colors`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

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
          filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopPage;
