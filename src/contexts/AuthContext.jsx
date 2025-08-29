import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('treeAuthToken'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Checking authentication...');
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
            console.log('User authenticated:', data.user);
          } else {
            throw new Error('Authentication failed');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('treeAuthToken');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const signup = async (username, email, password) => {
    try {
      console.log('Attempting signup...');
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      const { token: newToken, user } = data;
      localStorage.setItem('treeAuthToken', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      console.log('Signup successful:', user);
      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      const { token: newToken, user } = data;
      localStorage.setItem('treeAuthToken', newToken);
      setToken(newToken);
      setCurrentUser(user);
      
      console.log('Login successful:', user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('treeAuthToken');
    setToken(null);
    setCurrentUser(null);
    console.log('User logged out');
  };

  const value = {
    currentUser,
    token,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};