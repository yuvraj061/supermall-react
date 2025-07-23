import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Edit3, 
  Save, 
  Camera, 
  Upload, 
  Star, 
  MessageCircle, 
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from '../utils/logger';

const ProductInfoUpdater = ({ onNavigate, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states for product information updates
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    specifications: '',
    features: '',
    images: [],
    reviews: '',
    availability: 'in-stock',
    condition: 'new'
  });

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      // Fetch product details from offers collection
      const offersRef = collection(db, 'offers');
      const q = query(offersRef, where('__name__', '==', productId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const productData = querySnapshot.docs[0].data();
        setProduct(productData);
        setFormData({
          title: productData.title || '',
          description: productData.description || '',
          price: productData.discountedPrice?.toString() || '',
          specifications: productData.productInfo?.specifications || '',
          features: productData.features?.join(', ') || '',
          images: [],
          reviews: '',
          availability: 'in-stock',
          condition: 'new'
        });
      }
    } catch (error) {
      logger.error('Error fetching product details:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      // Create product update record
      const updateData = {
        productId: productId,
        originalProduct: product,
        updatedInfo: formData,
        updatedBy: 'consumer', // This would be the actual user ID in production
        updateType: 'product_information',
        status: 'pending_review',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'product_updates'), updateData);
      
      setSuccess(true);
      logger.info('Product information update submitted successfully');
      
      // Reset form after successful submission
      setTimeout(() => {
        setSuccess(false);
        onNavigate('offers');
      }, 2000);

    } catch (error) {
      logger.error('Error updating product information:', error);
      setError('Failed to submit product update. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate('offers')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Update Product Info</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800">Product information updated successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Product Info Card */}
        {product && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Product</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Title:</span> {product.title}</p>
              <p><span className="font-medium">Price:</span> ${product.discountedPrice}</p>
              <p><span className="font-medium">Shop:</span> {product.shopName || 'Unknown'}</p>
            </div>
          </div>
        )}

        {/* Update Form */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <Smartphone className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Update Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the product..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Product specifications..."
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (comma separated)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="in-stock">In Stock</option>
                <option value="limited">Limited Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="pre-order">Pre-order</option>
              </select>
            </div>

            {/* Review/Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review/Comment
              </label>
              <textarea
                name="reviews"
                value={formData.reviews}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience or suggestions..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Choose files
                </label>
                <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {formData.images.length} image(s) selected
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updating}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Submit Update
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">How it works</h3>
              <p className="text-sm text-blue-700">
                Your product information updates will be reviewed by the merchant. 
                Once approved, the changes will be reflected on the product listing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoUpdater; 