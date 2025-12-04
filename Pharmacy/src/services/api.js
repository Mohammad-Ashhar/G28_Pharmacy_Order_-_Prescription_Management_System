import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Medicine APIs
export const medicineAPI = {
  getAll: (params) => api.get('/medicines', { params }),
  getOne: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`)
};

// Prescription APIs
export const prescriptionAPI = {
  upload: (formData) => api.post('/prescriptions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyPrescriptions: () => api.get('/prescriptions/my-prescriptions'),
  getAll: (params) => api.get('/prescriptions', { params }),
  getOne: (id) => api.get(`/prescriptions/${id}`),
  verify: (id, data) => api.put(`/prescriptions/${id}/verify`, data)
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAll: (params) => api.get('/orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  assign: (id, data) => api.put(`/orders/${id}/assign`, data)
};

// Inventory APIs
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  getLowStock: () => api.get('/inventory/low-stock')
};

// Delivery APIs
export const deliveryAPI = {
  getMyDeliveries: () => api.get('/delivery/my-deliveries'),
  updateStatus: (id, data) => api.put(`/delivery/${id}/status`, data),
  verifyOTP: (id, data) => api.post(`/delivery/${id}/verify-otp`, data)
};

// Notification APIs
export const notificationAPI = {
  sendTest: (data) => api.post('/notifications/test', data),
  sendRefillReminder: (data) => api.post('/notifications/refill-reminder', data)
};

export default api;
