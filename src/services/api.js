import axios from 'axios';

const envBase = import.meta.env.VITE_API_URL;
let baseURL;

if (envBase && /^https?:\/\//.test(envBase)) {
  const cleaned = envBase.replace(/\/+$/, '');
  baseURL = cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
} else if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname.includes('quizconcursos.com')) {
  baseURL = 'https://quiz-backend-6qoh.onrender.com/api';
} else {
  baseURL = 'http://localhost:3001/api';
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status === 403 && error.response?.data?.code === 'TRIAL_EXPIRED') {
            // Trial expirado - dispara evento para abrir dialog
            window.dispatchEvent(new CustomEvent('trial_expired', {
                detail: error.response.data
            }));
        }
        return Promise.reject(error);
    }
);

export default api;
