import React, { useState } from 'react';
import { adminLogin } from '../services/authService';

const LoginModal = ({ open, onClose, onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.success) {
      if (onLoginSuccess) onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={onClose} title="Close">×</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Login to SuperMall</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <input type="password" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <button type="button" className="text-blue-600 hover:underline" onClick={onSwitchToSignup}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 