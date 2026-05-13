import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

// No request interceptor needed — cookie is sent by browser automatically

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            // Don't redirect if already on auth pages
            const path = window.location.pathname;
            if (!['/login', '/register', '/'].includes(path)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;