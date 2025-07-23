import React, { useState, useEffect } from 'react';
import { createShop, updateShop } from '../services/shopService';
import logger from '../utils/logger';
import './ShopForm.css';

const ShopForm = ({ shop = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    floor: '',
    description: '',
    openingHours: '',
    contactPerson: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!shop;

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        owner: shop.owner || '',
        email: shop.email || '',
        phone: shop.phone || '',
        address: shop.address || '',
        category: shop.category || '',
        floor: shop.floor || '',
        description: shop.description || '',
        openingHours: shop.openingHours || '',
        contactPerson: shop.contactPerson || ''
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Shop name is required');
      return false;
    }
    if (!formData.owner.trim()) {
      setError('Owner name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    logger.info(isEditing ? 'Updating shop form submitted' : 'Creating shop form submitted');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateShop(shop.id, formData);
      } else {
        result = await createShop(formData);
      }

      if (result.success) {
        logger.info(isEditing ? 'Shop updated successfully' : 'Shop created successfully');
        onSuccess();
      } else {
        setError(result.error || 'Operation failed');
        logger.error('Shop operation failed:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      logger.error('Unexpected error in shop form:', error);
    }

    setLoading(false);
  };

  return (
    <div className="shop-form-container">
      <div className="shop-form-card">
        <h2>{isEditing ? 'Edit Shop Details' : 'Create New Shop'}</h2>
        
        <form onSubmit={handleSubmit} className="shop-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Shop Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter shop name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="owner">Owner Name *</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Enter owner name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter shop address"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="floor">Floor</label>
              <select
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              >
                <option value="">Select floor</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
                <option value="Second Floor">Second Floor</option>
                <option value="Third Floor">Third Floor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter shop description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="openingHours">Opening Hours</label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 6:00 PM"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person name"
              />
            </div>
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
              {loading ? 'Saving...' : (isEditing ? 'Update Shop' : 'Create Shop')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopForm; 