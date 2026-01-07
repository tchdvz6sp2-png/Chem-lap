import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services';

function Inventory() {
  const [chemicals, setChemicals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingChemical, setEditingChemical] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cas_number: '',
    quantity: '',
    unit: '',
    location: '',
    expiry_date: '',
    minimum_stock: '',
    safety_info: '',
  });

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      const data = await inventoryService.getAll();
      setChemicals(data);
    } catch (error) {
      console.error('Error loading chemicals:', error);
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
    try {
      if (editingChemical) {
        await inventoryService.update(editingChemical.id, formData);
      } else {
        await inventoryService.create(formData);
      }
      setShowModal(false);
      setEditingChemical(null);
      setFormData({
        name: '',
        cas_number: '',
        quantity: '',
        unit: '',
        location: '',
        expiry_date: '',
        minimum_stock: '',
        safety_info: '',
      });
      loadChemicals();
    } catch (error) {
      console.error('Error saving chemical:', error);
      alert('Error saving chemical');
    }
  };

  const handleEdit = (chemical) => {
    setEditingChemical(chemical);
    setFormData({
      name: chemical.name,
      cas_number: chemical.cas_number || '',
      quantity: chemical.quantity,
      unit: chemical.unit,
      location: chemical.location || '',
      expiry_date: chemical.expiry_date || '',
      minimum_stock: chemical.minimum_stock,
      safety_info: chemical.safety_info || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chemical?')) {
      try {
        await inventoryService.delete(id);
        loadChemicals();
      } catch (error) {
        console.error('Error deleting chemical:', error);
        alert('Error deleting chemical');
      }
    }
  };

  const openAddModal = () => {
    setEditingChemical(null);
    setFormData({
      name: '',
      cas_number: '',
      quantity: '',
      unit: '',
      location: '',
      expiry_date: '',
      minimum_stock: '',
      safety_info: '',
    });
    setShowModal(true);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Chemical Inventory</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add Chemical
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>CAS Number</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chemicals.map((chemical) => (
              <tr key={chemical.id}>
                <td>{chemical.name}</td>
                <td>{chemical.cas_number || 'N/A'}</td>
                <td>
                  {chemical.quantity} {chemical.unit}
                </td>
                <td>{chemical.location || 'N/A'}</td>
                <td>{chemical.expiry_date || 'N/A'}</td>
                <td>
                  {chemical.quantity <= chemical.minimum_stock && (
                    <span className="badge badge-warning">Low Stock</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEdit(chemical)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(chemical.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {chemicals.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No chemicals found</p>}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingChemical ? 'Edit Chemical' : 'Add Chemical'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>CAS Number</label>
                <input type="text" name="cas_number" value={formData.cas_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Unit *</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Minimum Stock</label>
                <input type="number" step="0.01" name="minimum_stock" value={formData.minimum_stock} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Safety Information</label>
                <textarea name="safety_info" value={formData.safety_info} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingChemical ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
