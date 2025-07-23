import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Store, Users, TrendingUp, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { getAllShops, deleteShop } from '../services/shopService';
import logger from '../utils/logger';
import './ShopList.css';

const ShopList = ({ onEditShop, onAddShop }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');

  const loadShops = async () => {
    setLoading(true);
    setError('');
    
    logger.info('Loading shops list');
    
    const result = await getAllShops();
    
    if (result.success) {
      setShops(result.shops);
      logger.info('Shops loaded successfully, count:', result.shops.length);
    } else {
      setError(result.error || 'Failed to load shops');
      logger.error('Failed to load shops:', result.error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadShops();
  }, []);

  // Filtered shops
  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          shop.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'ALL' || shop.category === categoryFilter;
      const matchesFloor = floorFilter === 'ALL' || shop.floor === floorFilter;
      
      return matchesSearch && matchesCategory && matchesFloor;
    });
  }, [shops, searchQuery, categoryFilter, floorFilter]);

  // Statistics
  const shopStats = useMemo(() => ({
    total: shops.length,
    active: shops.filter(s => s.isActive !== false).length,
    inactive: shops.filter(s => s.isActive === false).length,
    categories: new Set(shops.map(s => s.category).filter(Boolean)).size
  }), [shops]);

  // Get unique categories and floors for filters
  const categories = useMemo(() => {
    const cats = [...new Set(shops.map(s => s.category).filter(Boolean))];
    return cats.sort();
  }, [shops]);

  const floors = useMemo(() => {
    const flrs = [...new Set(shops.map(s => s.floor).filter(Boolean))];
    return flrs.sort();
  }, [shops]);

  const handleDeleteShop = async (shopId, shopName) => {
    if (window.confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
      logger.info('Deleting shop:', shopName, 'ID:', shopId);
      
      const result = await deleteShop(shopId);
      
      if (result.success) {
        logger.info('Shop deleted successfully, reloading list');
        loadShops();
      } else {
        setError(result.error || 'Failed to delete shop');
        logger.error('Failed to delete shop:', result.error);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getShopIcon = (shop) => {
    const iconMap = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Food': '🍕',
      'Beauty': '💄',
      'Sports': '⚽',
      'Books': '📚',
      'Home': '🏠',
      'General': '🛒'
    };
    return iconMap[shop.category] || '🏪';
  };

  const getShopColor = (shop) => {
    const colorMap = {
      'Electronics': 'bg-blue-100',
      'Clothing': 'bg-green-100',
      'Food': 'bg-yellow-100',
      'Beauty': 'bg-pink-100',
      'Sports': 'bg-orange-100',
      'Books': 'bg-purple-100',
      'Home': 'bg-red-100',
      'General': 'bg-gray-100'
    };
    return colorMap[shop.category] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Shop Management
          </h1>
          <p className="text-gray-600 mt-1 text-base">Manage your mall shops and store details</p>
        </div>
        <button 
          onClick={onAddShop}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Shop</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-2xl p-3">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shops</p>
              <p className="text-2xl font-bold text-gray-900">{shopStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-2xl p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{shopStats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-2xl p-3">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{shopStats.inactive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-2xl p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{shopStats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search shops by name, description, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        >
          <option value="ALL">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        >
          <option value="ALL">All Floors</option>
          {floors.map(floor => (
            <option key={floor} value={floor}>{floor}</option>
          ))}
        </select>
      </div>

      {/* Shop Cards Grid */}
      {filteredShops.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-6">🏪</div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No shops found</h3>
          <p className="text-gray-500 text-lg">
            {searchQuery 
              ? `No shops match your search "${searchQuery}"`
              : 'Get started by creating your first shop'
            }
          </p>
          {!searchQuery && (
            <button 
              onClick={onAddShop}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Shop</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredShops.map((shop) => (
            <div 
              key={shop.id}
              className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:ring-2 hover:ring-blue-500/20 cursor-pointer"
            >
              {/* Top Section */}
              <div className="p-8 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`${getShopColor(shop)} rounded-2xl p-4 text-2xl`}>
                    {getShopIcon(shop)}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    shop.isActive !== false 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {shop.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{shop.name}</h3>
                
                {/* Owner */}
                <div className="flex items-center text-gray-600 mb-3">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{shop.owner}</span>
                </div>

                {/* Category and Floor */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {shop.category || 'General'}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {shop.floor || 'N/A'}
                  </span>
                </div>

                {/* Description */}
                {shop.description && (
                  <p className="text-gray-600 text-base mb-6 line-clamp-2">
                    {shop.description}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-6">
                  {shop.email && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{shop.email}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{shop.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-base text-gray-500 mb-6">
                  <span>Updated {formatTimeAgo(shop.updatedAt || shop.createdAt)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created {formatDate(shop.createdAt)}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View shop:', shop.name);
                    }}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditShop(shop);
                    }}
                    className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit shop"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteShop(shop.id, shop.name);
                    }}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete shop"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList; 