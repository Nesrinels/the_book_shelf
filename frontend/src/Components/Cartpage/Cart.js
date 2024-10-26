import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const CartItem = ({ item, onRemove, isRemoving }) => (
  <div className="flex items-center gap-3 relative group">
    <div className="w-16 h-20 overflow-hidden rounded bg-gray-100">
      <img 
        src={item.fullImageUrl || '/api/placeholder/100/150'} 
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
        ${Number(item.price).toFixed(2)}
      </p>
    </div>
    <button 
      onClick={() => onRemove(item._id)}
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
);

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
    }`}>
      {message}
    </div>
  );
};

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);
  const [notification, setNotification] = useState(null);
  const cartRef = useRef(null);
  
  const {
    cartItems = [],
    loading,
    error,
    total = 0,
    fetchCartItems,
    removeItem,
    checkout
  } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchCartItems().catch(() => {
      showNotification('error', 'Failed to load cart items');
    });
  }, [fetchCartItems]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) return;

    try {
      setIsRemoving(itemId);
      await removeItem(itemId);
      showNotification('success', 'Item removed from cart');
      await fetchCartItems();
    } catch (error) {
      showNotification('error', 'Failed to remove item');
    } finally {
      setIsRemoving(null);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      showNotification('success', 'Checkout successful!');
      setIsOpen(false);
    } catch (error) {
      showNotification('error', 'Checkout failed');
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

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"/>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
                <button 
                  onClick={fetchCartItems}
                  className="block w-full mt-2 text-center text-red-600 hover:text-red-700 text-xs"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && cartItems.length === 0 && (
              <p className="text-center text-gray-500 py-4">Your cart is empty</p>
            )}

            {!loading && !error && cartItems.length > 0 && (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {cartItems.map(item => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onRemove={handleRemoveItem}
                      isRemoving={isRemoving}
                    />
                  ))}
                </div>

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
                      <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
                        View Cart
                      </button>
                    </Link>
                    <button 
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors text-sm font-medium"
                    >
                      {loading ? 'Processing...' : 'Checkout'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;