import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import {Link} from 'react-router-dom';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      price: 10.99, 
      image: '/api/placeholder/100/150' 
    },
    { 
      id: 2, 
      title: '1984', 
      author: 'George Orwell', 
      price: 13.99, 
      image: '/api/placeholder/100/150' 
    },
    { 
      id: 3, 
      title: 'Anna Karenina', 
      author: 'Leo Tolstoy', 
      price: 13.49, 
      image: '/api/placeholder/100/150' 
    }
  ]);


  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative">
      {/* Cart Toggle Button - Styled to match navbar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
          {cartItems.length}
        </span>
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 relative">
                    <div className="w-16 h-20 overflow-hidden rounded">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </h3>
                      <p className="text-emerald-600 font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-0 right-0 p-1 text-pink-500 hover:text-pink-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-800">Total = </span>
                  <span className="font-bold text-gray-800">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                    <Link to='/cart'>
                  <button className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
                    View Cart
                  </button>
                  </Link>
                  <button className="flex-1 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors text-sm font-medium">
                    Checkout
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