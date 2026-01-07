import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (username, email, password, role = 'technician') => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const inventoryService = {
  getAll: async () => {
    const response = await api.get('/inventory/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/inventory/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

export const experimentService = {
  getAll: async () => {
    const response = await api.get('/experiments/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/experiments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/experiments/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/experiments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/experiments/${id}`);
    return response.data;
  },
};

export const safetyService = {
  getAll: async () => {
    const response = await api.get('/safety/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/safety/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/safety/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/safety/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/safety/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },
};
