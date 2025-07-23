import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Tag
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const UserCategoryView = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [loading, setLoading] = useState(true);
  const [filterFloor, setFilterFloor] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchShopsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0]);
      }
    } catch (error) {
      logger.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopsByCategory = async (categoryId) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'shops'),
          where('categoryId', '==', categoryId),
          orderBy('name')
        )
      );
      const shopsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShops(shopsData);
    } catch (error) {
      logger.error('Error fetching shops by category:', error);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = filterFloor === 'all' || shop.floorLevel?.toString() === filterFloor || shop.floorId === filterFloor;
    return matchesSearch && matchesFloor;
  });

  const getFloorLevels = () => {
    const floors = [...new Set(shops.map(shop => shop.floorLevel))].sort((a, b) => a - b);
    return floors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Category Wise Details</h1>
                <p className="text-gray-600 mt-1">Browse shops and products by category</p>
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
        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                  selectedCategory?.id === category.id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className={`text-sm font-medium ${
                      selectedCategory?.id === category.id ? 'text-white' : 'text-white'
                    }`}>
                      {category.name}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterFloor}
                  onChange={(e) => setFilterFloor(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Floors</option>
                  {getFloorLevels().map(floor => (
                    <option key={floor} value={floor}>Floor {floor}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-600">
                {filteredShops.length} shops found
              </p>
            </div>
          </div>
        </div>

        {/* Shops Grid/List */}
        {selectedCategory && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory.name} Shops
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <ShoppingBag className="w-5 h-5" />
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
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => {
                      onNavigate('shopDetails', { shopId: shop.id });
                    }}
                    className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                      viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <Store className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                            <p className="text-sm text-gray-600">Floor {shop.floorLevel}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {shop.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Shop {shop.shopNumber}</span>
                          </div>
                          {shop.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{shop.rating}</span>
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
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Floor {shop.floorLevel}</p>
                          <p className="text-sm text-gray-500">Shop {shop.shopNumber}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCategoryView; 