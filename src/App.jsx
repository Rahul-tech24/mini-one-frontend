// App.jsx (improved)
// import { useEffect, useState, useRef } from 'react';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// export default function App() {
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const abortRef = useRef(null);

//   useEffect(() => {
//     fetchMessages();
//     return () => {
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, []);

//   async function fetchMessages() {
//     setLoading(true);
//     setError(null);
//     const ac = new AbortController();
//     abortRef.current = ac;
//     try {
//       const res = await fetch(`${API}/api/messages`, { signal: ac.signal });
//       if (!res.ok) throw new Error('Failed to fetch messages');
//       const data = await res.json();
//       setMessages(data);
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         console.error(err);
//         setError('Could not load messages');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!text.trim()) return alert('Please enter a message');

//     const body = JSON.stringify({ text: text.trim() });

//     try {
//       const url = editing ? `${API}/api/messages/${editing}` : `${API}/api/messages`;
//       const method = editing ? 'PUT' : 'POST';
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body
//       });
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || 'Request failed');
//       }
//       setText('');
//       setEditing(null);
//       fetchMessages(); // simple, consistent
//     } catch (err) {
//       console.error(err);
//       alert('Save failed: ' + (err.message || 'unknown'));
//     }
//   }

//   function handleEdit(m) {
//     setEditing(m._id);
//     setText(m.text);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   async function handleDelete(id) {
//     if (!confirm('Delete message?')) return;
//     try {
//       const res = await fetch(`${API}/api/messages/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Delete failed');
//       fetchMessages();
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }
//   }

//   return (
//     <div style={{ padding: 30, fontFamily: 'system-ui, sans-serif', color: '#333' }}>
//       <h1>mini-mern-connect</h1>
//       <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Write something..."
//           style={{ padding: 8, width: 350, marginRight: 8 }}
//           maxLength={1000}
//         />
//         <button type="submit" style={{ padding: '8px 12px' }}>{editing ? 'Update' : 'Send'}</button>
//         {editing && <button type="button" onClick={() => { setEditing(null); setText(''); }}>Cancel</button>}
//       </form>

//       {loading && <div>Loading messages...</div>}
//       {error && <div style={{ color: 'red' }}>{error}</div>}

//       <div>
//         <h3>Messages</h3>
//         <ul>
//           {messages.map((m) => (
//             <li key={m._id} style={{ marginBottom: 10 }}>
//               <div style={{ fontSize: 14 }}>{m.text}</div>
//               <small style={{ color: '#666' }}>{new Date(m.createdAt).toLocaleString()}</small>
//               <div>
//                 <button onClick={() => handleEdit(m)} style={{ marginRight: 6 }}>Edit</button>
//                 <button onClick={() => handleDelete(m._id)}>Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


