import React from 'react';
const ProfileModal = ({ open, onClose, user }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={onClose} title="Close">×</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Profile Settings</h2>
        <div className="mb-4 flex flex-col items-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-3xl font-bold text-blue-700 dark:text-blue-200 mb-2">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
          )}
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
export default ProfileModal; 