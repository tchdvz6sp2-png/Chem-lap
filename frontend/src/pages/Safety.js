import React, { useState, useEffect } from 'react';
import { safetyService } from '../services';
import { isValidJSON, formatErrorMessage } from '../utils/helpers';

function Safety() {
  const [protocols, setProtocols] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    related_chemicals: '',
  });

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = async () => {
    try {
      const data = await safetyService.getAll();
      setProtocols(data);
    } catch (error) {
      console.error('Error loading safety protocols:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate JSON fields
    if (formData.related_chemicals && !isValidJSON(formData.related_chemicals)) {
      setError('Related Chemicals field contains invalid JSON format');
      return;
    }
    
    try {
      if (editingProtocol) {
        await safetyService.update(editingProtocol.id, formData);
      } else {
        await safetyService.create(formData);
      }
      setShowModal(false);
      setEditingProtocol(null);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        related_chemicals: '',
      });
      loadProtocols();
    } catch (error) {
      console.error('Error saving safety protocol:', error);
      setError(formatErrorMessage(error));
    }
  };

  const handleEdit = (protocol) => {
    setEditingProtocol(protocol);
    setFormData({
      title: protocol.title,
      description: protocol.description,
      category: protocol.category || 'general',
      related_chemicals: protocol.related_chemicals || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this safety protocol?')) {
      try {
        await safetyService.delete(id);
        loadProtocols();
      } catch (error) {
        console.error('Error deleting safety protocol:', error);
        alert('Error deleting safety protocol');
      }
    }
  };

  const openAddModal = () => {
    setEditingProtocol(null);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      related_chemicals: '',
    });
    setShowModal(true);
  };

  const getCategoryBadge = (category) => {
    const badges = {
      general: 'badge-info',
      chemical_specific: 'badge-warning',
      emergency: 'badge-danger',
      ppe: 'badge-success',
    };
    return `badge ${badges[category] || 'badge-info'}`;
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Safety Protocols</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Protocol
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {protocols.map((protocol) => (
          <div key={protocol.id} className="card">
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{protocol.title}</h3>
              <span className={getCategoryBadge(protocol.category)}>
                {protocol.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '15px', minHeight: '60px' }}>
              {protocol.description}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => handleEdit(protocol)} style={{ flex: 1 }}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(protocol.id)} style={{ flex: 1 }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {protocols.length === 0 && (
        <div className="card">
          <p style={{ textAlign: 'center', padding: '20px' }}>No safety protocols found</p>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProtocol ? 'Edit Safety Protocol' : 'Add Safety Protocol'}</h2>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setError('');
              }}>
                ×
              </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="chemical_specific">Chemical Specific</option>
                  <option value="emergency">Emergency</option>
                  <option value="ppe">PPE (Personal Protective Equipment)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Related Chemicals (JSON format)</label>
                <textarea
                  name="related_chemicals"
                  value={formData.related_chemicals}
                  onChange={handleChange}
                  placeholder='e.g., ["HCl", "H2SO4"]'
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProtocol ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Safety;
