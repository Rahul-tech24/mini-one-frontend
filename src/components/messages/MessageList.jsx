// src/components/messages/MessageList.jsx
import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/apiClient';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  async function fetchMessages() {
    const data = await apiFetch('/api/messages');
    setMessages(data);
  }

  async function handleDelete(id) {
    await apiFetch(`/api/messages/${id}`, { method: 'DELETE' });
    fetchMessages();
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <ul>
      {messages.map((m) => (
        <li key={m._id}>
          <p>{m.text}</p>
          <small>{m.author?.username} — {new Date(m.createdAt).toLocaleString()}</small>
          {user && user.id === m.author?._id && (
            <div>
              <Button onClick={() => handleDelete(m._id)}>Delete</Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
