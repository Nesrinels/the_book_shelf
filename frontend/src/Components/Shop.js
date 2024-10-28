import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, X } from 'lucide-react';
import apiService from '../services/api';
import { useCart } from '../contexts/CartContext';

const categories = ['All', 'Fiction', 'Romance', 'Dystopian', 'Fantasy', 'Historical Fiction', 'Adventure'];

const Notification = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg mt-14 shadow-lg flex items-center justify-between ${
    type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }`}>
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
      <X size={16} />
    </button>
  </div>
);

const BookCard = ({ book, setNotification }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();

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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[3/4]">
        <img
          src={book.fullImageUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/300/400";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600">By {book.author}</p>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{book.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-700">
            ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`p-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition-colors ${
                addingToCart ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart size={18} />
            </button>
            <button className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingBookCard = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md">
    <div className="relative aspect-[3/4] bg-gray-200 animate-pulse" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const ShopPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState(null);
  const { fetchCartItems } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await apiService.getAllBooks();
        setBooks(data);
      } catch (error) {
        setError(error?.message || 'Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'All') return true;
    return book.genre === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Books</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <LoadingBookCard />
              <LoadingBookCard />
              <LoadingBookCard />
              <LoadingBookCard />
            </>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard 
                key={book._id} 
                book={book} 
                setNotification={setNotification}
              />
            ))
          ) : (
            <p className="text-gray-600">No books found in this category.</p>
          )}
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;