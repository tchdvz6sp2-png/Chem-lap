import React, { useState, useEffect } from 'react';
import { chemicalsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import './Inventory.css';

function Inventory() {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    formula: '',
    quantity: '',
    unit: 'g',
    location: '',
    minimum_stock: '0',
  });

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      const response = await chemicalsAPI.getAll();
      setChemicals(response.data.chemicals);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await chemicalsAPI.create({
        ...formData,
        quantity: parseFloat(formData.quantity),
        minimum_stock: parseFloat(formData.minimum_stock),
      });
      setShowAddForm(false);
      setFormData({ name: '', formula: '', quantity: '', unit: 'g', location: '', minimum_stock: '0' });
      loadChemicals();
    } catch (error) {
      console.error('Error creating chemical:', error);
      alert('Failed to add chemical');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chemical?')) {
      try {
        await chemicalsAPI.delete(id);
        loadChemicals();
      } catch (error) {
        console.error('Error deleting chemical:', error);
        alert('Failed to delete chemical');
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="main-content">
          <div className="loading">Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content">
        <div className="page-header">
          <h1>Chemical Inventory</h1>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Chemical'}
          </button>
        </div>

        {showAddForm && (
          <div className="form-card">
            <h2>Add New Chemical</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Formula</label>
                  <input
                    type="text"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Stock</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_stock}
                    onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Chemical</button>
            </form>
          </div>
        )}

        <div className="table-container">
          {chemicals.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Formula</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Min Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chemicals.map((chemical) => (
                  <tr key={chemical.id}>
                    <td>{chemical.name}</td>
                    <td>{chemical.formula || '-'}</td>
                    <td>{chemical.quantity} {chemical.unit}</td>
                    <td>{chemical.location || '-'}</td>
                    <td>{chemical.minimum_stock} {chemical.unit}</td>
                    <td>
                      <button
                        className="btn-danger-small"
                        onClick={() => handleDelete(chemical.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">No chemicals in inventory</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
