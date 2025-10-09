// src/components/auth/AuthBox.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';
import Button from '../ui/Button';

export default function AuthBox() {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState('login');

  if (user) {
    return (
      <div className="user-info">
        <span>👋 Welcome back, {user.username}!</span>
        <Button onClick={logout} variant="secondary">Logout</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </h2>
      {mode === 'login' ? (
        <AuthLogin onSwitch={() => setMode('register')} />
      ) : (
        <AuthRegister onSwitch={() => setMode('login')} />
      )}
    </div>
  );
}
