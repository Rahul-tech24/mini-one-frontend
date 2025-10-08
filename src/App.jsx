import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);


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
  if (!text.trim()) return alert('Please enter a message');

  try {
    if (editing) {
      // update existing message
      await fetch(`${API}/api/messages/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      setEditing(null);
    } else {
      // create new message
      await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    }

    setText('');
    fetchMessages();
  } catch (err) {
    console.error('Failed to submit', err);
  }
  }
  
  function handleEdit(message) {
  setText(message.text);
  setEditing(message._id);
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;

  try {
    await fetch(`${API}/api/messages/${id}`, { method: 'DELETE' });
    fetchMessages();
  } catch (err) {
    console.error('Delete failed', err);
  }
}



  return (
    <div style={{ padding: 30, fontFamily: 'system-ui, sans-serif', color: '#87ca35ff' }}>
      <h1>mini-mern-connect</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          style={{ padding: 8, width: 350, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>
  {editing ? 'Update' : 'Send'}
</button>
{editing && (
  <button type="button" onClick={() => { setEditing(null); setText(''); }}>
    Cancel
  </button>
)}
 </form>

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



