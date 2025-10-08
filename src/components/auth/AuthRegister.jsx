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
    try {
      await register(username, email, password);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" disabled={loading}>Register</Button>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <p>Already have an account? <a href="#" onClick={onSwitch}>Login</a></p>
    </form>
  );
}
