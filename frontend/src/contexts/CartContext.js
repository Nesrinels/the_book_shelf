import React, { createContext, useContext, useState, useCallback } from 'react';
import apiService from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const removeItem = async (id) => {
    try {
      await apiService.removeFromCart(id);
      setCartItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to remove item');
      console.error('Failed to remove item:', err);
      throw err;
    }
  };

  const addItem = async (item) => {
    try {
      await apiService.addToCart(item);
      setCartItems([...cartItems, item]);
    } catch (err) {
      setError('Failed to add item');
      console.error('Failed to add item:', err);
      throw err;
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      await apiService.checkout();
      setCartItems([]);
    } catch (err) {
      setError('Checkout failed');
      console.error('Error during checkout:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    return isNaN(price) ? sum : sum + price;
  }, 0);

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        loading,
        error,
        total,
        fetchCartItems,
        removeItem,
        addItem,
        checkout
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