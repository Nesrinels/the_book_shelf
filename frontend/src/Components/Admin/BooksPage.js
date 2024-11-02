import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBooks();
      setBooks(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchBooks} 
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books Management</h1>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Book
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Book Inventory</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                Filter
              </button>
              <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-600">Title</th>
                <th className="text-left p-4 font-medium text-gray-600">Author</th>
                <th className="text-left p-4 font-medium text-gray-600">ISBN</th>
                <th className="text-left p-4 font-medium text-gray-600">Price</th>
                <th className="text-left p-4 font-medium text-gray-600">Quantity</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.isbn}</td>
                  <td className="p-4">${book.price}</td>
                  <td className="p-4">{book.quantity}</td>
                  <td className="p-4">
                    <span 
                      className={`inline-flex px-2 py-1 rounded-full text-sm ${
                        book.quantity > 0
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.quantity > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 text-emerald-600 hover:text-emerald-700 border border-emerald-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 border border-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BooksManagementPage;