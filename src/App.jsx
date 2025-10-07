import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  // fetch on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch(`${API}/api/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Fetch messages failed', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim())
      return alert('Please enter a message');
    try {
      await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      setText('');
      fetchMessages(); // refresh
    } catch (err) {
      console.error('Send message failed', err);
    }
  }

  return (
    <div style={{ padding: 30, fontFamily: 'system-ui, sans-serif', color: 'green' }}>
      <h1>mini-mern-connect</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          style={{ padding: 8, width: 350, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>Send</button>
      </form>

      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((m) => (
            <li key={m._id}>
              <div style={{ fontSize: 14 }}>{m.text}</div>
              <small style={{ color: '#666' }}>{new Date(m.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



