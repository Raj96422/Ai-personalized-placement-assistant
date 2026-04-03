import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bot, User, ChevronRight } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Assistant from './pages/Assistant';

function App() {
  const location = useLocation();

  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/" className="logo">
          <Bot size={32} color="#3b82f6" />
          <span>PrepAI</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/assistant" className={location.pathname === '/assistant' ? 'active' : ''}>Dashboard</Link>
        </div>
      </nav>

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} PrepAI. Designed for Indian Campus Placements.</p>
      </footer>
    </div>
  );
}

export default App;
