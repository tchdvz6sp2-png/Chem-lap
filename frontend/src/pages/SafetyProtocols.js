import React, { useState, useEffect } from 'react';
import { safetyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import './SafetyProtocols.css';

function SafetyProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    applicable_to: '',
  });

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = async () => {
    try {
      const response = await safetyAPI.getAll();
      setProtocols(response.data.protocols);
    } catch (error) {
      console.error('Error loading safety protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await safetyAPI.create(formData);
      setShowAddForm(false);
      setFormData({ title: '', description: '', category: 'general', applicable_to: '' });
      loadProtocols();
    } catch (error) {
      console.error('Error creating safety protocol:', error);
      alert('Failed to add safety protocol');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this safety protocol?')) {
      try {
        await safetyAPI.delete(id);
        loadProtocols();
      } catch (error) {
        console.error('Error deleting safety protocol:', error);
        alert('Failed to delete safety protocol');
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="main-content">
          <div className="loading">Loading safety protocols...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content">
        <div className="page-header">
          <h1>Safety Protocols</h1>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : '+ Add Protocol'}
            </button>
          )}
        </div>

        {showAddForm && isAdmin && (
          <div className="form-card">
            <h2>Add New Safety Protocol</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="5"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="chemical_specific">Chemical Specific</option>
                    <option value="equipment">Equipment</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Applicable To</label>
                  <input
                    type="text"
                    value={formData.applicable_to}
                    onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
                    placeholder="e.g., Acids, Flammables"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Protocol</button>
            </form>
          </div>
        )}

        <div className="protocols-grid">
          {protocols.length > 0 ? (
            protocols.map((protocol) => (
              <div key={protocol.id} className="protocol-card">
                <div className="protocol-header">
                  <h3>{protocol.title}</h3>
                  <span className={`category-badge category-${protocol.category}`}>
                    {protocol.category?.replace('_', ' ')}
                  </span>
                </div>
                <p className="protocol-description">{protocol.description}</p>
                {protocol.applicable_to && (
                  <p className="protocol-applicable">
                    <strong>Applicable to:</strong> {protocol.applicable_to}
                  </p>
                )}
                {isAdmin && (
                  <div className="protocol-footer">
                    <button
                      className="btn-danger-small"
                      onClick={() => handleDelete(protocol.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="empty-message">No safety protocols available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SafetyProtocols;
