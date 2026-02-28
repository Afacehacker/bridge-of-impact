import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me'),
};

export const cases = {
    getAll: () => API.get('/cases'),
    getOne: (id) => API.get(`/cases/${id}`),
    create: (data) => API.post('/cases', data),
    update: (id, data) => API.put(`/cases/${id}`, data),
    delete: (id) => API.delete(`/cases/${id}`),
};

export const donations = {
    initialize: (data) => API.post('/donations/initialize', data),
    verify: (reference) => API.get(`/donations/verify/${reference}`),
    getStats: () => API.get('/donations/stats'),
    getAll: () => API.get('/donations'),
};

export const getImageUrl = (path) => {
    if (!path) return '';
    // If it's a full URL, return as is
    if (path.startsWith('http')) return path;
    // If it's a local frontend asset (starts with /assets), return as is
    if (path.startsWith('/assets')) return path;
    // If it's a server upload (starts with /uploads), prefix with server URL
    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${serverUrl}${path}`;
};

export default API;
