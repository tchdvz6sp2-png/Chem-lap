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
      setError('Pole Související chemikálie obsahuje neplatný formát JSON');
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
    if (window.confirm('Opravdu chcete smazat tento bezpečnostní protokol?')) {
      try {
        await safetyService.delete(id);
        loadProtocols();
      } catch (error) {
        console.error('Error deleting safety protocol:', error);
        alert('Chyba při mazání bezpečnostního protokolu');
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

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'OBECNÉ',
      chemical_specific: 'SPECIFICKÉ PRO CHEMIKÁLII',
      emergency: 'NOUZOVÉ',
      ppe: 'OOP',
    };
    return labels[category] || category.toUpperCase();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Bezpečnostní protokoly</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          Přidat protokol
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {protocols.map((protocol) => (
          <div key={protocol.id} className="card">
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{protocol.title}</h3>
              <span className={getCategoryBadge(protocol.category)}>
                {getCategoryLabel(protocol.category)}
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '15px', minHeight: '60px' }}>
              {protocol.description}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => handleEdit(protocol)} style={{ flex: 1 }}>
                Upravit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(protocol.id)} style={{ flex: 1 }}>
                Smazat
              </button>
            </div>
          </div>
        ))}
      </div>
      {protocols.length === 0 && (
        <div className="card">
          <p style={{ textAlign: 'center', padding: '20px' }}>Nebyly nalezeny žádné bezpečnostní protokoly</p>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProtocol ? 'Upravit bezpečnostní protokol' : 'Přidat bezpečnostní protokol'}</h2>
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
                <label>Název *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Popis *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Kategorie</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="general">Obecné</option>
                  <option value="chemical_specific">Specifické pro chemikálii</option>
                  <option value="emergency">Nouzové</option>
                  <option value="ppe">OOP (Osobní ochranné prostředky)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Související chemikálie (formát JSON)</label>
                <textarea
                  name="related_chemicals"
                  value={formData.related_chemicals}
                  onChange={handleChange}
                  placeholder='např. ["HCl", "H2SO4"]'
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Zrušit
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProtocol ? 'Aktualizovat' : 'Vytvořit'}
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
