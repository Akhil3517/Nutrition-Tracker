
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Cuisine Connoisseur</h2>
      </div>
      <ul className="navbar-nav">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/tracker' ? 'active' : ''}>
          <Link to="/tracker">Tracker</Link>
        </li>
        <li className={location.pathname === '/suggestions' ? 'active' : ''}>
          <Link to="/suggestions">Food Suggestions</Link>
        </li>
        <li className={location.pathname === '/education' ? 'active' : ''}>
          <Link to="/education">Nutrition Education</Link>
        </li>
        <li className={location.pathname === '/profile' ? 'active' : ''}>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        {localStorage.getItem('user') ? (
          <Link to="/login" className="btn btn-danger" onClick={() => localStorage.removeItem('user')}>
            Logout
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
