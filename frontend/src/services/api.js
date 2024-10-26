import axios from 'axios';

// Ensure API_URL is properly defined
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Initialize request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken'); // Match the token key with your signin page
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Initialize response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          this.clearAuth();
          // Use window.location.replace for smoother redirect
          window.location.replace('/login');
          return Promise.reject(this.handleError(error));
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  setAuth(token, userId, role) {
    localStorage.setItem('authToken', token);
    if (userId) localStorage.setItem('userId', userId);
    if (role) localStorage.setItem('userRole', role);
  }

  handleError(error) {
    let errorResponse = {
      message: 'An unexpected error occurred',
      status: 500,
      data: null,
    };

    if (error.response) {
      // Server responded with error
      errorResponse = {
        message: error.response.data?.message || 'Server error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      errorResponse = {
        message: 'Unable to reach the server. Please check your connection.',
        status: 503,
        data: null,
      };
    } else {
      // Request setup error
      errorResponse = {
        message: error.message || 'Request failed',
        status: 400,
        data: null,
      };
    }

    console.error('[API Error]:', errorResponse);
    return errorResponse;
  }

  // Auth endpoints
  async login(credentials) {
    try {
      const response = await this.client.post('/auth/login', credentials);
      if (response.token) {
        const { token, user } = response;
        this.setAuth(token, user?.id, user?.role);
      }
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      return await this.client.post('/auth/register', userData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    this.clearAuth();
    // Use replace for smoother redirect
    window.location.replace('/login');
  }

  // Book endpoints
  async getAllBooks(params = {}) {
    try {
      return await this.client.get('/books', { params });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBookById(id) {
    try {
      return await this.client.get(`/books/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Review endpoints
  async createReview(reviewData) {
    try {
      return await this.client.post('/reviews', {
        bookId: reviewData.bookId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cart endpoints
  async addToCart(bookId, quantity = 1) {
    try {
      return await this.client.post('/cart/add', { bookId, quantity });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCartItems() {
    try {
      return await this.client.get('/cart');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeFromCart(bookId) {
    try {
      return await this.client.delete(`/cart/${bookId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCartItem(bookId, quantity) {
    try {
      return await this.client.put(`/cart/${bookId}`, { quantity });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check auth status
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getUserRole() {
    return localStorage.getItem('userRole');
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;