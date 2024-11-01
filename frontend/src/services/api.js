import axios from 'axios';
import API_URL from '../config/api';

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
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(this.handleError(error))
        );

        // // Initialize response interceptor
        // this.client.interceptors.response.use(
        //     (response) => response.data,
        //     async (error) => {
        //         if (error.response?.status === 401) {
        //             this.clearAuth();
        //             window.location.replace('/signin');
        //             return Promise.reject(this.handleError(error));
        //         }
        //         return Promise.reject(this.handleError(error));
        //     }
        // );
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
            errorResponse = {
                message: error.response.data?.message || 'Server error',
                status: error.response.status,
                data: error.response.data,
            };
        } else if (error.request) {
            errorResponse = {
                message: 'Unable to reach the server. Please check your connection.',
                status: 503,
                data: null,
            };
        } else {
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
            console.log(credentials);
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
        window.location.replace('/login');
    }

    // Cart endpoints with authentication check
    async addToCart(book ) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please sign in to add items to cart');
            }
            const userId = localStorage.getItem('userId');
            return await this.client.post('/cart/add', { book, userId});
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getCartItems() {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please sign in to view cart');
            }
            return await this.client.get('/cart');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async removeFromCart(bookId) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please sign in to remove items from cart');
            }
            return await this.client.delete(`/cart/remove/${bookId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateCartItem(bookId, quantity) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please sign in to update cart');
            }
            return await this.client.put(`/cart/update/${bookId}`, { quantity });
        } catch (error) {
            throw this.handleError(error);
        }
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
            if (!this.isAuthenticated()) {
                throw new Error('Please sign in to create a review');
            }
            return await this.client.post('/reviews', {
                bookId: reviewData.bookId,
                rating: reviewData.rating,
                comment: reviewData.comment,
            });
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getReviewsByBookId(bookId) {
        try {
            return await this.client.get(`/reviews`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getProfile(){
        try {
            const userId = localStorage.getItem('userId');
            return await this.client.get(`/users/${userId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    } 
    // Auth status checks
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