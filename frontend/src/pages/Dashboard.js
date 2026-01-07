import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import './Dashboard.css';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recentExperiments, setRecentExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, alertsRes] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getAlerts(),
      ]);

      setMetrics(metricsRes.data.metrics);
      setRecentExperiments(metricsRes.data.recent_experiments);
      setAlerts(alertsRes.data.alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navigation />
        <div className="main-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>

        {/* Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Chemicals</h3>
            <p className="metric-value">{metrics?.total_chemicals || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Active Experiments</h3>
            <p className="metric-value">{metrics?.active_experiments || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Low Stock Alerts</h3>
            <p className="metric-value warning">{metrics?.low_stock_count || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Expiring Soon</h3>
            <p className="metric-value warning">{metrics?.expiring_count || 0}</p>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="alerts-section">
            <h2>Alerts</h2>
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.severity}`}>
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-message">{alert.message}</span>
                  <button
                    className="btn-link"
                    onClick={() => navigate('/inventory')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Experiments */}
        <div className="recent-section">
          <h2>Recent Experiments</h2>
          {recentExperiments.length > 0 ? (
            <div className="experiments-list">
              {recentExperiments.map((exp) => (
                <div key={exp.id} className="experiment-item">
                  <div className="experiment-info">
                    <h3>{exp.title}</h3>
                    <p>{exp.description}</p>
                    <span className={`status-badge status-${exp.status}`}>
                      {exp.status.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('/experiments')}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No recent experiments</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
