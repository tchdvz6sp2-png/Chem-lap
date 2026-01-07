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
      alert('Chyba při ukládání chemikálie');
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
    if (window.confirm('Opravdu chcete smazat tuto chemikálii?')) {
      try {
        await inventoryService.delete(id);
        loadChemicals();
      } catch (error) {
        console.error('Error deleting chemical:', error);
        alert('Chyba při mazání chemikálie');
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
        <h2>Inventář chemikálií</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Přidat chemikálii
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Název</th>
              <th>CAS číslo</th>
              <th>Množství</th>
              <th>Umístění</th>
              <th>Datum expirace</th>
              <th>Stav</th>
              <th>Akce</th>
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
                    <span className="badge badge-warning">Nízké zásoby</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEdit(chemical)}
                  >
                    Upravit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(chemical.id)}>
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {chemicals.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>Nebyly nalezeny žádné chemikálie</p>}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingChemical ? 'Upravit chemikálii' : 'Přidat chemikálii'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Název *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>CAS číslo</label>
                <input type="text" name="cas_number" value={formData.cas_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Množství *</label>
                <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Jednotka *</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Umístění</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Datum expirace</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Minimální zásoba</label>
                <input type="number" step="0.01" name="minimum_stock" value={formData.minimum_stock} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bezpečnostní informace</label>
                <textarea name="safety_info" value={formData.safety_info} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Zrušit
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingChemical ? 'Aktualizovat' : 'Vytvořit'}
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
