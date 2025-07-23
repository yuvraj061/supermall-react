import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';

const SuperMallHeader = ({ user, onLogout, darkMode, setDarkMode, searchData, onNavigate, onLogin, onSignup, onShowProfile, onShowAbout, onShowNotifications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef(null);

  // Search logic using real searchData
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() && Array.isArray(searchData)) {
      const filtered = searchData.filter(item =>
        (item.title || item.name)?.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
        (item.shop && item.shop.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    if (onNavigate) {
      if (result.type === 'shop') {
        onNavigate('shopDetails', { shopId: result.id });
      } else if (result.type === 'product') {
        onNavigate('productDetails', { productId: result.id });
      } else if (result.type === 'offer') {
        onNavigate('offers', { offerId: result.id });
      }
    }
    setSearchQuery(result.title || result.name);
    setShowSearchResults(false);
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`w-full border-b transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-3 min-w-[220px]">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="url(#cartGradient)" viewBox="0 0 16 16">
                <defs>
                  <linearGradient id="cartGradient" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38bdf8"/>
                    <stop offset="1" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" fill="url(#cartGradient)"/>
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" fill="url(#cartGradient)"/>
              </svg>
              <span className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>SuperMall</span>
            </span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-300 font-normal hidden sm:inline-block">India’s Digital Marketplace</span>
          </div>
          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search shops, products, offers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-opacity-75 transition-colors flex items-center justify-between ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                  >
                    <div>
                      <div className="font-medium">{result.title || result.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{result.type === 'shop' && `Shop • ${result.category || ''}`}{result.type === 'product' && `Product • ${result.shop || ''}`}{result.type === 'offer' && `Offer • ${result.shop || ''}`}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${result.type === 'shop' ? 'bg-blue-100 text-blue-800' : result.type === 'product' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{result.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} title="Toggle dark mode">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            {/* Notifications */}
            <button className={`p-2 rounded-lg transition-colors relative ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} onClick={onShowNotifications} title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">1</span>
              </span>
            </button>
            {/* User Section */}
            {user && user.isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>{user.avatar ? (<img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover" />) : (<div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{getUserInitials(user.name)}</div>)}<span className="hidden sm:block font-medium">{user.name}</span><ChevronDown className="h-3 w-3" /></button>{showUserMenu && (<div className={`absolute right-0 top-full mt-1 w-56 border rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}><div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}><div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div><div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div></div><div className="py-1"><a href="#" onClick={e => { e.preventDefault(); if (onShowProfile) onShowProfile(); }} className={`block px-4 py-2 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>Profile Settings</a>{user.role === 'admin' && (
  <>
    <div className={`border-t my-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
    <a href="#" onClick={e => { e.preventDefault(); if (onNavigate) onNavigate('dashboard'); }} className={`block px-4 py-2 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>Admin Panel</a>
    <a href="#" onClick={e => { e.preventDefault(); if (onNavigate) onNavigate('add-data'); }} className={`block px-4 py-2 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>Add Rural Data</a>
  </>
)}<a href="#" onClick={e => { e.preventDefault(); if (onShowAbout) onShowAbout(); }} className={`block px-4 py-2 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>About</a><div className={`border-t my-1 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div><button onClick={onLogout} className={`w-full text-left px-4 py-2 text-sm transition-colors text-red-600 hover:bg-red-50 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}>Sign Out</button></div></div>)}</div>) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onLogin ? onLogin() : window.location.href = '/login'}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onSignup ? onSignup() : window.location.href = '/signup'}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>{showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          </div>
        </div>
      </div>
      {showMobileMenu && (<div className={`md:hidden border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}><div className="px-4 py-3 space-y-2">{user && user.isAuthenticated ? (<><div className={`py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div><div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div></div><a href="/profile" className={`block py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile Settings</a>{user.role === 'admin' && (<><a href="/admin" className={`block py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin Panel</a><a href="/add-data" className={`block py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add Rural Data</a></>)}<a href="/about" className={`block py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>About</a><button onClick={onLogout} className="block py-2 text-sm text-red-600 w-full text-left">Sign Out</button></>) : (<div className="space-y-2"><button className={`block w-full py-2 text-sm text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login</button><button className="block w-full py-2 text-sm text-left text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors px-3">Sign Up</button><a href="/about" className={`block py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>About</a></div>)}</div></div>)}
    </header>
  );
};

export default SuperMallHeader; 