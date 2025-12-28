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
    const [needsAdminPin, setNeedsAdminPin] = useState(false);

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

                    // Se backend não retornar role/permissions (ex: deploy antigo), buscar fallback /user-roles/me
                    let profile = response.data;
                    if (!profile.role) {
                        try {
                            const rr = await api.get('/user-roles/me');
                            console.log('🔐 AuthContext: Role fallback carregada:', rr.data);
                            profile = { ...profile, role: rr.data.role, permissions: rr.data.permissions };
                        } catch (err) {
                            console.warn('🔐 AuthContext: Não foi possível obter role fallback:', e?.message || e);
                            profile = { ...profile, role: profile.role || 'user', permissions: profile.permissions || {} };
                        }
                    }

                    setUserProfile(profile);
                    setIsAdmin(profile.is_admin === 1 || profile.is_admin === true);
                    setError(null);

                    console.log('✅ AuthContext: isAdmin =', response.data.is_admin === 1 || response.data.is_admin === true);

                    try {
                        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'techmixsp@gmail.com').toLowerCase();
                        const email = (user.email || '').toLowerCase();
                        setNeedsAdminPin(email === adminEmail && !(response.data.is_admin === 1 || response.data.is_admin === true));
                    } catch {
                        setNeedsAdminPin(false);
                    }
                } catch (error) {
                    console.error('❌ AuthContext: Erro ao carregar perfil:', error);
                    console.error('❌ Detalhes:', error.response?.data || error.message);
                    setError('Erro ao carregar perfil do usuário');

                    // Mesmo com erro, permitir continuar (usuário está autenticado no Firebase)
                    setUserProfile(null);
                    setIsAdmin(false);
                }
            } else {
                console.log('🔐 AuthContext: Usuário deslogado, limpando dados');
                localStorage.removeItem('token');
                setToken(null);
                setUserProfile(null);
                setIsAdmin(false);
                setNeedsAdminPin(false);
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

    async function reloadProfile() {
        if (!currentUser) return;
        try {
            const response = await api.get('/users/me');
            setUserProfile(response.data);
            setIsAdmin(response.data.is_admin === 1 || response.data.is_admin === true);
            try {
                const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'techmixsp@gmail.com').toLowerCase();
                const email = (currentUser.email || '').toLowerCase();
                setNeedsAdminPin(email === adminEmail && !(response.data.is_admin === 1 || response.data.is_admin === true));
            } catch {
                setNeedsAdminPin(false);
            }
        } catch (e) {
            console.error('reloadProfile falhou:', e);
        }
    }

    const value = {
        currentUser,
        userProfile,
        token,
        isAdmin,
        loading,
        error,
        needsAdminPin,
        reloadProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
