import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>Chem-Lap</h1>
        {user && (
          <nav>
            <Link to="/dashboard">Přehled</Link>
            <Link to="/inventory">Inventář</Link>
            <Link to="/experiments">Experimenty</Link>
            <Link to="/safety">Bezpečnost</Link>
            <span style={{ marginLeft: '20px', opacity: 0.8 }}>
              {user.username} ({user.role})
            </span>
            <button onClick={handleLogout}>Odhlásit se</button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;
