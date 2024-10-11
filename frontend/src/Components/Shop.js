import React , { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';



const ShopPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async() => {
      try {
        const data = await apiService.getAllBooks();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
        console.error('Error fetching books: ', err);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return(
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center'>loading books...</p>
      </div>
    );
  }

  if (error) {
    return(
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link to={`/book/${book._id}`} key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img 
              src={book.image || '/api/placeholder/300/200'} 
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">By {book.author}</p>
              <p className="text-gray-600 mb-4">{book.description}</p>
              <p className="text-2xl font-bold text-emerald-700">${book.price}</p>
            </div>
            <div className="p-4 bg-gray-50">
              <button className="w-full bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800 transition duration-300">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
