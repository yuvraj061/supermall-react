import React, { useState, useEffect } from 'react';
import { Database, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { seedData, clearData, checkExistingData } from '../utils/seedData';
import logger from '../utils/logger';

const DataSeeder = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning'
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    checkDataStatus();
  }, []);

  const checkDataStatus = async () => {
    try {
      const data = await checkExistingData();
      setExistingData(data);
      logger.info('Data status checked:', data);
    } catch (error) {
      logger.error('Error checking data status:', error);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Check if data already exists
      const existingData = await checkExistingData();
      if (existingData.hasData) {
        setMessage({
          type: 'warning',
          text: 'Data already exists! Please clear existing data first to add images.',
          details: 'Current data does not include image fields. Clear and reseed to see images.'
        });
        return;
      }
      
      await seedData();
      setMessage({
        type: 'success',
        text: 'SuperMall data seeded successfully with images! 🎉',
        details: 'All categories, floors, shops, and offers now include beautiful images.'
      });
      
      // Refresh existing data status
      const newExistingData = await checkExistingData();
      setExistingData(newExistingData);
    } catch (error) {
      logger.error('Error seeding data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to seed data',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all SuperMall data? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    setMessage('');

    try {
      const result = await clearData();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message,
          details: 'Data cleared successfully. You can now seed fresh data with images.'
        });
        await checkDataStatus(); // Refresh data status
      } else {
        setMessage({
          type: 'error',
          text: result.message,
          details: 'Failed to clear data.'
        });
      }
    } catch (error) {
      logger.error('Error clearing data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to clear data',
        details: error.message
      });
    } finally {
      setClearing(false);
    }
  };

  const getMessageIcon = () => {
    if (!message || typeof message === 'string') return null;
    switch (message.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMessageClass = () => {
    if (!message || typeof message === 'string') return 'bg-gray-50 border-gray-200 text-gray-800';
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SuperMall Data Management</h1>
          <p className="text-gray-600">Manage digital marketplace data for testing</p>
        </div>

        {/* Data Status */}
        {existingData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Data Status</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Categories: {existingData.categories}</p>
              <p>Merchant Counters: {existingData.shops}</p>
              <p>Product Offers: {existingData.offers}</p>
            </div>
            {existingData.hasData && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Data already exists. Clear existing data before seeding new data.
              </div>
            )}
            {!existingData.hasData && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                ✅ Database is empty. Ready to seed new data.
              </div>
            )}
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-3 border rounded-lg ${getMessageClass()}`}>
            <div className="flex items-center">
              {getMessageIcon()}
              <p className="ml-2 font-medium">
                {typeof message === 'string' ? message : message.text}
              </p>
            </div>
            {typeof message === 'object' && message.details && (
              <p className="mt-1 text-sm opacity-90">
                {message.details}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSeedData}
            disabled={loading || clearing || (existingData && existingData.hasData)}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Add Marketplace Data
              </>
            )}
          </button>

          <button
            onClick={handleClearData}
            disabled={loading || clearing || !existingData?.hasData}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {clearing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All Data
              </>
            )}
          </button>

          <button
            onClick={checkDataStatus}
            disabled={loading || clearing}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Status
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Data Info */}
        <div className="mt-6 text-sm text-gray-500">
          <h3 className="font-medium text-gray-700 mb-2">Marketplace Data Includes:</h3>
          <ul className="space-y-1">
            <li>• 15 Product Categories (All merchant types)</li>
            <li>• 8 Marketplace Sections (Different counter areas)</li>
            <li>• 10 Merchant Counters (Urban + Rural merchants)</li>
            <li>• 9 Product Offers (With detailed specifications)</li>
          </ul>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Instructions:</h3>
          <ol className="text-xs text-blue-700 space-y-1">
            <li>1. Check current data status above</li>
            <li>2. Clear existing data if needed</li>
            <li>3. Add marketplace data for testing</li>
            <li>4. Navigate to explore the digital marketplace</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DataSeeder; 