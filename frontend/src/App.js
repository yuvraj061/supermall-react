import React, { useState, useEffect } from 'react';
import './App.css';
import AdminLogin from './components/AdminLogin';
import ShopList from './components/ShopList';
import ShopForm from './components/ShopForm';
import OfferList from './components/OfferList';
import OfferForm from './components/OfferForm';
import CategoryFloorManager from './components/CategoryFloorManager';
import CategoryForm from './components/CategoryForm';
import FloorForm from './components/FloorForm';
// User Components
import UserHome from './components/UserHome';
import UserCategoryView from './components/UserCategoryView';
import UserShopList from './components/UserShopList';
import UserOfferList from './components/UserOfferList';
import ProductComparison from './components/ProductComparison';
import UserFloorView from './components/UserFloorView';
import ShopDetails from './components/ShopDetails';
import DataSeeder from './components/DataSeeder';
import ProductInfoUpdater from './components/ProductInfoUpdater';
import { getCurrentUser, onAuthStateChange } from './services/authService';
import logger from './utils/logger';
import UserProductList from './components/UserProductList';
import UserProductDetails from './components/UserProductDetails';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, categories, shops, offers, compare, floors, shopDetails, admin, dashboard, shopList, shopForm, offerList, offerForm, categoryFloor, categoryForm, floorForm
  const [editingShop, setEditingShop] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingFloor, setEditingFloor] = useState(null);
  const [navigationData, setNavigationData] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      logger.info('User already logged in:', currentUser.email);
    }
    setLoading(false);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
    logger.info('Login successful, user set:', user.email);
  };

  const handleLogout = async () => {
    try {
      const { adminLogout } = await import('./services/authService');
      const result = await adminLogout();
      if (result.success) {
        setUser(null);
        setCurrentView('home');
        setEditingShop(null);
        setEditingOffer(null);
        setEditingCategory(null);
        setEditingFloor(null);
        setNavigationData({});
      }
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  const handleNavigate = (view, data = {}) => {
    setCurrentView(view);
    setNavigationData(data);
    
    // Handle admin-specific data
    if (data.shop) setEditingShop(data.shop);
    if (data.offer) setEditingOffer(data.offer);
    if (data.category) setEditingCategory(data.category);
    if (data.floor) setEditingFloor(data.floor);
    
    logger.info('Navigating to:', view, 'with data:', data);
  };

  // Shop management handlers
  const handleAddShop = () => {
    setEditingShop(null);
    setCurrentView('shopForm');
    logger.info('Navigating to add shop form');
  };

  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setCurrentView('shopForm');
    logger.info('Navigating to edit shop form for:', shop.name);
  };

  const handleShopFormSuccess = () => {
    setCurrentView('shopList');
    setEditingShop(null);
    logger.info('Shop form completed successfully, returning to shop list');
  };

  const handleShopFormCancel = () => {
    setCurrentView('shopList');
    setEditingShop(null);
    logger.info('Shop form cancelled, returning to shop list');
  };

  // Offer management handlers
  const handleAddOffer = () => {
    setEditingOffer(null);
    setCurrentView('offerForm');
    logger.info('Navigating to add offer form');
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setCurrentView('offerForm');
    logger.info('Navigating to edit offer form for:', offer.title);
  };

  const handleOfferFormSuccess = () => {
    setCurrentView('offerList');
    setEditingOffer(null);
    logger.info('Offer form completed successfully, returning to offer list');
  };

  const handleOfferFormCancel = () => {
    setCurrentView('offerList');
    setEditingOffer(null);
    logger.info('Offer form cancelled, returning to offer list');
  };

  // Category management handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCurrentView('categoryForm');
    logger.info('Navigating to add category form');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCurrentView('categoryForm');
    logger.info('Navigating to edit category form for:', category.name);
  };

  const handleCategoryFormSuccess = () => {
    setCurrentView('categoryFloor');
    setEditingCategory(null);
    logger.info('Category form completed successfully, returning to category/floor manager');
  };

  const handleCategoryFormCancel = () => {
    setCurrentView('categoryFloor');
    setEditingCategory(null);
    logger.info('Category form cancelled, returning to category/floor manager');
  };

  // Floor management handlers
  const handleAddFloor = () => {
    setEditingFloor(null);
    setCurrentView('floorForm');
    logger.info('Navigating to add floor form');
  };

  const handleEditFloor = (floor) => {
    setEditingFloor(floor);
    setCurrentView('floorForm');
    logger.info('Navigating to edit floor form for:', floor.name);
  };

  const handleFloorFormSuccess = () => {
    setCurrentView('categoryFloor');
    setEditingFloor(null);
    logger.info('Floor form completed successfully, returning to category/floor manager');
  };

  const handleFloorFormCancel = () => {
    setCurrentView('categoryFloor');
    setEditingFloor(null);
    logger.info('Floor form cancelled, returning to category/floor manager');
  };

  const renderAdminNavigation = () => (
    <nav className="admin-navigation">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
      >
        Dashboard
      </button>
      <button 
        onClick={() => setCurrentView('shopList')}
        className={`nav-button ${currentView === 'shopList' ? 'active' : ''}`}
      >
        Shop Management
      </button>
      <button 
        onClick={() => setCurrentView('offerList')}
        className={`nav-button ${currentView === 'offerList' ? 'active' : ''}`}
      >
        Offer Management
      </button>
      <button 
        onClick={() => setCurrentView('categoryFloor')}
        className={`nav-button ${currentView === 'categoryFloor' ? 'active' : ''}`}
      >
        Category & Floor
      </button>
    </nav>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // User Views (no authentication required)
  if (currentView === 'home') {
    return <UserHome onNavigate={handleNavigate} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  if (currentView === 'categories') {
    return <UserCategoryView onNavigate={handleNavigate} />;
  }

  if (currentView === 'shops') {
    return <UserShopList onNavigate={handleNavigate} />;
  }

  if (currentView === 'offers') {
    return <UserOfferList onNavigate={handleNavigate} />;
  }

  if (currentView === 'compare') {
    return <ProductComparison onNavigate={handleNavigate} offerIds={navigationData.offerIds || []} />;
  }

  if (currentView === 'floors') {
    return <UserFloorView onNavigate={handleNavigate} />;
  }

  if (currentView === 'shopDetails') {
    return <ShopDetails onNavigate={handleNavigate} shopId={navigationData.shopId} />;
  }

  if (currentView === 'seeder') {
    return <DataSeeder onNavigate={handleNavigate} />;
  }

  if (currentView === 'productUpdate') {
    return <ProductInfoUpdater onNavigate={handleNavigate} productId={navigationData.productId} />;
  }

  if (currentView === 'products') {
    return <UserProductList onNavigate={handleNavigate} />;
  }
  if (currentView === 'productDetails') {
    return <UserProductDetails onNavigate={handleNavigate} productId={navigationData.productId} />;
  }

  // Admin Views (authentication required)
  if (!user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Admin Form Views
  if (currentView === 'shopForm') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <ShopForm 
          shop={editingShop}
          onSuccess={handleShopFormSuccess}
          onCancel={handleShopFormCancel}
        />
      </div>
    );
  }

  if (currentView === 'offerForm') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <OfferForm 
          offer={editingOffer}
          onSuccess={handleOfferFormSuccess}
          onCancel={handleOfferFormCancel}
        />
      </div>
    );
  }

  if (currentView === 'categoryForm') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <CategoryForm 
          category={editingCategory}
          onSuccess={handleCategoryFormSuccess}
          onCancel={handleCategoryFormCancel}
        />
      </div>
    );
  }

  if (currentView === 'floorForm') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <FloorForm 
          floor={editingFloor}
          onSuccess={handleFloorFormSuccess}
          onCancel={handleFloorFormCancel}
        />
      </div>
    );
  }

  // Admin List Views
  if (currentView === 'shopList') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        {renderAdminNavigation()}
        <ShopList 
          onEditShop={handleEditShop}
          onAddShop={handleAddShop}
        />
      </div>
    );
  }

  if (currentView === 'offerList') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        {renderAdminNavigation()}
        <OfferList 
          onEditOffer={handleEditOffer}
          onAddOffer={handleAddOffer}
        />
      </div>
    );
  }

  if (currentView === 'categoryFloor') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        {renderAdminNavigation()}
        <CategoryFloorManager 
          onEditCategory={handleEditCategory}
          onAddCategory={handleAddCategory}
          onEditFloor={handleEditFloor}
          onAddFloor={handleAddFloor}
        />
      </div>
    );
  }

  // Default admin dashboard view
  if (currentView === 'dashboard') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SuperMall Admin Dashboard</h1>
          <div className="header-actions">
            <span>Welcome, {user.email}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        {renderAdminNavigation()}
        <main className="App-main">
          <div className="dashboard-content">
            <h2>Admin Features</h2>
            <div className="feature-grid">
              <div className="feature-card" onClick={() => setCurrentView('shopList')}>
                <h3>Shop Management</h3>
                <p>Create and manage shop details</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('offerList')}>
                <h3>Offer Management</h3>
                <p>Manage product offers and deals</p>
              </div>
              <div className="feature-card" onClick={() => setCurrentView('categoryFloor')}>
                <h3>Category & Floor</h3>
                <p>Manage categories and floor details</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fallback to user home
  return (
    <div className={darkMode ? 'dark' : ''}>
      <UserHome onNavigate={handleNavigate} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
