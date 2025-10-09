// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, ApiError } from '../api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCurrentUser() {
    try {
      const data = await apiFetch('/auth/me', { credentials: 'include' });
      setUser(data.user || data);
    } catch (error) {
      // Don't show errors for auth check - user might just not be logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function login(emailOrUsername, password) {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrUsername, password }),
        credentials: 'include'
      });
      setUser(data.user || data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async function register(username, email, password) {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });
      setUser(data.user || data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  async function logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  }

  const value = { user, loading, login, register, logout, fetchCurrentUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
