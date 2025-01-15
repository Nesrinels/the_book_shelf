import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, Loader2, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import apiService from '../../services/api';

const BooksManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    genre: '',
    publishedYear: '',
    pages: '',
    description: '',
    image: null,
    averageRating: 0,
    reviewsCount: 0,
    readers: [],
    inStock: true
  });
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBooks({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      setBooks(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({ ...book });
      setImagePreview(book.fullImageUrl);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        price: '',
        quantity: '',
        description: '',
        image: null
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      price: '',
      quantity: '',
      description: '',
      image: null
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create FormData object for multipart/form-data
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (editingBook) {
        await apiService.updateBook(editingBook.id, submitData);
      } else {
        await apiService.createBook(submitData);
      }
      fetchBooks();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        await apiService.deleteBook(bookId);
        fetchBooks();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const BookForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/300/400";
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                required
                min="0"
                step="0.01"
              />
            </div>
  
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                rows="3"
              />
            </div>
  
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'inStock',
                      value: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </label>
            </div>
          </div>
  
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  if (loading && !books.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books Management</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Book
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="w-full">
  <thead>
    <tr className="bg-gray-50">
      <th className="text-left p-4 font-medium text-gray-600">Image</th>
      <th className="text-left p-4 font-medium text-gray-600">Title</th>
      <th className="text-left p-4 font-medium text-gray-600">Author</th>
      <th className="text-left p-4 font-medium text-gray-600">Genre</th>
      <th className="text-left p-4 font-medium text-gray-600">Published</th>
      <th className="text-left p-4 font-medium text-gray-600">Price</th>
      <th className="text-left p-4 font-medium text-gray-600">Rating</th>
      <th className="text-left p-4 font-medium text-gray-600">Status</th>
      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredBooks.map((book) => (
      <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="p-4">
          <div className="w-16 h-20 rounded overflow-hidden">
              <img
                src={book.fullImageUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/100/150";
                }}
              />
          </div>
        </td>
        <td className="p-4">{book.title}</td>
        <td className="p-4">{book.author}</td>
        <td className="p-4">{book.genre}</td>
        <td className="p-4">{book.publishedYear}</td>
        <td className="p-4">${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}</td>
        <td className="p-4">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{(book.averageRating || 0).toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({book.reviewsCount || 0})</span>
          </div>
        </td>
        <td className="p-4">
          <span 
            className={`inline-flex px-2 py-1 rounded-full text-sm ${
              book.inStock
                ? "bg-emerald-100 text-emerald-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </td>
        <td className="p-4">
          <div className="flex gap-2">
            <button 
              onClick={() => openModal(book)}
              className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-green-50"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(book.id)}
              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-sm text-gray-700">
            Page {currentPage}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={filteredBooks.length < ITEMS_PER_PAGE}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <BookForm />}
    </div>
  );
};

export default BooksManagementPage;