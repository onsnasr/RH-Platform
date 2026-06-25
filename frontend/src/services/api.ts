import axios from 'axios';

const API_URL = 'http://localhost:5263/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (data: object) =>
    api.post('/auth/register', data),
};

export const employeeService = {
  getAll: () => api.get('/employee'),
  getById: (id: string) => api.get(`/employee/${id}`),
  create: (data: object) => api.post('/employee', data),
  update: (id: string, data: object) => api.put(`/employee/${id}`, data),
  delete: (id: string) => api.delete(`/employee/${id}`),
};

export const departmentService = {
  getAll: () => api.get('/department'),
  create: (data: object) => api.post('/department', data),
  update: (id: string, data: object) => api.put(`/department/${id}`, data),
  delete: (id: string) => api.delete(`/department/${id}`),
};

export const leaveService = {
  getAll: () => api.get('/leaverequest'),
  getByEmployee: (id: string) => api.get(`/leaverequest/employee/${id}`),
  submit: (data: object) => api.post('/leaverequest', data),
  approve: (id: string) => api.put(`/leaverequest/${id}/approve`, {}),
  reject: (id: string) => api.put(`/leaverequest/${id}/reject`, {}),
};

export const payrollService = {
  getAll: () => api.get('/payroll'),
  getByEmployee: (id: string) => api.get(`/payroll/employee/${id}`),
  generate: (data: object) => api.post('/payroll', data),
};

export default api;