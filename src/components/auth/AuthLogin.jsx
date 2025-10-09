// src/components/auth/AuthLogin.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function AuthLogin({ onSwitch }) {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(emailOrUsername, password);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="emailOrUsername">Email or Username</label>
        <input
          id="emailOrUsername"
          type="text"
          className="form-input"
          placeholder="Enter your email or username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-100">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      
      {err && <div className="error-message">{err}</div>}
      
      <div className="auth-switch">
        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Create one here</a>
      </div>
    </form>
  );
}
