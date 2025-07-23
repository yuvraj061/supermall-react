import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  Tag,
  ShoppingBag,
  Building2,
  Calendar,
  Users,
  Eye,
  Heart
} from 'lucide-react';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const ShopDetails = ({ onNavigate, shopId }) => {
  const [shop, setShop] = useState(null);
  const [offers, setOffers] = useState([]);
  const [category, setCategory] = useState(null);
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const fetchShopDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const shopDoc = await getDoc(doc(db, 'shops', shopId));
      if (shopDoc.exists()) {
        const shopData = { id: shopDoc.id, ...shopDoc.data() };
        setShop(shopData);
        // Fetch related data
        const [categoryDoc, floorDoc, offersSnapshot] = await Promise.all([
          shopData.categoryId ? getDoc(doc(db, 'categories', shopData.categoryId)) : null,
          shopData.floorId ? getDoc(doc(db, 'floors', shopData.floorId)) : null,
          getDocs(query(collection(db, 'offers'), where('shopId', '==', shopId), orderBy('createdAt', 'desc')))
        ]);
        if (categoryDoc?.exists()) {
          setCategory({ id: categoryDoc.id, ...categoryDoc.data() });
        }
        if (floorDoc?.exists()) {
          setFloor({ id: floorDoc.id, ...floorDoc.data() });
        }
        const offersData = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOffers(offersData);
      } else {
        setError('Shop not found.');
        setShop(null);
      }
    } catch (error) {
      logger.error('Error fetching shop details:', error);
      setError('Failed to load shop details. Please try again.');
      setShop(null);
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
          <p className="mt-4 text-gray-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
          <button
            onClick={fetchShopDetails}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-4"
          >
            Retry
          </button>
          <button
            onClick={() => onNavigate('shops')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mt-2"
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shop not found</h3>
          <p className="text-gray-600 mb-4">The shop you're looking for doesn't exist</p>
          <button
            onClick={() => onNavigate('shops')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Banner Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={shop.bannerImage}
              alt={shop.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold">{shop.name}</h1>
                    <p className="text-white text-opacity-90 mt-1">Shop Details & Information</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{shop.rating || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-white mr-1" />
                        <span>Floor {shop.floorLevel} • Shop {shop.shopNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('shops')}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-white" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
                    <Heart className="w-6 h-6 text-white" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
                    <Eye className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shop Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Store className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h2>
                  <p className="text-gray-600 mb-4">
                    {shop.description || 'No description available'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{offers.length}</div>
                      <div className="text-sm text-gray-600">Active Offers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {shop.rating || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {shop.floorLevel || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Floor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {shop.shopNumber || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Shop #</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shop.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{shop.phone}</p>
                    </div>
                  </div>
                )}
                
                {shop.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{shop.email}</p>
                    </div>
                  </div>
                )}
                
                {shop.website && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a 
                        href={shop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      Floor {shop.floorLevel} • Shop {shop.shopNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Offers */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Current Offers</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Tag className="w-5 h-5" />
                  <span>{offers.length} offers</span>
                </div>
              </div>

              {offers.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No current offers available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => {
                    const status = getOfferStatus(offer);
                    return (
                      <div
                        key={offer.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {offer.description || 'No description available'}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Original Price:</span>
                            <div className="font-medium line-through text-gray-400">
                              ${offer.originalPrice || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Discounted Price:</span>
                            <div className="font-bold text-green-600">
                              ${offer.discountedPrice || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Discount:</span>
                            <div className="font-bold text-red-600">
                              {offer.discountPercentage || 0}% OFF
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Valid Until:</span>
                            <div className="font-medium text-gray-900">
                              {formatDate(offer.endDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Floor Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Information</h3>
              
              {category && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Category</span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">{category.name}</p>
                </div>
              )}
              
              {floor && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Floor</span>
                  </div>
                  <p className="font-medium text-gray-900 ml-11">
                    Floor {floor.level} - {floor.name}
                  </p>
                </div>
              )}
              
              {shop.rating && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <div className="flex items-center ml-11">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(shop.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({shop.rating})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('offers', { shopId: shop.id })}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  View All Offers
                </button>
                <button
                  onClick={() => onNavigate('floors')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Explore Floor
                </button>
                <button
                  onClick={() => onNavigate('shops')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Browse All Shops
                </button>
              </div>
            </div>

            {/* Business Hours */}
            {shop.businessHours && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(shop.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{day}</span>
                      <span className="font-medium text-gray-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails; 