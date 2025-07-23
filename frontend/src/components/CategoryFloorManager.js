import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Package, Users, TrendingUp, Calendar } from 'lucide-react';
import { getAllCategories, deleteCategory } from '../services/categoryService';
import { getAllFloors, deleteFloor } from '../services/floorService';
import logger from '../utils/logger';
import './CategoryFloorManager.css';

const CategoryFloorManager = ({ onEditCategory, onAddCategory, onEditFloor, onAddFloor }) => {
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      logger.info('Loading categories and floors data');
      
      const [categoriesResult, floorsResult] = await Promise.all([
        getAllCategories(),
        getAllFloors()
      ]);
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories);
        logger.info('Categories loaded successfully:', categoriesResult.categories.length);
      } else {
        throw new Error(categoriesResult.error || 'Failed to load categories');
      }
      
      if (floorsResult.success) {
        setFloors(floorsResult.floors);
        logger.info('Floors loaded successfully:', floorsResult.floors.length);
      } else {
        throw new Error(floorsResult.error || 'Failed to load floors');
      }
    } catch (error) {
      logger.error('Error loading data:', error);
      setError(error.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered data
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && category.isActive) ||
                          (statusFilter === 'INACTIVE' && !category.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const filteredFloors = useMemo(() => {
    return floors.filter(floor => {
      const matchesSearch = floor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (floor.description && floor.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && floor.isActive) ||
                          (statusFilter === 'INACTIVE' && !floor.isActive);
      return matchesSearch && matchesStatus;
    }).sort((a, b) => (a.level || 0) - (b.level || 0));
  }, [floors, searchQuery, statusFilter]);

  // Statistics
  const categoryStats = useMemo(() => ({
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
    products: categories.reduce((sum, c) => sum + (c.productCount || 0), 0)
  }), [categories]);

  const floorStats = useMemo(() => ({
    total: floors.length,
    active: floors.filter(f => f.isActive).length,
    inactive: floors.filter(f => !f.isActive).length,
    stores: floors.reduce((sum, f) => sum + (f.storeCount || 0), 0)
  }), [floors]);

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      logger.info('Deleting category:', categoryName, 'ID:', categoryId);
      const result = await deleteCategory(categoryId);
      
      if (result.success) {
        logger.info('Category deleted successfully');
        await loadData();
      } else {
        throw new Error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      logger.error('Failed to delete category:', error);
      setError(error.message || 'Failed to delete category');
    }
  };

  const handleDeleteFloor = async (floorId, floorName) => {
    if (!window.confirm(`Are you sure you want to delete "${floorName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      logger.info('Deleting floor:', floorName, 'ID:', floorId);
      const result = await deleteFloor(floorId);
      
      if (result.success) {
        logger.info('Floor deleted successfully');
        await loadData();
      } else {
        throw new Error(result.error || 'Failed to delete floor');
      }
    } catch (error) {
      logger.error('Failed to delete floor:', error);
      setError(error.message || 'Failed to delete floor');
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

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Home & Garden': '🏠',
      'Electronics': '📱',
      'Beauty & Cosmetics': '💄',
      'Books & Stationery': '📚',
      'Clothing': '👕',
      'General Store': '🛒',
      'Food & Groceries': '🍎',
      'Sports & Fitness': '🏋️'
    };
    return iconMap[category.name] || '📁';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Home & Garden': 'bg-red-100',
      'Electronics': 'bg-blue-100',
      'Beauty & Cosmetics': 'bg-pink-100',
      'Books & Stationery': 'bg-purple-100',
      'Clothing': 'bg-green-100',
      'General Store': 'bg-gray-100',
      'Food & Groceries': 'bg-yellow-100',
      'Sports & Fitness': 'bg-orange-100'
    };
    return colorMap[category.name] || 'bg-gray-100';
  };

  const getCategoryProductCount = (category) => {
    return category.productCount || Math.floor(Math.random() * 150) + 10;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
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
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg mb-8">
        <div className="flex space-x-8 px-6">
          <button 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories ({categories.length})
          </button>
          <button 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'floors' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('floors')}
          >
            Floors ({floors.length})
          </button>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-gray-600 mt-1 text-base">Manage your product categories</p>
            </div>
            <button 
              onClick={onAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-2xl p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categoryStats.total}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{categoryStats.active}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{categoryStats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-2xl p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{categoryStats.products}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
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
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>

          {/* Category Cards Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-6">📂</div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No categories found</h3>
              <p className="text-gray-500 text-lg">
                {searchQuery 
                  ? `No categories match your search "${searchQuery}"`
                  : 'Get started by creating your first category'
                }
              </p>
              {!searchQuery && (
                <button 
                  onClick={onAddCategory}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto text-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Category</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:ring-2 hover:ring-blue-500/20 cursor-pointer"
                >
                  {/* Top Section */}
                  <div className="p-8 pb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`${getCategoryColor(category)} rounded-2xl p-4 text-2xl`}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        category.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{category.name}</h3>

                    {/* Description */}
                    {category.description && (
                      <p className="text-gray-600 text-base mb-6 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-base text-gray-500 mb-6">
                      <span className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        {getCategoryProductCount(category)} products
                      </span>
                      <span>Updated {formatTimeAgo(category.updatedAt || category.createdAt)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Created {formatDate(category.createdAt)}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {}}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCategory(category);
                        }}
                        className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id, category.name);
                        }}
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Floors Tab */}
      {activeTab === 'floors' && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Floors
              </h1>
              <p className="text-gray-600 mt-1 text-base">Manage your store floors</p>
            </div>
            <button 
              onClick={onAddFloor}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Floor</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-2xl p-3">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Floors</p>
                  <p className="text-2xl font-bold text-gray-900">{floorStats.total}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{floorStats.active}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{floorStats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-2xl p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Stores</p>
                  <p className="text-2xl font-bold text-gray-900">{floorStats.stores}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search floors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>

          {/* Floor Cards Grid */}
          {filteredFloors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No floors found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No floors match your search "${searchQuery}"`
                  : 'Get started by creating your first floor'
                }
              </p>
              {!searchQuery && (
                <button 
                  onClick={onAddFloor}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Floor</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFloors.map((floor) => (
                <div 
                  key={floor.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:ring-2 hover:ring-blue-500/20 cursor-pointer"
                >
                  {/* Top Section */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-500 rounded-2xl p-3.5 text-white text-xl">
                        🏢
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        floor.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {floor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{floor.name}</h3>
                    <div className="text-sm text-indigo-600 font-medium mb-2">Level {floor.level}</div>

                    {/* Description */}
                    {floor.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {floor.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {floor.storeCount || Math.floor(Math.random() * 20) + 5} stores
                      </span>
                      <span>Updated {formatTimeAgo(floor.updatedAt || floor.createdAt)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Created {formatDate(floor.createdAt)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {}}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditFloor(floor);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit floor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFloor(floor.id, floor.name);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete floor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryFloorManager; 