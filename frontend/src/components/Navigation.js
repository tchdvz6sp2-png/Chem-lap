import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Chem-Lap</h2>
        <p className="user-info">{user?.username} ({user?.role})</p>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/inventory" className={isActive('/inventory') ? 'active' : ''}>
            🧪 Inventory
          </Link>
        </li>
        <li>
          <Link to="/experiments" className={isActive('/experiments') ? 'active' : ''}>
            🔬 Experiments
          </Link>
        </li>
        <li>
          <Link to="/safety" className={isActive('/safety') ? 'active' : ''}>
            🛡️ Safety Protocols
          </Link>
        </li>
      </ul>
      <div className="nav-footer">
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
