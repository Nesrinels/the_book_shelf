import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          // Parse and validate the token
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const tokenExpiry = decodedToken.exp * 1000; // Convert to milliseconds

          if (tokenExpiry > Date.now()) {
            setIsAuthenticated(true);
            setUser({
              id: decodedToken.id,
              role: decodedToken.role,
              // Add any other user data from token as needed
            });
          } else {
            // Token expired, clean up
            handleLogout();
          }
        } catch (error) {
          console.error('Token parsing error:', error);
          handleLogout();
        }
      } else {
        // No token found
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      console.log(response);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        setIsAuthenticated(true);
        setUser({
          id: decodedToken.id,
          role: decodedToken.role,
          // Add any other user data you need
        });
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Propagate error to be handled in the component
    }
  };

  const logout = () => {
    handleLogout();
    // Optional: Navigate to signin page can be handled by the router in the component
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};