import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Tag, 
  Store, 
  DollarSign, 
  Percent, 
  Calendar, 
  Clock,
  Check,
  X,
  Star,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const ProductComparison = ({ onNavigate, offerIds = [] }) => {
  const [offers, setOffers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (offerIds.length > 0) {
      fetchComparisonData();
    }
  }, [offerIds]);

  const fetchComparisonData = async () => {
    try {
      const [offersSnapshot, shopsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'offers'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'shops'), orderBy('name')))
      ]);

      const allOffers = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const allShops = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filteredOffers = allOffers.filter(offer => offerIds.includes(offer.id));
      setOffers(filteredOffers);
      setShops(allShops);
    } catch (error) {
      logger.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop?.name || 'Unknown Shop';
  };

  const getShopDetails = (shopId) => {
    return shops.find(s => s.id === shopId) || {};
  };

  const getOfferStatus = (offer) => {
    const now = new Date();
    const startDate = offer.startDate?.toDate?.() || new Date(offer.startDate);
    const endDate = offer.endDate?.toDate?.() || new Date(offer.endDate);
    
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
    const d = date.toDate?.() || new Date(date);
    return d.toLocaleDateString();
  };

  const calculateSavings = (original, discounted) => {
    if (!original || !discounted) return 0;
    return original - discounted;
  };

  const getBestValue = () => {
    if (offers.length === 0) return null;
    return offers.reduce((best, current) => {
      const currentSavings = calculateSavings(current.originalPrice, current.discountedPrice);
      const bestSavings = calculateSavings(best.originalPrice, best.discountedPrice);
      return currentSavings > bestSavings ? current : best;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers to compare</h3>
          <p className="text-gray-600 mb-4">Select offers from the offers page to compare them</p>
          <button
            onClick={() => onNavigate('offers')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Offers
          </button>
        </div>
      </div>
    );
  }

  const bestValue = getBestValue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('offers')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
                <p className="text-gray-600 mt-1">Compare offers side by side</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <BarChart3 className="w-5 h-5" />
                <span>{offers.length} offers selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Best Value Recommendation */}
        {bestValue && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">🏆 Best Value Recommendation</h2>
                <p className="text-green-100">
                  "{bestValue.title}" from {getShopName(bestValue.shopId)} offers the highest savings of $
                  {calculateSavings(bestValue.originalPrice, bestValue.discountedPrice).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${bestValue.discountedPrice || 'N/A'}
                </div>
                <div className="text-green-100 line-through">
                  ${bestValue.originalPrice || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                  {offers.map((offer, index) => (
                    <th key={offer.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                          <Tag className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{offer.title}</div>
                          <div className="text-xs text-gray-600">{getShopName(offer.shopId)}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Price Comparison */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Pricing</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-green-600">
                          ${offer.discountedPrice || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-400 line-through">
                          ${offer.originalPrice || 'N/A'}
                        </div>
                        <div className="text-sm font-medium text-red-600">
                          {offer.discountPercentage || 0}% OFF
                        </div>
                        <div className="text-xs text-gray-600">
                          Save ${calculateSavings(offer.originalPrice, offer.discountedPrice).toFixed(2)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Status */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Status</td>
                  {offers.map((offer) => {
                    const status = getOfferStatus(offer);
                    return (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Validity Period */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Valid Period</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="space-y-1">
                        <div>From: {formatDate(offer.startDate)}</div>
                        <div>To: {formatDate(offer.endDate)}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Shop Information */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Shop Details</td>
                  {offers.map((offer) => {
                    const shop = getShopDetails(offer.shopId);
                    return (
                      <td key={offer.id} className="px-6 py-4 text-center">
                        <div className="space-y-2 text-sm">
                          <div className="font-medium text-gray-900">{shop.name}</div>
                          <div className="text-gray-600">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Floor {shop.floorLevel} • Shop {shop.shopNumber}
                          </div>
                          {shop.rating && (
                            <div className="text-gray-600">
                              <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                              {shop.rating} rating
                            </div>
                          )}
                          {shop.phone && (
                            <div className="text-gray-600">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {shop.phone}
                            </div>
                          )}
                          {shop.website && (
                            <div className="text-blue-600">
                              <Globe className="w-4 h-4 inline mr-1" />
                              Website
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Description */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Description</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="px-6 py-4 text-center">
                      <p className="text-sm text-gray-600 max-w-xs">
                        {offer.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Features</td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="px-6 py-4 text-center">
                      <div className="space-y-1 text-sm">
                        {offer.features?.map((feature, index) => (
                          <div key={index} className="flex items-center justify-center text-green-600">
                            <Check className="w-4 h-4 mr-1" />
                            {feature}
                          </div>
                        )) || (
                          <div className="text-gray-400">No features listed</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => onNavigate('offers')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Offers
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison; 