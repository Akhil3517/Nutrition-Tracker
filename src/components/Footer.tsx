
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Cuisine Connoisseur</h3>
            <p>Track your nutrition, discover new foods, and learn about healthy eating habits.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/tracker">Tracker</a></li>
              <li><a href="/suggestions">Food Suggestions</a></li>
              <li><a href="/education">Education</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@cuisineconnoisseur.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cuisine Connoisseur. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
