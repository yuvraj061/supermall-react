import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Tag,
  Building2,
  ShoppingBag,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const UserShopList = ({ onNavigate }) => {
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const shopsSnapshot = await getDocs(query(collection(db, 'shops'), orderBy('name')));
      const shopsData = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShops(shopsData);

      const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedShops = shops
    .filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || shop.categoryId === filterCategory;
      const matchesFloor = filterFloor === 'all' || shop.floorLevel?.toString() === filterFloor || shop.floorId === filterFloor;
      return matchesSearch && matchesCategory && matchesFloor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'floor':
          return (a.floorLevel || 0) - (b.floorLevel || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // After filtering and sorting, ensure every shop has an id
  const safeShops = filteredAndSortedShops.map(shop =>
    shop.id ? shop : { ...shop, id: shop._id || shop.key || Math.random().toString(36).substr(2, 9) }
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getFloorLevels = () => {
    const floors = [...new Set(shops.map(shop => shop.floorLevel))].sort((a, b) => a - b);
    return floors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shops...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">All Shops</h1>
                <p className="text-gray-600 mt-1">Explore all shops in Super Mall</p>
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
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shops</p>
                <p className="text-2xl font-bold text-gray-900">{shops.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Floors</p>
                <p className="text-2xl font-bold text-gray-900">{getFloorLevels().length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rated Shops</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shops.filter(shop => shop.rating).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Filters & Sort</h2>
            <p className="text-sm text-gray-600">
              {filteredAndSortedShops.length} shops found
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              <select
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Floors</option>
                {getFloorLevels().map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="floor">Sort by Floor</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterFloor('all');
                setSortBy('name');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Shops Grid/List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {safeShops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {safeShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => {
                    const fallbackId = shop.id || shop._id || shop.key || shop.shopId || '';
                    onNavigate('shopDetails', { shopId: fallbackId });
                  }}
                  className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Floor {shop.floorLevel}
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                          <p className="text-sm text-gray-600">{getCategoryName(shop.categoryId)}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {shop.description || 'No description available'}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Floor {shop.floorLevel} • Shop {shop.shopNumber}</span>
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
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Store className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                        <p className="text-sm text-gray-600">{shop.description || 'No description available'}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{getCategoryName(shop.categoryId)}</span>
                          <span>Floor {shop.floorLevel}</span>
                          {shop.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{shop.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Shop {shop.shopNumber}</p>
                        <p className="text-sm text-gray-500">{shop.phone || 'No contact'}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserShopList; 