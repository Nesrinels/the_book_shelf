import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRemoving, setIsRemoving] = useState(null);
  const cartRef = useRef(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCartItems();
      setCartItems(response.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const removeItem = async (id) => {
    try {
      setIsRemoving(id);
      await apiService.removeFromCart(id);
      setCartItems(cartItems.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to remove item');
      console.error('Failed to remove item:', err);
    } finally {
      setIsRemoving(null);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    return isNaN(price) ? sum : sum + price;
  }, 0);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await apiService.checkout();
      setCartItems([]);
      setIsOpen(false);
    } catch (err) {
      setError('Checkout failed');
      console.error('Error during checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={cartRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            {loading && cartItems.length === 0 ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
                <button 
                  onClick={fetchCartItems}
                  className="block w-full mt-2 text-center text-red-600 hover:text-red-700 text-xs"
                >
                  Try again
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item._id} className="flex items-center gap-3 relative group">
                    <div className="w-16 h-20 overflow-hidden rounded bg-gray-100">
                      <img 
                        src={item.imageUrl || '/api/placeholder/100/150'} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/100/150';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">By {item.author}</p>
                      <p className="text-emerald-600 font-medium">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item._id)}
                      disabled={isRemoving === item._id}
                      className={`absolute top-0 right-0 p-1 transition-colors ${
                        isRemoving === item._id 
                          ? 'text-gray-400' 
                          : 'text-pink-500 hover:text-pink-700 opacity-0 group-hover:opacity-100'
                      }`}
                      aria-label="Remove item"
                    >
                      {isRemoving === item._id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full"/>
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to="/cart" 
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                      View Cart
                    </button>
                  </Link>
                  <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;