import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, user needs to login again
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, email, password, role) => api.post('/auth/register', { username, email, password, role }),
  getCurrentUser: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
};

export const chemicalsAPI = {
  getAll: () => api.get('/chemicals'),
  getById: (id) => api.get(`/chemicals/${id}`),
  create: (data) => api.post('/chemicals', data),
  update: (id, data) => api.put(`/chemicals/${id}`, data),
  delete: (id) => api.delete(`/chemicals/${id}`),
  getLowStock: () => api.get('/chemicals/low-stock'),
  getExpiringSoon: () => api.get('/chemicals/expiring-soon'),
};

export const experimentsAPI = {
  getAll: () => api.get('/experiments'),
  getById: (id) => api.get(`/experiments/${id}`),
  getMy: () => api.get('/experiments/my'),
  create: (data) => api.post('/experiments', data),
  update: (id, data) => api.put(`/experiments/${id}`, data),
  delete: (id) => api.delete(`/experiments/${id}`),
};

export const safetyAPI = {
  getAll: () => api.get('/safety-protocols'),
  getById: (id) => api.get(`/safety-protocols/${id}`),
  getByCategory: (category) => api.get(`/safety-protocols/category/${category}`),
  create: (data) => api.post('/safety-protocols', data),
  update: (id, data) => api.put(`/safety-protocols/${id}`, data),
  delete: (id) => api.delete(`/safety-protocols/${id}`),
};

export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getAlerts: () => api.get('/dashboard/alerts'),
};

export default api;
