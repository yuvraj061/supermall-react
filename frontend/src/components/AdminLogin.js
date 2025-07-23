import React, { useState } from 'react';
import { adminLogin } from '../services/authService';
import logger from '../utils/logger';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    logger.info('Admin login form submitted');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await adminLogin(email, password);
    
    if (result.success) {
      logger.info('Admin login successful, redirecting to dashboard');
      onLoginSuccess(result.user);
    } else {
      setError(result.error || 'Login failed');
      logger.error('Admin login failed:', result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>SuperMall Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 