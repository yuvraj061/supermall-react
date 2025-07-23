import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ArrowLeft,
  Star,
  Store,
  Clock,
  Percent,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const UserOfferList = ({ onNavigate }) => {
  const [offers, setOffers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterShop, setFilterShop] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [selectedOffers, setSelectedOffers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersSnapshot, shopsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'offers'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'shops'), orderBy('name')))
      ]);

      const offersData = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOffers(offersData);
      setShops(shopsData);
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOfferStatus = (offer) => {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop?.name || 'Unknown Shop';
  };

  const filteredAndSortedOffers = offers
    .filter(offer => {
      const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getShopName(offer.shopId).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesShop = filterShop === 'all' || offer.shopId === filterShop;
      const matchesStatus = filterStatus === 'all' || getOfferStatus(offer) === filterStatus;
      return matchesSearch && matchesShop && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price':
          return (a.originalPrice || 0) - (b.originalPrice || 0);
        default:
          return 0;
      }
    });

  const toggleOfferSelection = (offerId) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Offers & Deals</h1>
                <p className="text-gray-600 mt-1">Discover amazing deals and discounts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Tag className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(offer => getOfferStatus(offer) === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Participating Shops</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(offers.map(offer => offer.shopId)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Discount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.length > 0 
                    ? Math.round(offers.reduce((sum, offer) => sum + (offer.discountPercentage || 0), 0) / offers.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Filters & Sort</h2>
            <div className="flex items-center space-x-4">
              {selectedOffers.length > 0 && (
                <button
                  onClick={() => onNavigate('compare', { offerIds: selectedOffers })}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare ({selectedOffers.length})
                </button>
              )}
              <p className="text-sm text-gray-600">
                {filteredAndSortedOffers.length} offers found
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-gray-600" />
              <select
                value={filterShop}
                onChange={(e) => setFilterShop(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Shops</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="discount">Sort by Discount</option>
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterShop('all');
                setFilterStatus('all');
                setSortBy('discount');
                setSelectedOffers([]);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Offers Grid/List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {filteredAndSortedOffers.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredAndSortedOffers.map((offer) => {
                const status = getOfferStatus(offer);
                const isSelected = selectedOffers.includes(offer.id);
                
                return (
                  <div
                    key={offer.id}
                    className={`bg-white border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                      isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    } ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}
                    onClick={() => toggleOfferSelection(offer.id)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {offer.discountPercentage || 0}% OFF
                          </div>
                          <div className="absolute top-2 left-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div>
                              <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                              <p className="text-sm text-gray-600">{getShopName(offer.shopId)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {offer.description || 'No description available'}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Original Price:</span>
                            <span className="text-sm font-medium line-through text-gray-400">
                              ${offer.originalPrice || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Discounted Price:</span>
                            <span className="text-sm font-bold text-green-600">
                              ${offer.discountedPrice || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Discount:</span>
                            <span className="text-sm font-bold text-red-600">
                              {offer.discountPercentage || 0}% OFF
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>View Details</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                          <Tag className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                          <p className="text-sm text-gray-600">{offer.description || 'No description available'}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{getShopName(offer.shopId)}</span>
                            <span className="text-green-600 font-medium">{offer.discountPercentage || 0}% OFF</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} mb-2`}>
                            {status}
                          </div>
                          <p className="text-sm text-gray-600">
                            ${offer.discountedPrice || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            ${offer.originalPrice || 'N/A'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOfferList; 