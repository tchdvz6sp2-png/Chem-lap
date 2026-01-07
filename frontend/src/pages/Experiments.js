import React, { useState, useEffect } from 'react';
import { experimentsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import './Experiments.css';

function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    procedure: '',
    status: 'planned',
  });

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const response = await experimentsAPI.getAll();
      setExperiments(response.data.experiments);
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await experimentsAPI.create(formData);
      setShowAddForm(false);
      setFormData({ title: '', description: '', procedure: '', status: 'planned' });
      loadExperiments();
    } catch (error) {
      console.error('Error creating experiment:', error);
      alert('Failed to add experiment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experiment?')) {
      try {
        await experimentsAPI.delete(id);
        loadExperiments();
      } catch (error) {
        console.error('Error deleting experiment:', error);
        alert('Failed to delete experiment');
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="main-content">
          <div className="loading">Loading experiments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content">
        <div className="page-header">
          <h1>Experiment Log</h1>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ New Experiment'}
          </button>
        </div>

        {showAddForm && (
          <div className="form-card">
            <h2>Create New Experiment</h2>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Procedure</label>
                <textarea
                  value={formData.procedure}
                  onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                  rows="5"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Create Experiment</button>
            </form>
          </div>
        )}

        <div className="experiments-grid">
          {experiments.length > 0 ? (
            experiments.map((exp) => (
              <div key={exp.id} className="experiment-card">
                <div className="experiment-header">
                  <h3>{exp.title}</h3>
                  <span className={`status-badge status-${exp.status}`}>
                    {exp.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="experiment-description">{exp.description || 'No description'}</p>
                {exp.procedure && (
                  <div className="experiment-section">
                    <strong>Procedure:</strong>
                    <p>{exp.procedure}</p>
                  </div>
                )}
                {exp.results && (
                  <div className="experiment-section">
                    <strong>Results:</strong>
                    <p>{exp.results}</p>
                  </div>
                )}
                <div className="experiment-footer">
                  <small>Created: {new Date(exp.created_at).toLocaleDateString()}</small>
                  <button
                    className="btn-danger-small"
                    onClick={() => handleDelete(exp.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No experiments logged yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Experiments;
