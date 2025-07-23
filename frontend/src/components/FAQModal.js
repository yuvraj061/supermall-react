import React from 'react';
const FAQModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={onClose} title="Close">×</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Frequently Asked Questions</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-200">
          <div>
            <h3 className="font-semibold">How do I register as an admin?</h3>
            <p>Admins are assigned manually by the project owner. Contact support or the project owner to be granted admin access.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I add a new shop or offer?</h3>
            <p>Admins can add shops and offers from the Admin Panel. Click your profile, then 'Admin Panel', and use the management features.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I update my profile?</h3>
            <p>Click your profile icon, then 'Profile Settings' to view your profile. Editing features are coming soon.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I contact support?</h3>
            <p>Use the 'About' section in your profile menu for project info. For further help, contact the project owner.</p>
          </div>
        </div>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
export default FAQModal; 