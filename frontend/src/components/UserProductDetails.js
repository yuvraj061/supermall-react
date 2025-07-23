import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ArrowLeft, ShoppingBag, Store, Tag } from 'lucide-react';

const UserProductDetails = ({ onNavigate, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct(null);
      }
    } catch (error) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Product not found</h3>
          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-4"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center space-x-4">
          <button
            onClick={() => onNavigate('products')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-64 h-64 object-cover rounded-lg mb-4 md:mb-0"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'; }}
          />
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">{product.description}</p>
            <div className="flex items-center space-x-3 mb-2">
              <Store className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{product.shopName}</span>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <Tag className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{product.categoryName}</span>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-700 dark:text-blue-300">${product.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductDetails; 