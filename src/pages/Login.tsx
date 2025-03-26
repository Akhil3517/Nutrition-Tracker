
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from "../hooks/use-toast";
import './Login.css';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    // This is a mock authentication. In a real app, you would connect to a backend.
    if (isLogin) {
      // Mock login successful
      localStorage.setItem('user', JSON.stringify({ email, name: 'User' }));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate(from);
    } else {
      // Mock registration successful
      localStorage.setItem('user', JSON.stringify({ email, name }));
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      navigate(from);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Create an Account'}</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-switch">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)}>Register</button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)}>Login</button>
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
