// src/pages/Home.jsx
import AuthBox from '../components/auth/AuthBox';
import MessageForm from '../components/messages/MessageForm';
import MessageList from '../components/messages/MessageList';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Mini MERN Connect</h1>
      <AuthBox />
      {user && <MessageForm onSuccess={() => window.location.reload()} />}
      <MessageList />
    </div>
  );
}
