import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "../hooks/use-toast";
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const handleAuthClick = () => {
    if (currentUser) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const handleProtectedRouteClick = (path) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>NutriTrack</h2>
      </div>
      <ul className="navbar-nav">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/tracker' ? 'active' : ''}>
          <button 
            onClick={() => handleProtectedRouteClick('/tracker')}
            className="nav-link-button"
          >
            Tracker
          </button>
        </li>
        {/* <li className={location.pathname === '/suggestions' ? 'active' : ''}>
          <Link to="/suggestions">Food Suggestions</Link>
        </li> */}
        <li className={location.pathname === '/profile' ? 'active' : ''}>
          <button 
            onClick={() => handleProtectedRouteClick('/profile')}
            className="nav-link-button"
          >
            Profile
          </button>
        </li>
      </ul>
      <div className="navbar-auth">
        <button 
          onClick={handleAuthClick}
          className={`btn ${currentUser ? 'btn-danger' : 'btn-primary'}`}
        >
          {currentUser ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
