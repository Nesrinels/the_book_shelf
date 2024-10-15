import React, { useState } from 'react';
import { Book } from 'lucide-react';

const categories = [
  "Mystery", "Romance", "Science Fiction", "Fantasy", "Historical Fiction", "Thriller"
];

const BlindDate = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="bg-green-100 p-8 mt-8">
      <h2 className="text-3xl text-center font-bold mb-6 text-green-800">Blind Date with a Book</h2>
      <p className="mb-4 text-center text-green-700">Choose your category and get a surprise book recommendation!</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-4 rounded-lg flex items-center justify-center ${
              selectedCategory === category ? 'bg-green-500 text-white' : 'bg-white text-green-700 hover:bg-green-200'
            }`}
          >
            <Book className="mr-2" />
            {category}
          </button>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <p className="text-green-700">
            Great choice! We've selected a surprise {selectedCategory} book for you. 
            Visit our store to unwrap your blind date with a book!
          </p>
        </div>
      )}
    </div>
  );
};

export default BlindDate;