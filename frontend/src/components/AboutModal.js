import React from 'react';
const AboutModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={onClose} title="Close">×</button>
        <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300">About SuperMall</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          SuperMall is a modern digital marketplace for merchant counters and stalls, built with React and Firebase. Browse products, offers, and shops, and manage everything from a powerful admin dashboard.<br /><br />
          <strong>Developed by:</strong> Yuvraj Singh
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
export default AboutModal; 