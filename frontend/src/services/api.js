// src/services/api.js

import axios from 'axios';
import API_URL from '../config/api';

// Create axios instance with config URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      // You might want to redirect to login or refresh token here
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth & Books
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get('/books');
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  getBookById: async (id) => {
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  // Reviews
  getAllReviews: async () => {
    try {
      const response = await axiosInstance.get('/reviews');
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  getBookReviews: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  getUserReviews: async (userId) => {
    try {
      const response = await axiosInstance.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  createReview: async ({ bookId, rating, comment }) => {
    try {
      const response = await axiosInstance.post('/reviews', {
        book: bookId,
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  updateReview: async (reviewId, { rating, comment }) => {
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}`, {
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  getBookReviewStats: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/reviews/stats/${bookId}`);
      return response.data;
    } catch (error) {
      throw apiService.handleError(error);
    }
  },

  // Error Handler
  handleError: (error) => {
    const errorResponse = {
      message: 'An unexpected error occurred',
      status: 500,
      data: null
    };

    if (error.response) {
      // Server responded with error
      errorResponse.status = error.response.status;
      errorResponse.message = error.response.data.message || 'Server error';
      errorResponse.data = error.response.data;
    } else if (error.request) {
      // Request made but no response
      errorResponse.status = 503;
      errorResponse.message = 'Service unavailable';
    } else {
      // Error in request setup
      errorResponse.status = 400;
      errorResponse.message = error.message || 'Bad request';
    }

    return errorResponse;
  }
};

export default apiService;