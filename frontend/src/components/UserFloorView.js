import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Store, 
  Search, 
  Filter, 
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShoppingBag,
  Users,
  Clock
} from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const UserFloorView = ({ onNavigate }) => {
  const [floors, setFloors] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (floors.length > 0 && !selectedFloor) {
      setSelectedFloor(floors[0]);
    }
  }, [floors]);

  const fetchData = async () => {
    try {
      const [floorsSnapshot, shopsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'floors'), orderBy('level'))),
        getDocs(query(collection(db, 'shops'), orderBy('name'))),
        getDocs(query(collection(db, 'categories'), orderBy('name')))
      ]);

      const floorsData = floorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setFloors(floorsData);
      setShops(shopsData);
      setCategories(categoriesData);
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShopsByFloor = (floorLevel) => {
    return shops.filter(shop => shop.floorLevel === floorLevel || shop.floorId === floorLevel);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const filteredShops = selectedFloor 
    ? getShopsByFloor(selectedFloor.level).filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || shop.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  const getFloorStats = (floorLevel) => {
    const floorShops = getShopsByFloor(floorLevel);
    return {
      totalShops: floorShops.length,
      categories: new Set(floorShops.map(shop => shop.categoryId)).size,
      ratedShops: floorShops.filter(shop => shop.rating).length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading floors...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Floor Wise Details</h1>
                <p className="text-gray-600 mt-1">Explore shops by floor</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Floor Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {floors.map((floor) => {
            const stats = getFloorStats(floor.level);
            const isSelected = selectedFloor?.id === floor.id;
            
            return (
              <div
                key={floor.id}
                onClick={() => setSelectedFloor(floor)}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={floor.image}
                    alt={floor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Floor {floor.level}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'} mb-1`}>
                    {floor.name || 'Shopping Floor'}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'} mb-3`}>
                    {floor.description || 'Explore shops and services'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shops:</span>
                      <span className="font-medium">{stats.totalShops}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Categories:</span>
                      <span className="font-medium">{stats.categories}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rated:</span>
                      <span className="font-medium">{stats.ratedShops}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Floor Details */}
        {selectedFloor && (
          <>
            {/* Floor Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Floor {selectedFloor.level} - {selectedFloor.name || 'Shopping Floor'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedFloor.description || 'Explore shops and services on this floor'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{filteredShops.length}</div>
                    <div className="text-sm text-gray-600">Shops Found</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('all');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Floor Map Visualization */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Floor Layout</h3>
              <div className="bg-gray-100 rounded-lg p-8 min-h-64 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive floor map coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {filteredShops.length} shops available on this floor
                  </p>
                </div>
              </div>
            </div>

            {/* Shops Grid */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Shops on Floor {selectedFloor.level}</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Store className="w-5 h-5" />
                  <span>{filteredShops.length} shops</span>
                </div>
              </div>

              {filteredShops.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShops.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => {
                        onNavigate('shopDetails', { shopId: shop.id });
                      }}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-6"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                          <p className="text-sm text-gray-600">{getCategoryName(shop.categoryId)}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {shop.description || 'No description available'}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Shop {shop.shopNumber}</span>
                        </div>
                        {shop.rating && (
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-gray-700">{shop.rating} rating</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {shop.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            <span>Contact</span>
                          </div>
                        )}
                        {shop.website && (
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            <span>Website</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserFloorView; 