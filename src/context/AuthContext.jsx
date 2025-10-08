// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCurrentUser() {
    try {
      const data = await apiFetch('/auth/me', { credentials: 'include' });
      setUser(data.user || data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function login(emailOrUsername, password) {
    const data = await apiFetch('/auth/login',  {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
      credentials: 'include'
    });
    setUser(data.user || data);
  }

  async function register(username, email, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
    });
    setUser(data.user || data);
  }

  async function logout() {
    await apiFetch('/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  const value = { user, loading, login, register, logout, fetchCurrentUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
