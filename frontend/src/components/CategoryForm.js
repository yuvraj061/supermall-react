import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../services/categoryService';
import logger from '../utils/logger';
import './CategoryForm.css';

const CategoryForm = ({ category = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#667eea',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#667eea',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Category name must be at least 2 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    logger.info(isEditing ? 'Updating category form submitted' : 'Creating category form submitted');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success) {
        logger.info(isEditing ? 'Category updated successfully' : 'Category created successfully');
        onSuccess();
      } else {
        setError(result.error || 'Operation failed');
        logger.error('Category operation failed:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      logger.error('Unexpected error in category form:', error);
    }

    setLoading(false);
  };

  return (
    <div className="category-form-container">
      <div className="category-form-card">
        <h2>{isEditing ? 'Edit Category' : 'Create New Category'}</h2>
        
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="icon">Icon (Emoji)</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., 📱, 👕, 🍎"
                maxLength="2"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="checkbox-label">
                Active Category
              </label>
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
              {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 