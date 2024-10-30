// CartContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      setError(null);
    }
  }, [isAuthenticated]);

  const handleApiError = useCallback((error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      setError('Please sign in to continue.');
      return;
    }

    setError(errorMessage);
    console.error('Cart Error:', error);
    return errorMessage;
  }, []);

  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCartItems();
      
      if (response?.data?.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  // Initialize cart when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated, fetchCartItems]);

  const removeItem = useCallback(async (id) => {
    if (!isAuthenticated) {
      const error = 'Please sign in to remove items';
      setError(error);
      return Promise.reject(new Error(error));
    }

    if (!id) {
      const error = 'Invalid item ID';
      setError(error);
      return Promise.reject(new Error(error));
    }

    try {
      setLoading(true);
      await apiService.removeFromCart(id);
      setCartItems(prev => prev.filter(item => item._id !== id));
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      return Promise.reject(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  const addItem = useCallback(async (item) => {
    if (!isAuthenticated) {
      const error = 'Please sign in to add items to cart';
      setError(error);
      return Promise.reject(new Error(error));
    }

    if (!item?._id) {
      const error = 'Invalid item data';
      setError(error);
      return Promise.reject(new Error(error));
    }

    try {
      setLoading(true);
      const response = await apiService.addToCart({
        bookId: item._id,
        quantity: 1,
        price: parseFloat(item.price)
      });
      console.log(response);

      if (response?.status === 200) {
        setCartItems(prev => {
          const existingItemIndex = prev.findIndex(cartItem => cartItem._id === item._id);
          
          if (existingItemIndex !== -1) {
            const updatedItems = [...prev];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
            };
            return updatedItems;
          }
          
          return [...prev, { ...item, quantity: 1 }];
        });
        
        setError(null);
        return true;
      }
      
      throw new Error('Failed to add item to cart');
    } catch (err) {
      const errorMessage = handleApiError(err);
      return Promise.reject(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  const checkout = useCallback(async () => {
    if (!isAuthenticated) {
      const error = 'Please sign in to checkout';
      setError(error);
      return Promise.reject(new Error(error));
    }

    if (cartItems.length === 0) {
      const error = 'Your cart is empty';
      setError(error);
      return Promise.reject(new Error(error));
    }

    try {
      setLoading(true);
      const response = await apiService.checkout();
      
      if (response?.data?.status === 'success') {
        setCartItems([]);
        setError(null);
        return response.data;
      }
      
      throw new Error('Checkout failed');
    } catch (err) {
      const errorMessage = handleApiError(err);
      return Promise.reject(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cartItems.length, handleApiError]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setError(null);
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => 
    count + (parseInt(item.quantity) || 1), 0);

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        loading,
        error,
        total,
        cartCount,
        fetchCartItems,
        removeItem,
        addItem,
        checkout,
        clearCart,
        clearError: () => setError(null)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};