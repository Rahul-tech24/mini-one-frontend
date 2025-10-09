// src/components/messages/MessageList.jsx
import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/apiClient';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  async function fetchMessages() {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/messages', { credentials: 'include' });
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await apiFetch(`/api/messages/${id}`, { method: 'DELETE', credentials: 'include' });
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      alert('Failed to delete message');
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (messages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <p>No messages yet. Be the first to share something! 🚀</p>
      </div>
    );
  }

  return (
    <ul className="message-list">
      {messages.map((m) => (
        <li key={m._id} className="message-item">
          <div className="message-content">{m.text}</div>
          <div className="message-meta">
            <span className="message-author">
              @{m.author?.username || 'Unknown'}
            </span>
            <span className="message-time">
              {new Date(m.createdAt).toLocaleDateString()} at{' '}
              {new Date(m.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          {user && user.id === m.author?._id && (
            <div className="message-actions">
              <Button 
                onClick={() => handleDelete(m._id)}
                variant="danger"
                style={{ fontSize: '14px', padding: '6px 12px' }}
              >
                Delete
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
