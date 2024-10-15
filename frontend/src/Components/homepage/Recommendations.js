import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

const Recommendations = ({ genre }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recommendations based on the genre
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch books with the specific genre and limit to 4
        const response = await fetch(`http://localhost:3000/api/books/genre/${genre}?limit=4`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');

        const recommendationsData = await response.json();
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        setError('Could not fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (genre) {
      fetchRecommendations();
    }
  }, [genre]);

//   if (loading) {
//     return <div>Loading...</div>; // Optional: show a loading state
//   }

  if (error) {
    return <div>{error}</div>; // Display the error message
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
      <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">Recommended Books in {genre}</h3>
      <div className="grid grid-cols-2 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((book) => (
            <div key={book.id} className="bg-gray-100 rounded-lg shadow-sm p-4">
              <img src={book.fullImageUrl} alt={book.title} className="w-full h-40 object-cover rounded" />
              <h4 className="text-md font-semibold text-gray-800 mt-2">{book.title}</h4>
              <p className="text-sm text-gray-600">By {book.author}</p>
              <p className="text-green-600 font-bold mt-1">${book.price.toFixed(2)}</p>
              <div className="mt-2 flex space-x-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </button>
                <button className="bg-pink-100 text-pink-600 p-2 rounded-md">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No recommendations available.</p> // Handle case where no recommendations are found
        )}
      </div>
    </div>
  );
};

export default Recommendations;
