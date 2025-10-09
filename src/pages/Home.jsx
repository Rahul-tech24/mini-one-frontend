// src/pages/Home.jsx
import AuthBox from '../components/auth/AuthBox';
import MessageForm from '../components/messages/MessageForm';
import MessageList from '../components/messages/MessageList';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="header">
        <h1>Mini MERN Connect</h1>
        <p>Connect and share your thoughts with the community</p>
      </div>
      
      <div className="card">
        <AuthBox />
      </div>
      
      {user && (
        <div className="card">
          <MessageForm onSuccess={() => window.location.reload()} />
        </div>
      )}
      
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Recent Messages</h2>
        <MessageList />
      </div>
    </div>
  );
}
