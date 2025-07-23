import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Tag, 
  BarChart3, 
  Filter, 
  Gift, 
  Building2, 
  Eye,
  Search,
  Grid3X3,
  List,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';
import SuperMallHeader from './SuperMallHeader';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import AboutModal from './AboutModal';
import ProfileModal from './ProfileModal';
import { onAuthStateChange, adminLogout } from '../services/authService';
import FAQModal from './FAQModal';
import NotificationsModal from './NotificationsModal';

const UserHome = ({ onNavigate, onLogout, darkMode, setDarkMode, user: initialUser }) => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalOffers: 0,
    totalCategories: 0,
    totalFloors: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [user, setUser] = useState(initialUser || null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persist user login across reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserRole(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sign out handler
  const handleLogout = async () => {
    await adminLogout();
    setUser(null);
    if (onLogout) onLogout();
  };

  // Dummy data for demo (replace with real data fetch if needed)
  const allShops = [
    { name: 'TechTrend Mobile Store', description: 'Latest smartphones and accessories', type: 'Shop' },
    { name: 'Fashion Forward Boutique', description: 'Trendy fashion items', type: 'Shop' },
    { name: 'Gourmet Delights', description: 'Artisanal food products', type: 'Shop' },
  ];
  const allOffers = [
    { title: 'Latest Smartphone - 15% Off', description: 'Brand new smartphones', type: 'Offer' },
    { title: 'Cooking Masterclass - 40% Off', description: 'Learn gourmet cooking', type: 'Offer' },
  ];
  const allCategories = [
    { name: 'Electronics & Gadgets', description: 'Technology products', type: 'Category' },
    { name: 'Food & Beverages', description: 'Food products', type: 'Category' },
  ];

  useEffect(() => {
    fetchStats();
    fetchShops();
    fetchProducts();
    fetchOffers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    // Simple local search for demo
    const shopResults = allShops.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const offerResults = allOffers.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase()) || o.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const categoryResults = allCategories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults([
      ...shopResults.map(r => ({ ...r, label: r.name, type: 'Shop' })),
      ...offerResults.map(r => ({ ...r, label: r.title, type: 'Offer' })),
      ...categoryResults.map(r => ({ ...r, label: r.name, type: 'Category' })),
    ]);
    setSearchOpen(true);
  }, [searchTerm]);

  const fetchStats = async () => {
    try {
      const [shopsSnapshot, offersSnapshot, categoriesSnapshot, floorsSnapshot] = await Promise.all([
        getDocs(collection(db, 'shops')),
        getDocs(collection(db, 'offers')),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'floors'))
      ]);

      setStats({
        totalShops: shopsSnapshot.size,
        totalOffers: offersSnapshot.size,
        totalCategories: categoriesSnapshot.size,
        totalFloors: floorsSnapshot.size
      });
    } catch (error) {
      logger.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    const snapshot = await getDocs(collection(db, 'shops'));
    setShops(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'shop' })));
  };
  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'product' })));
  };
  const fetchOffers = async () => {
    const snapshot = await getDocs(collection(db, 'offers'));
    setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'offer' })));
  };

  const searchData = [...shops, ...products, ...offers];

  const features = [
    {
      title: 'Category Wise Details',
      description: 'Browse shops and products by category',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'bg-blue-500',
      view: 'categories'
    },
    {
      title: 'All Products',
      description: 'Browse all products in the marketplace',
      icon: <Tag className="w-8 h-8" />,
      color: 'bg-pink-500',
      view: 'products'
    },
    {
      title: 'List of Shop Details',
      description: 'Explore all shops in the mall',
      icon: <Store className="w-8 h-8" />,
      color: 'bg-green-500',
      view: 'shops'
    },
    {
      title: 'List Offer Products',
      description: 'Discover current offers and deals',
      icon: <Tag className="w-8 h-8" />,
      color: 'bg-red-500',
      view: 'offers'
    },
    {
      title: 'Compare Products',
      description: 'Compare costs and features',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'bg-purple-500',
      view: 'compare'
    },
    {
      title: 'Advanced Filter',
      description: 'Filter shops and products',
      icon: <Filter className="w-8 h-8" />,
      color: 'bg-orange-500',
      view: 'filter'
    },
    {
      title: 'Shop Wise Offers',
      description: 'Offers by specific shops',
      icon: <Gift className="w-8 h-8" />,
      color: 'bg-pink-500',
      view: 'shopOffers'
    },
    {
      title: 'Floor Wise Details',
      description: 'Explore shops by floor',
      icon: <Building2 className="w-8 h-8" />,
      color: 'bg-indigo-500',
      view: 'floors'
    },
    {
      title: 'View Shop Details',
      description: 'Detailed shop information',
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-teal-500',
      view: 'shopDetails'
    }
  ];

  // Handlers for header
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };
  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  // Fetch user role from Firestore after login/signup
  const fetchUserRole = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let role = 'user';
      if (userDoc.exists() && userDoc.data().role) {
        role = userDoc.data().role;
      }
      setUser({
        isAuthenticated: true,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        role,
        uid: firebaseUser.uid,
      });
    } catch (error) {
      setUser({
        isAuthenticated: true,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        role: 'user',
        uid: firebaseUser.uid,
      });
    }
  };

  const handleLoginSuccess = (firebaseUser) => {
    fetchUserRole(firebaseUser);
  };
  const handleSignupSuccess = (firebaseUser) => {
    fetchUserRole(firebaseUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SuperMall...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col`}>
      {/* Header */}
      <SuperMallHeader
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchData={searchData}
        onNavigate={onNavigate}
        onLogin={handleLoginClick}
        onSignup={handleSignupClick}
        onShowAbout={() => setShowAbout(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowNotifications={() => setShowNotifications(true)}
      />
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={handleSignupClick}
      />
      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={handleLoginClick}
      />
      {showAbout && <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />}
      {showProfile && <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} user={user} />}
      {showNotifications && <NotificationsModal open={showNotifications} onClose={() => setShowNotifications(false)} />}
      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setShowAbout(false)}
              title="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300">About SuperMall</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              SuperMall is a modern digital marketplace for merchant counters and stalls, built with React and Firebase. Browse products, offers, and shops, and manage everything from a powerful admin dashboard.<br /><br />
              <strong>Developed by:</strong> Yuvraj Singh
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Section: Stats */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Marketplace Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[120px] transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Merchant Counters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalShops}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[120px] transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-2">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Product Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOffers}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[120px] transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 mb-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Product Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[120px] transition-all duration-200">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 mb-2">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Marketplace Sections</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFloors}</p>
            </div>
          </div>
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Section: Recent Updates */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Updates</h2>
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 min-h-[100px] flex items-center justify-center text-blue-500 dark:text-blue-300 border border-blue-100 dark:border-gray-700">
            <Star className="w-8 h-8 mr-3 animate-bounce" />
            <span className="text-lg font-medium">New offers and shops will appear here soon.</span>
          </div>
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Section: Features */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => onNavigate(feature.view)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 h-full flex flex-col justify-between cursor-pointer transform transition-all duration-200 hover:scale-[1.03] hover:shadow-md border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 group min-h-[160px]"
                tabIndex={0}
                aria-label={feature.title}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: feature.color.replace('bg-', '').replace('-500', '') }}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-1">{feature.description}</p>
              </div>
            ))}
          </div>
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* Section: Quick Actions */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-8">
            <button
              onClick={() => onNavigate('floors')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Explore Floors</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Browse by marketplace sections</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Discover merchant counters organized by floor levels</p>
            </button>

            <button
              onClick={() => onNavigate('categories')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Browse Categories</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Shop by product type</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Find products and services by category</p>
            </button>

            <button
              onClick={() => onNavigate('shops')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">All Shops</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">View all merchant counters</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Explore all merchant counters and their offerings</p>
            </button>

            <button
              onClick={() => onNavigate('offers')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                  <Tag className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Special Offers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Deals and discounts</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Discover amazing deals and product offers</p>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Quick Add (Admin) */}
      <button
        className="fixed bottom-8 right-8 z-30 bg-blue-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
        aria-label="Quick Add"
        title="FAQs"
        onClick={() => setShowFAQ(true)}
      >
        <span className="group-hover:rotate-90 transition-transform duration-200">+</span>
      </button>
      {showFAQ && <FAQModal open={showFAQ} onClose={() => setShowFAQ(false)} />}
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t mt-8 py-4 text-center text-gray-500 dark:text-gray-300 text-sm">
        <span className="font-bold text-blue-600 dark:text-blue-300">SuperMall</span> &mdash; India’s Digital Marketplace<br />
        &copy; {new Date().getFullYear()} SuperMall. All rights reserved.
      </footer>
    </div>
  );
};

export default UserHome; 