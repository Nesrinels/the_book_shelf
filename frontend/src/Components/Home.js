import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// BookCarousel component (unchanged)
const BookCarousel = ({ books }) => {
  const [startIndex, setStartIndex] = useState(0);

  const nextBook = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const prevBook = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  };

  return (
    <div className="relative w-full bg-emerald-600 p-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">Featured Books</h2>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out" style={{
            transform: `translateX(-${startIndex * (100 / books.length)}%)`,
            width: `${books.length * 100}%`
          }}>
            {books.map((book, index) => (
              <div key={index} className="w-1/5 px-2 flex-shrink-0">
                <div className="bg-emerald-700 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <img src={book.imageUrl} alt={book.title} className="w-full h-64 object-cover rounded-md mb-4" />
                  <h3 className="text-white text-lg font-semibold truncate">{book.title}</h3>
                  <p className="text-gray-400 text-sm">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={prevBook} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-colors duration-200"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button 
          onClick={nextBook} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-colors duration-200"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
};

// Home component
function Home() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:3000/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading books...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <h1 className="text-3xl font-bold text-center my-8">Welcome to Our Book Collection</h1>
      {books.length > 0 ? (
        <BookCarousel books={books} />
      ) : (
        <p className="text-center py-10">No books available at the moment.</p>
      )}
      {/* You can add more content to your home page here */}
    </div>
  );
}

export default Home;