// src/App.jsx
import React, { useEffect, useState, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function normalizeUser(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id || null,
    username: raw.username,
    email: raw.email
  };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState(null);
  const [msgErr, setMsgErr] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();
    return () => { if (abortRef.current) abortRef.current.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch logged-in user (session via httpOnly cookie)
  async function fetchCurrentUser() {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
      const data = await res.json();
      // backend may return { user } or direct user object (register/login)
      const rawUser = data && data.user ? data.user : data;
      setUser(normalizeUser(rawUser));
    } catch (err) {
      console.error('fetchCurrentUser error', err);
      setUser(null);
    }
  }

  // Get messages (public read)
  async function fetchMessages() {
    setLoading(true);
    setMsgErr(null);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch(`${API}/api/messages`, { credentials: 'include', signal: ac.signal });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setMsgErr('Could not load messages');
      }
    } finally {
      setLoading(false);
    }
  }

  // ----- Auth handlers -----
  async function handleRegister({ username, email, password }) {
    setAuthLoading(true); setAuthErr(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register failed');
      setUser(normalizeUser(data));
      fetchMessages();
    } catch (err) {
      console.error('register error', err);
      setAuthErr(err.message || 'Register failed');
    } finally { setAuthLoading(false); }
  }

  async function handleLogin({ emailOrUsername, password }) {
    setAuthLoading(true); setAuthErr(null);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(normalizeUser(data));
      fetchMessages();
    } catch (err) {
      console.error('login error', err);
      setAuthErr(err.message || 'Login failed');
    } finally { setAuthLoading(false); }
  }

  async function handleLogout() {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('logout error', err);
    } finally {
      setUser(null);
    }
  }

  // ----- Message CRUD -----
  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return alert('Please enter a message');
    if (!user) return alert('You must be signed in to post');

    try {
      const url = editingId ? `${API}/api/messages/${editingId}` : `${API}/api/messages`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setText(''); setEditingId(null);
      fetchMessages();
    } catch (err) {
      console.error('message submit error', err);
      alert(err.message || 'Save failed');
    }
  }

  function startEdit(msg) {
    setEditingId(msg._id);
    setText(msg.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!confirm('Delete message?')) return;
    try {
      const res = await fetch(`${API}/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      fetchMessages();
    } catch (err) {
      console.error('delete error', err);
      alert(err.message || 'Delete failed');
    }
  }

  function canEdit(msg) {
    if (!user || !msg || !msg.author) return false;
    const authorId = msg.author._id || msg.author.id;
    return String(authorId) === String(user.id);
  }

  // ----- render -----
  return (
    <div style={styles.app}>
      <h1 style={styles.h1}>mini-mern-connect · auth + CRUD</h1>

      <div style={styles.topRow}>
        <div style={styles.authBox}>
          {user ? (
            <div>
              <div>Signed in as <strong>{user.username}</strong></div>
              <div style={{ marginTop: 8 }}>
                <button onClick={handleLogout} style={styles.button}>Logout</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 8 }}>
                <button onClick={() => setAuthMode('login')} style={{ ...styles.button, marginRight: 6, background: authMode === 'login' ? '#222' : undefined, color: authMode === 'login' ? '#fff' : undefined }}>Login</button>
                <button onClick={() => setAuthMode('register')} style={{ ...styles.button, background: authMode === 'register' ? '#222' : undefined, color: authMode === 'register' ? '#fff' : undefined }}>Register</button>
              </div>

              {authMode === 'login' ? (
                <AuthLogin onLogin={handleLogin} loading={authLoading} err={authErr} />
              ) : (
                <AuthRegister onRegister={handleRegister} loading={authLoading} err={authErr} />
              )}
            </div>
          )}
        </div>

        <div style={styles.infoBox}>
          <div><strong>How this app works</strong></div>
          <div style={{ marginTop: 6, color: '#666' }}>
            Messages are stored in MongoDB. Create/Update/Delete are protected — you must be signed in. Cookies (httpOnly) manage sessions.
          </div>
        </div>
      </div>

      <div style={styles.formBox}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={user ? (editingId ? 'Edit your message...' : 'Write something...') : 'Sign in to post messages'}
              style={styles.textarea}
              rows={3}
              disabled={!user}
              maxLength={1000}
            />
          </div>

          <div>
            <button type="submit" style={styles.button} disabled={!user}>{editingId ? 'Update' : 'Send'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setText(''); }} style={{ ...styles.button, marginLeft: 8, background: '#aaa' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Messages</h3>
        {loading && <div>Loading messages...</div>}
        {msgErr && <div style={{ color: 'red' }}>{msgErr}</div>}
        <ul style={styles.list}>
          {messages.map(m => (
            <li key={m._id} style={styles.listItem}>
              <div style={{ fontSize: 15 }}>{m.text}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                <span>by <strong>{m.author?.username || 'unknown'}</strong></span>
                <span style={{ marginLeft: 12 }}>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                {canEdit(m) && (
                  <>
                    <button onClick={() => startEdit(m)} style={{ ...styles.smallBtn, marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(m._id)} style={styles.smallBtn}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 30, color: '#888' }}>
        <div>API: <code>{API}</code></div>
        <div style={{ marginTop: 6 }}>Tip: If cookie-based auth fails in prod, make sure backend CLIENT_ORIGINS includes this origin and cookies are allowed (HTTPS).</div>
      </div>
    </div>
  );
}

// small subcomponents
function AuthLogin({ onLogin, loading, err }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input placeholder="Email or username" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} style={styles.input} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <div>
        <button onClick={() => onLogin({ emailOrUsername, password })} style={styles.button} disabled={loading}>Login</button>
      </div>
      {err && <div style={{ color: 'red', marginTop: 6 }}>{err}</div>}
    </div>
  );
}

function AuthRegister({ onRegister, loading, err }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <div>
        <button onClick={() => onRegister({ username, email, password })} style={styles.button} disabled={loading}>Register</button>
      </div>
      {err && <div style={{ color: 'red', marginTop: 6 }}>{err}</div>}
    </div>
  );
}

const styles = {
  app: { padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', color: '#222', maxWidth: 900, margin: '0 auto' },
  h1: { marginBottom: 12 },
  topRow: { display: 'flex', gap: 20, marginBottom: 18 },
  authBox: { minWidth: 300, padding: 12, border: '1px solid #eee', borderRadius: 8 },
  infoBox: { flex: 1, padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#fafafa' },
  formBox: { marginTop: 12 },
  input: { display: 'block', padding: 8, marginBottom: 8, width: '100%' },
  textarea: { width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' },
  button: { padding: '8px 12px', borderRadius: 6, border: 0, background: '#222', color: '#fff', cursor: 'pointer' },
  smallBtn: { padding: '6px 10px', borderRadius: 6, border: 0, background: '#eee', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, marginTop: 12 },
  listItem: { padding: 12, border: '1px solid #eee', borderRadius: 8, marginBottom: 10 }
};
