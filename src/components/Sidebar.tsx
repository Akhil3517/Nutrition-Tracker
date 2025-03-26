
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CodeCrew</h2>
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
      </ul>
    </div>
  );
};

export default Sidebar;
