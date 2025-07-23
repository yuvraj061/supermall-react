import React, { useState, useEffect } from 'react';
import { createOffer, updateOffer } from '../services/offerService';
import { getAllShops } from '../services/shopService';
import logger from '../utils/logger';
import './OfferForm.css';

const OfferForm = ({ offer = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shopId: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    terms: '',
    isActive: true
  });
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!offer;

  useEffect(() => {
    loadShops();
    if (offer) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        shopId: offer.shopId || '',
        originalPrice: offer.originalPrice || '',
        discountedPrice: offer.discountedPrice || '',
        discountPercentage: offer.discountPercentage || '',
        startDate: offer.startDate || '',
        endDate: offer.endDate || '',
        terms: offer.terms || '',
        isActive: offer.isActive !== undefined ? offer.isActive : true
      });
    }
  }, [offer]);

  const loadShops = async () => {
    try {
      const result = await getAllShops();
      if (result.success) {
        setShops(result.shops);
        logger.info('Shops loaded for offer form, count:', result.shops.length);
      }
    } catch (error) {
      logger.error('Error loading shops for offer form:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateDiscountPercentage = () => {
    const original = parseFloat(formData.originalPrice);
    const discounted = parseFloat(formData.discountedPrice);
    if (original && discounted && original > discounted) {
      const percentage = ((original - discounted) / original * 100).toFixed(2);
      setFormData(prev => ({ ...prev, discountPercentage: percentage }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Offer title is required');
      return false;
    }
    if (!formData.shopId) {
      setError('Please select a shop');
      return false;
    }
    if (!formData.originalPrice || !formData.discountedPrice) {
      setError('Both original and discounted prices are required');
      return false;
    }
    if (parseFloat(formData.originalPrice) <= parseFloat(formData.discountedPrice)) {
      setError('Discounted price must be less than original price');
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setError('Start and end dates are required');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    logger.info(isEditing ? 'Updating offer form submitted' : 'Creating offer form submitted');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateOffer(offer.id, formData);
      } else {
        result = await createOffer(formData);
      }

      if (result.success) {
        logger.info(isEditing ? 'Offer updated successfully' : 'Offer created successfully');
        onSuccess();
      } else {
        setError(result.error || 'Operation failed');
        logger.error('Offer operation failed:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      logger.error('Unexpected error in offer form:', error);
    }

    setLoading(false);
  };

  return (
    <div className="offer-form-container">
      <div className="offer-form-card">
        <h2>{isEditing ? 'Edit Offer Details' : 'Create New Offer'}</h2>
        
        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Offer Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter offer title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shopId">Select Shop *</label>
              <select
                id="shopId"
                name="shopId"
                value={formData.shopId}
                onChange={handleChange}
                required
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Offer Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the offer details"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originalPrice">Original Price (₹) *</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Enter original price"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="discountedPrice">Discounted Price (₹) *</label>
              <input
                type="number"
                id="discountedPrice"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                onBlur={calculateDiscountPercentage}
                placeholder="Enter discounted price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="discountPercentage">Discount Percentage (%)</label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                placeholder="Auto-calculated"
                min="0"
                max="100"
                step="0.01"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="isActive">Offer Status</label>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive" className="checkbox-label">
                  Active Offer
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="terms">Terms & Conditions</label>
            <textarea
              id="terms"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              placeholder="Enter terms and conditions"
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Offer' : 'Create Offer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm; 