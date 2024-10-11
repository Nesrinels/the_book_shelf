import React , { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


// const books = [
//   {
//     id: 1,
//     title: 'The Great Gatsby',
//     author: 'F. Scott Fitzgerald',
//     price: 10.99,
//     description: 'A classic novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.',
//     image: '/api/placeholder/300/200'
//   },
//   {
//     id: 2,
//     title: 'To Kill a Mockingbird',
//     author: 'Harper Lee',
//     price: 7.99,
//     description: 'A deeply moving novel about racial injustice and moral growth in the American South.',
//     image: '/api/placeholder/300/200'
//   },
//   {
//     id: 3,
//     title: '1984',
//     author: 'George Orwell',
//     price: 8.99,
//     description: 'A dystopian novel that explores the dangers of totalitarianism and extreme political ideology.',
//     image: '/api/placeholder/300/200'
//   },
//   {
//     id: 4,
//     title: 'Pride and Prejudice',
//     author: 'Jane Austen',
//     price: 6.99,
//     description: 'A timeless love story that also critiques the societal expectations of the early 19th century.',
//     image: '/api/placeholder/300/200'
//   }
// ];  

const ShopPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async() => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
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
              src={book.image} 
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
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
