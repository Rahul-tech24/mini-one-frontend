// App.jsx (improved)
import { useEffect, useState, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  async function fetchMessages() {
    setLoading(true);
    setError(null);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch(`${API}/api/messages`, { signal: ac.signal });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError('Could not load messages');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return alert('Please enter a message');

    const body = JSON.stringify({ text: text.trim() });

    try {
      const url = editing ? `${API}/api/messages/${editing}` : `${API}/api/messages`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      setText('');
      setEditing(null);
      fetchMessages(); // simple, consistent
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + (err.message || 'unknown'));
    }
  }

  function handleEdit(m) {
    setEditing(m._id);
    setText(m.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!confirm('Delete message?')) return;
    try {
      const res = await fetch(`${API}/api/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <div style={{ padding: 30, fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h1>mini-mern-connect</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          style={{ padding: 8, width: 350, marginRight: 8 }}
          maxLength={1000}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>{editing ? 'Update' : 'Send'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setText(''); }}>Cancel</button>}
      </form>

      {loading && <div>Loading messages...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((m) => (
            <li key={m._id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 14 }}>{m.text}</div>
              <small style={{ color: '#666' }}>{new Date(m.createdAt).toLocaleString()}</small>
              <div>
                <button onClick={() => handleEdit(m)} style={{ marginRight: 6 }}>Edit</button>
                <button onClick={() => handleDelete(m._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

