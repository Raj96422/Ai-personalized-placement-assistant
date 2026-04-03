import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Bot, User, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Assistant from './pages/Assistant';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/" className="logo">
          <Bot size={32} color="#3b82f6" />
          <span>PrepAI</span>
        </Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          {user ? (
            <>
              <Link to="/assistant" className={location.pathname === '/assistant' ? 'active' : ''}>Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <User size={18} /> {user.name}
              </div>
              <button onClick={logout} className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
              <Link to="/register" className="primary-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/assistant" 
            element={
              <ProtectedRoute>
                <Assistant />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} PrepAI. Designed for Indian Campus Placements.</p>
      </footer>
    </div>
  );
}

export default App;
