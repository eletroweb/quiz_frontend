import axios from 'axios';
import { auth } from '../config/firebase';

const envBase = import.meta.env.VITE_API_URL;
let baseURL;

// Lógica de seleção da API:
// 1. Se estiver rodando no navegador em localhost, DEVE usar o backend local (evita conflito de dados)
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    baseURL = 'http://localhost:3001/api';
}
// 2. Se tiver variável de ambiente definida e não for localhost (ex: build de prod)
else if (envBase && /^https?:\/\//.test(envBase)) {
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
}
// 3. Fallback para produção
else {
    baseURL = 'https://quiz-backend-6qoh.onrender.com/api';
}

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});

console.log('🔌 API Base URL:', baseURL);

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
            localStorage.removeItem('token');
            // Redireciona respeitando o base path (ex: /quiz_frontend/login)
            const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');
            window.location.href = `${basePath}/login`;
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
