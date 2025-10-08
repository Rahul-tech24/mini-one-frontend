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
      <input
        placeholder="Email or Username"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>Login</Button>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <p>Don’t have an account? <a href="#" onClick={onSwitch}>Register</a></p>
    </form>
  );
}
