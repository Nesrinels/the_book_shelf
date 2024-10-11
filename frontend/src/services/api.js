// src/services/api.js

import axios from 'axios';
import API_URL from '../config/api';

const apiService = {
  getAllBooks: async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add more API methods as needed
};

export default apiService;