// src/api/apiClient.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(path, options = {}) {
  const opts = {
    credentials: 'include', // Send cookies for auth
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };
  
  try {
    const res = await fetch(`${API}${path}`, opts);
    let data = {};
    
    try {
      data = await res.json();
    } catch (parseError) {
      // If response is not JSON, use status text
      data = { error: res.statusText };
    }
    
    if (!res.ok) {
      const errorMessage = data.error || data.message || res.statusText || 'Request failed';
      throw new ApiError(errorMessage, res.status, data);
    }
    
    return data;
  } catch (error) {
    // Network errors or other fetch errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network connectivity issues
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError('Network error. Please check your connection.', 0);
    }
    
    // Re-throw unknown errors
    throw new ApiError(error.message || 'An unexpected error occurred', 0);
  }
}

export { API, ApiError };

