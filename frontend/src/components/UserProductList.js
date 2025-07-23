import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ShoppingBag, Store, Tag, Search, ShoppingCart, ArrowDownAZ, ArrowUpAZ, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

const skeletonArray = Array.from({ length: 6 });

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)', icon: <ArrowDownAZ className="inline w-4 h-4 ml-1" /> },
  { value: 'name-desc', label: 'Name (Z-A)', icon: <ArrowUpAZ className="inline w-4 h-4 ml-1" /> },
  { value: 'price-asc', label: 'Price (Low-High)', icon: <ArrowDownWideNarrow className="inline w-4 h-4 ml-1" /> },
  { value: 'price-desc', label: 'Price (High-Low)', icon: <ArrowUpWideNarrow className="inline w-4 h-4 ml-1" /> },
];

const UserProductList = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('name')));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      setCategories([]);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
      return matchesSearch && matchesCategory;
    });
    switch (sortBy) {
      case 'name-asc':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }
    return filtered;
  }, [products, searchTerm, filterCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Sticky Filter/Search Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <ShoppingBag className="w-8 h-8 text-blue-600" title="Products" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
            <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm font-semibold">{filteredProducts.length} found</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full md:w-auto">
            <div className="relative w-full md:w-64" title="Search products">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              title="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              title="Sort products"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {(searchTerm || filterCategory !== 'all') && (
              <button
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-600 hover:text-white transition-colors"
                onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
                title="Clear filters"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skeletonArray.map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col animate-pulse h-[420px]">
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2" />
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="mt-auto h-8 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="https://undraw.co/api/illustrations/empty_cart" alt="No products" className="mx-auto mb-4 w-40 h-40 object-contain" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Try a different search or category.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-200 flex flex-col h-[420px] border border-gray-100 dark:border-gray-700 group"
                onClick={() => onNavigate('productDetails', { productId: product.id })}
                title={product.name}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') onNavigate('productDetails', { productId: product.id }); }}
              >
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'; }}
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow">${product.price}</span>
                  <span className="absolute top-2 left-2 bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow">
                    {product.shopName ? product.shopName[0] : <Store className="w-5 h-5" />}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="w-4 h-4 text-blue-500" title="Shop" />
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full font-medium line-clamp-1">{product.shopName}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-green-500" title="Category" />
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full font-medium line-clamp-1">{product.categoryName}</span>
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors flex items-center justify-center"
                  title="Add to Cart"
                  onClick={e => {
                    e.stopPropagation();
                    window.alert('Added to cart! (Demo only)');
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProductList; 