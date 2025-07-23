import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Tag, TrendingUp, Calendar, DollarSign, Store, Clock, Percent } from 'lucide-react';
import { getAllOffers, deleteOffer } from '../services/offerService';
import { getAllShops } from '../services/shopService';
import logger from '../utils/logger';
import './OfferList.css';

const OfferList = ({ onEditOffer, onAddOffer }) => {
  const [offers, setOffers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [shopFilter, setShopFilter] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    logger.info('Loading offers and shops data');
    
    try {
      const [offersResult, shopsResult] = await Promise.all([
        getAllOffers(),
        getAllShops()
      ]);
      
      if (offersResult.success && shopsResult.success) {
        setOffers(offersResult.offers);
        setShops(shopsResult.shops);
        logger.info('Data loaded successfully - Offers:', offersResult.offers.length, 'Shops:', shopsResult.shops.length);
      } else {
        setError('Failed to load data');
        logger.error('Failed to load data:', offersResult.error || shopsResult.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      logger.error('Error loading data:', error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const isOfferActive = (offer) => {
    if (!offer.isActive) return false;
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return now >= startDate && now <= endDate;
  };

  const getOfferStatus = (offer) => {
    if (!offer.isActive) return { status: 'inactive', label: 'Inactive', class: 'bg-gray-100 text-gray-700' };
    if (isOfferActive(offer)) return { status: 'active', label: 'Active', class: 'bg-emerald-100 text-emerald-700' };
    const now = new Date();
    const startDate = new Date(offer.startDate);
    return now < startDate 
      ? { status: 'upcoming', label: 'Upcoming', class: 'bg-blue-100 text-blue-700' }
      : { status: 'expired', label: 'Expired', class: 'bg-red-100 text-red-700' };
  };

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const offerStatus = getOfferStatus(offer);
      const matchesStatus = statusFilter === 'ALL' || offerStatus.status === statusFilter.toLowerCase();
      const matchesShop = shopFilter === 'ALL' || offer.shopId === shopFilter;
      
      return matchesSearch && matchesStatus && matchesShop;
    });
  }, [offers, searchQuery, statusFilter, shopFilter]);

  // Statistics
  const offerStats = useMemo(() => {
    const active = offers.filter(o => getOfferStatus(o).status === 'active').length;
    const upcoming = offers.filter(o => getOfferStatus(o).status === 'upcoming').length;
    const expired = offers.filter(o => getOfferStatus(o).status === 'expired').length;
    const inactive = offers.filter(o => getOfferStatus(o).status === 'inactive').length;
    
    return {
      total: offers.length,
      active,
      upcoming,
      expired,
      inactive,
      totalDiscount: offers.reduce((sum, o) => sum + (o.discountPercentage || 0), 0)
    };
  }, [offers]);

  // Get unique shops for filter
  const uniqueShops = useMemo(() => {
    return shops.filter(shop => offers.some(offer => offer.shopId === shop.id));
  }, [shops, offers]);

  const handleDeleteOffer = async (offerId, offerTitle) => {
    if (window.confirm(`Are you sure you want to delete "${offerTitle}"? This action cannot be undone.`)) {
      logger.info('Deleting offer:', offerTitle, 'ID:', offerId);
      
      const result = await deleteOffer(offerId);
      
      if (result.success) {
        logger.info('Offer deleted successfully, reloading data');
        loadData();
      } else {
        setError(result.error || 'Failed to delete offer');
        logger.error('Failed to delete offer:', result.error);
      }
    }
  };

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : 'Unknown Shop';
  };

  const getShopCategory = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.category : '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
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

  const getOfferIcon = (offer) => {
    const status = getOfferStatus(offer);
    const iconMap = {
      'active': '🔥',
      'upcoming': '⏰',
      'expired': '⏳',
      'inactive': '🚫'
    };
    return iconMap[status.status] || '🏷️';
  };

  const getOfferColor = (offer) => {
    const status = getOfferStatus(offer);
    const colorMap = {
      'active': 'bg-red-100',
      'upcoming': 'bg-blue-100',
      'expired': 'bg-gray-100',
      'inactive': 'bg-gray-100'
    };
    return colorMap[status.status] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
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
            Offer Management
          </h1>
          <p className="text-gray-600 mt-1 text-base">Manage product offers, deals, and promotions</p>
        </div>
        <button 
          onClick={onAddOffer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Offer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-2xl p-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{offerStats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{offerStats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-2xl p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{offerStats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-2xl p-3">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Discount</p>
              <p className="text-2xl font-bold text-gray-900">
                {offerStats.total > 0 ? Math.round(offerStats.totalDiscount / offerStats.total) : 0}%
              </p>
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
            placeholder="Search offers by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active Only</option>
          <option value="UPCOMING">Upcoming Only</option>
          <option value="EXPIRED">Expired Only</option>
          <option value="INACTIVE">Inactive Only</option>
        </select>
        <select
          value={shopFilter}
          onChange={(e) => setShopFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        >
          <option value="ALL">All Shops</option>
          {uniqueShops.map(shop => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </select>
      </div>

      {/* Offer Cards Grid */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-6">🏷️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">No offers found</h3>
          <p className="text-gray-500 text-lg">
            {searchQuery 
              ? `No offers match your search "${searchQuery}"`
              : 'Get started by creating your first offer'
            }
          </p>
          {!searchQuery && (
            <button 
              onClick={onAddOffer}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Offer</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOffers.map((offer) => {
            const status = getOfferStatus(offer);
            return (
              <div 
                key={offer.id}
                className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:ring-2 hover:ring-blue-500/20 cursor-pointer"
              >
                {/* Top Section */}
                <div className="p-8 pb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`${getOfferColor(offer)} rounded-2xl p-4 text-2xl`}>
                      {getOfferIcon(offer)}
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                  
                  {/* Shop Info */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <Store className="h-4 w-4 mr-2" />
                    <span className="text-sm">{getShopName(offer.shopId)}</span>
                  </div>

                  {/* Shop Category */}
                  {getShopCategory(offer.shopId) && (
                    <div className="mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getShopCategory(offer.shopId)}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {offer.description && (
                    <p className="text-gray-600 text-base mb-6 line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 line-through text-sm">₹{offer.originalPrice}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                        {offer.discountPercentage}% OFF
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{offer.discountedPrice}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Start: {formatDate(offer.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>End: {formatDate(offer.endDate)}</span>
                    </div>
                  </div>

                  {/* Terms */}
                  {offer.terms && (
                    <div className="mb-6">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        <strong>Terms:</strong> {offer.terms}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-base text-gray-500 mb-6">
                    <span>Updated {formatTimeAgo(offer.updatedAt || offer.createdAt)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created {formatDate(offer.createdAt)}
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditOffer(offer);
                      }}
                      className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit offer"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOffer(offer.id, offer.title);
                      }}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete offer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OfferList; 