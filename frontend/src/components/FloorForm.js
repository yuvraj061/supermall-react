import React, { useState, useEffect } from 'react';
import { createFloor, updateFloor } from '../services/floorService';
import logger from '../utils/logger';
import './FloorForm.css';

const FloorForm = ({ floor = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!floor;

  useEffect(() => {
    if (floor) {
      setFormData({
        name: floor.name || '',
        description: floor.description || '',
        level: floor.level || '',
        isActive: floor.isActive !== undefined ? floor.isActive : true
      });
    }
  }, [floor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Floor name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Floor name must be at least 2 characters long');
      return false;
    }
    if (!formData.level.trim()) {
      setError('Floor level is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    logger.info(isEditing ? 'Updating floor form submitted' : 'Creating floor form submitted');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateFloor(floor.id, formData);
      } else {
        result = await createFloor(formData);
      }

      if (result.success) {
        logger.info(isEditing ? 'Floor updated successfully' : 'Floor created successfully');
        onSuccess();
      } else {
        setError(result.error || 'Operation failed');
        logger.error('Floor operation failed:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      logger.error('Unexpected error in floor form:', error);
    }

    setLoading(false);
  };

  return (
    <div className="floor-form-container">
      <div className="floor-form-card">
        <h2>{isEditing ? 'Edit Floor' : 'Create New Floor'}</h2>
        
        <form onSubmit={handleSubmit} className="floor-form">
          <div className="form-group">
            <label htmlFor="name">Floor Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Ground Floor, First Floor"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Floor Level *</label>
            <input
              type="number"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="e.g., 0, 1, 2"
              min="-5"
              max="50"
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
              placeholder="Enter floor description"
              rows="3"
            />
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
                Active Floor
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
              {loading ? 'Saving...' : (isEditing ? 'Update Floor' : 'Create Floor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FloorForm; 