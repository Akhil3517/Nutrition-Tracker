import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo-link">
          <h2>NutriTrack</h2>
        </Link>
      </div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === '/meal-log' ? 'active' : ''}>
          <Link to="/meal-log">Meal Log</Link>
        </li>
        <li className={location.pathname === '/meal-planning' ? 'active' : ''}>
          <Link to="/meal-planning">Meal Planning</Link>
        </li>
        <li className={location.pathname === '/food-suggestions' ? 'active' : ''}>
          <Link to="/food-suggestions">Food Suggestions</Link>
        </li>
        <li className={location.pathname === '/nutrition-education' ? 'active' : ''}>
          <Link to="/nutrition-education">Nutrition Education</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
