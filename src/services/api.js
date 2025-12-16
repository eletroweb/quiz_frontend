import axios from 'axios';
import { auth } from '../config/firebase';

const envBase = import.meta.env.VITE_API_URL;
let baseURL;

if (envBase && /^https?:\/\//.test(envBase)) {
    try {
        const cleanUrl = envBase.replace(/["']/g, "").trim();
        const url = new URL(cleanUrl);
        if (!url.pathname.endsWith('/api')) {
            url.pathname = url.pathname.replace(/\/+$/, '') + '/api';
        }
        baseURL = url.toString().replace(/\/+$/, '');
    } catch (e) {
        baseURL = 'https://quiz-backend-6qoh.onrender.com/api';
    }
} else if (typeof window !== 'undefined' && window.location.hostname && (window.location.hostname.includes('quizconcursos.com') || window.location.hostname.includes('eletroweb.github.io'))) {
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
    async (config) => {
        let token = localStorage.getItem('token');

        if (auth.currentUser) {
            try {
                // Força atualização do token se necessário
                token = await auth.currentUser.getIdToken();
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('Erro ao obter token atualizado:', error);
            }
        }

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
