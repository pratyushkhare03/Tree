import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('treeAuthToken'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in when app starts
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Checking authentication...');
          const response = await axios.get('http://localhost:5000/api/profile');
          setCurrentUser(response.data.user);
          console.log('User authenticated:', response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('treeAuthToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Signup function
  const signup = async (username, email, password) => {
    try {
      console.log('Attempting signup...');
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password
      });
      
      const { token: newToken, user } = response.data;
      localStorage.setItem('treeAuthToken', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      console.log('Signup successful:', user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });
      
      const { token: newToken, user } = response.data;
      localStorage.setItem('treeAuthToken', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      console.log('Login successful:', user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('treeAuthToken');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
