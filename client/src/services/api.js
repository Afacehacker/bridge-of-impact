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

    // 1. If it's a full remote URL (like Unsplash), return as is
    if (path.startsWith('http')) return path;

    // 2. Identify the backend base URL (remove /api suffix)
    const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

    // 3. Handle paths starting with /assets (these are local to frontend)
    if (path.startsWith('/assets')) {
        return path;
    }

    // 4. Handle paths starting with /uploads (these are on our Render server)
    if (path.startsWith('/uploads')) {
        return `${backendUrl}${path}`;
    }

    // 5. If it's just the filename (like the controller saves it), assume it's under /uploads/cases
    return `${backendUrl}/uploads/cases/${path}`;
};

export default API;
