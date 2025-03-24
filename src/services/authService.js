import fetchApi from './api';

const authService = {
  // Login user
  login: async (username, password) => {
    console.log('Attempting login with:', { username });
    
    try {
      // Ensure we're making a POST request to the correct endpoint
      const response = await fetchApi('/auth/login/', 'POST', { 
        username, 
        password 
      }, { 
        skipAuth: true,  // Important: don't add auth headers to login request
        skipCache: true  // Don't cache auth requests
      });
      
      console.log('Login response:', response);
      
      // Store tokens properly
      if (response.access) {
        localStorage.setItem('token', response.access);
      }
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      // Rethrow with more context
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },
  
  // Register user
  register: async (userData) => {
    try {
      const response = await fetchApi('/auth/register/', 'POST', userData, { skipAuth: true });
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    // If your backend requires a logout API call
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await fetchApi('/auth/logout/', 'POST', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Remove tokens regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
  
  // Reset password request
  requestPasswordReset: async (email) => {
    try {
      const response = await fetchApi('/auth/password-reset/', 'POST', { email }, { skipAuth: true });
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },
  
  // Confirm password reset
  confirmPasswordReset: async (token, password) => {
    try {
      const response = await fetchApi('/auth/password-reset/confirm/', 'POST', { 
        token, 
        password 
      }, { skipAuth: true });
      return response;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  },
  
  // Change password (authenticated)
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await fetchApi('/auth/password/change/', 'POST', {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 