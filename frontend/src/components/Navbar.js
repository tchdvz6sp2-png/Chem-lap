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
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/inventory">Inventory</Link>
            <Link to="/experiments">Experiments</Link>
            <Link to="/safety">Safety</Link>
            <span style={{ marginLeft: '20px', opacity: 0.8 }}>
              {user.username} ({user.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;
