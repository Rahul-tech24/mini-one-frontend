// src/components/auth/AuthRegister.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function AuthRegister({ onSwitch }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    
    // Client-side validation
    if (!username.trim()) {
      setErr('Username is required');
      setLoading(false);
      return;
    }
    
    if (username.trim().length < 3) {
      setErr('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    
    if (username.trim().length > 50) {
      setErr('Username must be less than 50 characters');
      setLoading(false);
      return;
    }
    
    if (!email.trim()) {
      setErr('Email is required');
      setLoading(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErr('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    if (!password.trim()) {
      setErr('Password is required');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (password.length > 128) {
      setErr('Password must be less than 128 characters');
      setLoading(false);
      return;
    }
    
    try {
      await register(username.trim(), email.trim().toLowerCase(), password);
    } catch (error) {
      setErr(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="form-input"
          placeholder="Choose a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={50}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="form-input"
          placeholder="Create a secure password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-100">
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
      
      {err && <div className="error-message">{err}</div>}
      
      <div className="auth-switch">
        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Sign in here</a>
      </div>
    </form>
  );
}
