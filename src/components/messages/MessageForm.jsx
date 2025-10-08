// src/components/messages/MessageForm.jsx
import { useState } from 'react';
import { apiFetch } from '../../api/apiClient';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function MessageForm({ onSuccess, editing }) {
  const [text, setText] = useState(editing ? editing.text : '');
  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const url = editing ? `/api/messages/${editing._id}` : '/api/messages';
    const method = editing ? 'PUT' : 'POST';
    await apiFetch(url, { method, body: JSON.stringify({ text }) });
    setText('');
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={user ? 'Write something...' : 'Sign in to post'}
        disabled={!user}
      />
      <Button type="submit" disabled={!user}>{editing ? 'Update' : 'Send'}</Button>
    </form>
  );
}
