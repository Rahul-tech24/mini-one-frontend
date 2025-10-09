// src/components/messages/MessageForm.jsx
import { useState } from 'react';
import { apiFetch, ApiError } from '../../api/apiClient';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function MessageForm({ onSuccess, editing }) {
  const [text, setText] = useState(editing ? editing.text : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Client-side validation
    if (!text.trim()) {
      setError('Message cannot be empty');
      return;
    }
    
    if (text.trim().length < 1) {
      setError('Message must be at least 1 character');
      return;
    }
    
    if (text.trim().length > 1000) {
      setError('Message must be less than 1000 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const url = editing ? `/api/messages/${editing._id}` : '/api/messages';
      const method = editing ? 'PUT' : 'POST';
      await apiFetch(url, { 
        method, 
        body: JSON.stringify({ text: text.trim() }), 
        credentials: 'include' 
      });
      setText('');
      onSuccess && onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to post message');
      } else {
        setError('Failed to post message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>
        {editing ? 'Edit Message' : 'Share Your Thoughts'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-input"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? 'What\'s on your mind?' : 'Sign in to post messages'}
            disabled={!user}
            maxLength={1000}
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' }}>
            {text.length}/1000
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={!user || loading || !text.trim()}
          className="w-100"
        >
          {loading ? 'Posting...' : editing ? 'Update Message' : 'Post Message'}
        </Button>
        
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
