import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const doctorAPI = {
  getAll: (search) => api.get('/doctors', { params: { search } }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const scheduleAPI = {
  getAll: (doctorId, date) => api.get('/schedules', { params: { doctorId, date } }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

export const appointmentAPI = {
  book: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  cancel: (id) => api.put(`/appointments/cancel/${id}`),
  complete: (id) => api.put(`/appointments/complete/${id}`),
};

export const queueAPI = {
  getCurrent: (doctorId) => api.get('/queue/current', { params: { doctorId } }),
  getStatus: (appointmentId) => api.get(`/queue/status/${appointmentId}`),
  getByToken: (token) => api.get(`/queue/token/${token}`),
  serveNext: (doctorId) => api.post('/queue/serve-next', null, { params: { doctorId } }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getDailyReport: () => api.get('/reports/daily'),
  getWeeklyReport: () => api.get('/reports/weekly'),
  downloadPdf: () => api.get('/reports/pdf', { responseType: 'blob' }),
  downloadExcel: () => api.get('/reports/excel', { responseType: 'blob' }),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};
