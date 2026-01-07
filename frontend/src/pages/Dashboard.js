import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [metricsData, alertsData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getAlerts(),
      ]);
      setMetrics(metricsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3>Total Chemicals</h3>
          <div className="value">{metrics?.total_chemicals || 0}</div>
        </div>
        <div className="metric-card">
          <h3>Low Stock Items</h3>
          <div className="value" style={{ color: '#ffc107' }}>
            {metrics?.low_stock_chemicals || 0}
          </div>
        </div>
        <div className="metric-card">
          <h3>Expiring Soon</h3>
          <div className="value" style={{ color: '#dc3545' }}>
            {metrics?.expiring_chemicals || 0}
          </div>
        </div>
        <div className="metric-card">
          <h3>Active Experiments</h3>
          <div className="value" style={{ color: '#28a745' }}>
            {metrics?.active_experiments || 0}
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="card">
          <h3>Alerts</h3>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert alert-${alert.severity === 'error' ? 'danger' : 'warning'}`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Recent Activity</h3>
        <p>Total Experiments: {metrics?.total_experiments || 0}</p>
        <p>Total Users: {metrics?.total_users || 0}</p>
      </div>
    </div>
  );
}

export default Dashboard;
