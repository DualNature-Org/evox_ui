// Base API configuration
// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'http://15.207.21.176:8000/api';
const API_TIMEOUT = 8000; // 8 seconds timeout

// Add a global flag to prevent multiple login redirects
let isRedirectingToLogin = false;

// Add a request cache to the top of the file
const requestCache = {
  cache: new Map(),
  pendingRequests: new Map(),
  
  // Set a cached response with expiration time (default 60 seconds)
  set(key, data, ttl = 60000) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  },
  
  // Get a cached response if not expired
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  // Clear cache for a specific key or all cache if no key provided
  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.pendingRequests.delete(key);
    } else {
      this.cache.clear();
      this.pendingRequests.clear();
    }
  },
  
  // Check if a request is already pending
  isPending(key) {
    return this.pendingRequests.has(key);
  },
  
  // Set a pending request
  setPending(key, promise) {
    this.pendingRequests.set(key, promise);
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
    return promise;
  },
  
  // Get a pending request
  getPending(key) {
    return this.pendingRequests.get(key);
  }
};

// Helper function to perform the redirect to login only once
const redirectToLogin = () => {
  if (isRedirectingToLogin) return;
  
  isRedirectingToLogin = true;
  console.log('Redirecting to login page due to authentication failure');
  
  // Get the current path for the returnTo parameter
  const currentPath = window.location.pathname + window.location.search;
  const returnTo = encodeURIComponent(currentPath);
  
  // Check if we're already on a login-related page to prevent loops
  const isLoginPage = window.location.pathname.includes('/login') || 
                      window.location.pathname.includes('/register') ||
                      window.location.pathname.includes('/forgot-password') ||
                      window.location.pathname.includes('/reset-password');
  
  if (!isLoginPage) {
    window.location.href = `/login?returnTo=${returnTo}`;
  } else {
    console.log('Already on a login-related page, not redirecting');
    // Reset the flag so future redirects can happen when needed
    setTimeout(() => { isRedirectingToLogin = false; }, 3000);
  }
};

// Add a function to generate a cache key
const generateCacheKey = (endpoint, method, data) => {
  return `${method}:${endpoint}:${data ? JSON.stringify(data) : ''}`;
};

// Flag to prevent multiple token refresh attempts at once
let isRefreshing = false;
let refreshPromise = null;

// Queue of requests waiting for token refresh
const waitingRequests = [];

// Function to refresh the token
const refreshToken = async () => {
  // Prevent multiple refresh attempts
  if (isRefreshing) {
    return refreshPromise;
  }
  
  isRefreshing = true;
  
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    console.log('Attempting to refresh authentication token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    
    refreshPromise = (async () => {
      const response = await fetch(`${baseUrl}/auth/login/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Save the new tokens
      localStorage.setItem('token', data.access);
      
      // If the API returns a new refresh token, save it
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      console.log('Authentication token refreshed successfully');
      return data.access;
    })();
    
    // Get the new token
    const newToken = await refreshPromise;
    
    // Process waiting requests
    waitingRequests.forEach(callback => callback(newToken));
    waitingRequests.length = 0;
    
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Clear tokens if refresh failed
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Reject all waiting requests
    waitingRequests.forEach(callback => 
      callback(Promise.reject(new Error('Authentication failed')))
    );
    waitingRequests.length = 0;
    
    // Redirect to login page
    redirectToLogin();
    
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const fetchApi = async (endpoint, method = 'GET', data = null, options = {}) => {
  const { skipCache = false, skipAuth = false, cacheTTL = 60000, timeout = API_TIMEOUT } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  // For debugging
  console.log(`API Request: ${method} ${url}`, data);
  
  const makeRequest = async (authToken = null) => {
    let headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken && !skipAuth) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    let fetchOptions = {
      method,
      headers,
    };
    
    if (method !== 'GET' && data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log('Fetch options:', fetchOptions);
      let response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // Handle authentication issues
      if (response.status === 401 && !skipAuth) {
        console.log('Authentication failed. Redirecting to login...');
        redirectToLogin();
        throw new Error('Authentication required');
      }
      
      if (!response.ok) {
        let errorData = {};
        
        try {
          errorData = await response.json();
        } catch (e) {
          console.log('Could not parse error response as JSON');
        }
        
        const error = new Error(errorData.detail || errorData.message || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        
        console.error('API Error:', error);
        throw error;
      }
      
      // Return empty object for 204 No Content
      if (response.status === 204) {
        return {};
      }
      
      // Parse JSON response
      try {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        return responseData;
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        return {}; // Return empty object if parsing fails
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error(`Request to ${url} timed out after ${timeout}ms`);
        throw new Error(`Request timed out. Please try again.`);
      }
      
      console.error('API Request Error:', error);
      throw error;
    }
  };
  
  // For GET requests, we can use the cache
  if (method === 'GET' && !skipCache) {
    const cacheKey = generateCacheKey(endpoint, method, data);
    
    // Check if we have a cached response
    const cachedResponse = requestCache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Check if there's already a pending request for this endpoint
    if (requestCache.isPending(cacheKey)) {
      return requestCache.getPending(cacheKey);
    }
    
    // If not cached or pending, make the request and cache it
    console.log(`Making ${method} request to ${url}`);
    
    const token = localStorage.getItem('token');
    
    const requestPromise = (async () => {
      try {
        const responseData = await makeRequest(token);
        
        // Cache the response
        requestCache.set(cacheKey, responseData, cacheTTL);
        
        return responseData;
      } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        throw error;
      }
    })();
    
    // Set this request as pending
    return requestCache.setPending(cacheKey, requestPromise);
  } 
  // For non-GET requests or when skipping cache
  else {
    console.log(`Making ${method} request to ${url}`);
    
    const token = localStorage.getItem('token');
    
    try {
      const responseData = await makeRequest(token);
      
      // Clear any related GET cache entries after a mutation
      if (method !== 'GET') {
        // Get related endpoint by removing IDs and params
        const baseEndpoint = endpoint.split('/').slice(0, 2).join('/');
        
        // Clear cache entries that start with this base endpoint
        for (const key of requestCache.cache.keys()) {
          if (key.includes(baseEndpoint)) {
            requestCache.clear(key);
          }
        }
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error in API request to ${url}:`, error);
      throw error;
    }
  }
};

// Function to reset the redirect flag (can be called after successful login)
export const resetAuthRedirect = () => {
  isRedirectingToLogin = false;
};

export const clearApiCache = (endpoint = null) => {
  if (endpoint) {
    // Clear specific endpoint or pattern
    for (const key of requestCache.cache.keys()) {
      if (key.includes(endpoint)) {
        requestCache.clear(key);
      }
    }
  } else {
    // Clear all cache
    requestCache.clear();
  }
};

// Check if server is available
export const checkServerAvailability = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/health-check`, {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Server availability check failed:', error);
    return false;
  }
};

export default fetchApi; 