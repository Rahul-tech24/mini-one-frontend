// src/components/messages/MessageList.jsx
import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../api/apiClient';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const { user } = useAuth();

  async function fetchMessages() {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/api/messages', { credentials: 'include' });
      setMessages(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to load messages');
      } else {
        setError('Failed to load messages. Please try again.');
      }
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
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete message';
      alert(errorMessage);
    }
  }

  function handleEditStart(message) {
    setEditingId(message._id);
    setEditText(message.text);
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditText('');
  }

  async function handleEditSave(id) {
    if (!editText.trim()) return;
    
    setEditLoading(true);
    try {
      const updatedMessage = await apiFetch(`/api/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ text: editText.trim() }),
        credentials: 'include'
      });
      
      setMessages(prev => 
        prev.map(msg => msg._id === id ? { ...msg, text: editText.trim() } : msg)
      );
      
      setEditingId(null);
      setEditText('');
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update message';
      alert(errorMessage);
    } finally {
      setEditLoading(false);
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
          {editingId === m._id ? (
            <div>
              <textarea
                className="form-input"
                rows="3"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                maxLength={1000}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {editText.length}/1000
              </div>
              <div className="message-actions">
                <Button 
                  onClick={() => handleEditSave(m._id)}
                  disabled={editLoading || !editText.trim()}
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  {editLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  onClick={handleEditCancel}
                  variant="secondary"
                  style={{ fontSize: '14px', padding: '6px 12px' }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                  {m.updatedAt && m.updatedAt !== m.createdAt && (
                    <span style={{ color: '#999', fontSize: '12px' }}> (edited)</span>
                  )}
                </span>
              </div>
              {user && user.id === m.author?._id && (
                <div className="message-actions">
                  <Button 
                    onClick={() => handleEditStart(m)}
                    variant="secondary"
                    style={{ fontSize: '14px', padding: '6px 12px' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(m._id)}
                    variant="danger"
                    style={{ fontSize: '14px', padding: '6px 12px' }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
