import React, { useState, useEffect } from 'react';
import { experimentService } from '../services';
import { isValidJSON, formatErrorMessage } from '../utils/helpers';

function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    procedure: '',
    results: '',
    chemicals_used: '',
    status: 'in_progress',
  });

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const data = await experimentService.getAll();
      setExperiments(data);
    } catch (error) {
      console.error('Error loading experiments:', error);
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
    if (formData.chemicals_used && !isValidJSON(formData.chemicals_used)) {
      setError('Chemicals Used field contains invalid JSON format');
      return;
    }
    
    try {
      if (editingExperiment) {
        await experimentService.update(editingExperiment.id, formData);
      } else {
        await experimentService.create(formData);
      }
      setShowModal(false);
      setEditingExperiment(null);
      setFormData({
        title: '',
        description: '',
        procedure: '',
        results: '',
        chemicals_used: '',
        status: 'in_progress',
      });
      loadExperiments();
    } catch (error) {
      console.error('Error saving experiment:', error);
      setError(formatErrorMessage(error));
    }
  };

  const handleEdit = (experiment) => {
    setEditingExperiment(experiment);
    setFormData({
      title: experiment.title,
      description: experiment.description || '',
      procedure: experiment.procedure || '',
      results: experiment.results || '',
      chemicals_used: experiment.chemicals_used || '',
      status: experiment.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experiment?')) {
      try {
        await experimentService.delete(id);
        loadExperiments();
      } catch (error) {
        console.error('Error deleting experiment:', error);
        alert('Error deleting experiment');
      }
    }
  };

  const openAddModal = () => {
    setEditingExperiment(null);
    setFormData({
      title: '',
      description: '',
      procedure: '',
      results: '',
      chemicals_used: '',
      status: 'in_progress',
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Experiments</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          New Experiment
        </button>
      </div>

      <div className="card">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="card" style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{experiment.title}</h3>
                <p style={{ color: '#666', marginBottom: '10px' }}>{experiment.description}</p>
                <div style={{ marginBottom: '10px' }}>
                  <span className={getStatusBadge(experiment.status)}>
                    {experiment.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                    By: {experiment.username} | Created: {new Date(experiment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={() => handleEdit(experiment)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(experiment.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {experiments.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No experiments found</p>}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingExperiment ? 'Edit Experiment' : 'New Experiment'}</h2>
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
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Procedure</label>
                <textarea name="procedure" value={formData.procedure} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Results</label>
                <textarea name="results" value={formData.results} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Chemicals Used (JSON format)</label>
                <textarea name="chemicals_used" value={formData.chemicals_used} onChange={handleChange} placeholder='e.g., [{"name": "HCl", "amount": "10ml"}]' />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExperiment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Experiments;
