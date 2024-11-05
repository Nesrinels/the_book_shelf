// WishlistContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Clear wishlist when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setWishlistItems([]);
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
    console.error('Wishlist Error:', error);
    return errorMessage;
  }, []);

  const fetchWishlistItems = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getWishlist();
      
      if (response?.data?.items) {
        setWishlistItems(response.data.items);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  // Initialize wishlist when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistItems();
    }
  }, [isAuthenticated, fetchWishlistItems]);

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
      const response = await apiService.removeFromWishlist(id);
      
      if (response?.data?.success || response.status === 200) {
        setWishlistItems(prev => prev.filter(item => {
          const itemId = item.book?._id || item._id;
          return itemId !== id;
        }));
        setError(null);
        return true;
      }
      throw new Error('Failed to remove item');
    } catch (err) {
      const errorMessage = handleApiError(err);
      return Promise.reject(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  const addItem = useCallback(async (item) => {
    if (!isAuthenticated) {
      const error = 'Please sign in to add items to wishlist';
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
      const response = await apiService.addToWishlist(item._id);
      
      if (response?.status === 200) {
        setWishlistItems(prev => {
          const existingItemIndex = prev.findIndex(wishlistItem => wishlistItem._id === item._id);
          
          if (existingItemIndex !== -1) {
            return prev;
          }
          
          return [...prev, item];
        });
        
        setError(null);
        return true;
      }
      
      throw new Error('Failed to add item to wishlist');
    } catch (err) {
      const errorMessage = handleApiError(err);
      return Promise.reject(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, handleApiError]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    setError(null);
  }, []);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider 
      value={{
        wishlistItems,
        loading,
        error,
        wishlistCount,
        fetchWishlistItems,
        removeItem,
        addItem,
        clearWishlist,
        clearError: () => setError(null)
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};