
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Oops! The page <code>{location.pathname}</code> you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
