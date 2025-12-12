import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('🔐 AuthContext: Iniciando listener de autenticação');

        // Timeout de segurança para evitar loading infinito
        const loadingTimeout = setTimeout(() => {
            console.warn('⚠️ AuthContext: Timeout de 10s atingido, forçando fim do loading');
            setLoading(false);
        }, 10000);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('🔐 AuthContext: Estado de autenticação mudou', user ? `Usuário: ${user.email}` : 'Sem usuário');
            setCurrentUser(user);

            if (user) {
                try {
                    console.log('🔐 AuthContext: Obtendo token do Firebase...');
                    // Obter token para API
                    const userToken = await user.getIdToken();
                    localStorage.setItem('token', userToken);
                    setToken(userToken);
                    console.log('✅ AuthContext: Token obtido e salvo');

                    // Buscar perfil no backend
                    console.log('🔐 AuthContext: Buscando perfil no backend...');
                    const response = await api.get('/users/me');
                    console.log('✅ AuthContext: Perfil carregado:', response.data);

                    setUserProfile(response.data);
                    setIsAdmin(response.data.is_admin === 1 || response.data.is_admin === true);
                    setError(null);

                    console.log('✅ AuthContext: isAdmin =', response.data.is_admin === 1 || response.data.is_admin === true);
                } catch (error) {
                    console.error('❌ AuthContext: Erro ao carregar perfil:', error);
                    console.error('❌ Detalhes:', error.response?.data || error.message);
                    setError('Erro ao carregar perfil do usuário');

                    // Mesmo com erro, permitir continuar (usuário está autenticado no Firebase)
                    setUserProfile(null);
                    try {
                        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'techmixsp@gmail.com').toLowerCase();
                        const email = (user.email || '').toLowerCase();
                        const fallbackAdmin = email === adminEmail;
                        setIsAdmin(fallbackAdmin);
                    } catch {
                        setIsAdmin(false);
                    }
                }
            } else {
                console.log('🔐 AuthContext: Usuário deslogado, limpando dados');
                localStorage.removeItem('token');
                setToken(null);
                setUserProfile(null);
                setIsAdmin(false);
                setError(null);
            }

            clearTimeout(loadingTimeout);
            setLoading(false);
            console.log('✅ AuthContext: Loading finalizado');
        });

        return () => {
            clearTimeout(loadingTimeout);
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser,
        userProfile,
        token,
        isAdmin,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
