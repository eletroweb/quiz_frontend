import React, { useState } from 'react';
import {
    Box, Container, TextField, Button, Typography, Paper,
    Alert, InputAdornment, IconButton, Tabs, Tab, Divider, Link
} from '@mui/material';
import {
    Visibility, VisibilityOff, Email, Lock, Person, AdminPanelSettings
} from '@mui/icons-material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [tab, setTab] = useState(0); // 0 = Login, 1 = Cadastro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [adminPin, setAdminPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { reloadProfile } = useAuth();

    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'techmixsp@gmail.com').toLowerCase();
    const isAdminEmailEntered = (email || '').toLowerCase() === adminEmail;

    async function handleLogin(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            const token = await auth.currentUser.getIdToken();
            localStorage.setItem('token', token);
            await reloadProfile();
            const me = await api.get('/users/me');
            const alreadyAdmin = Boolean(me.data?.is_admin === true || me.data?.is_admin === 1);
            if (alreadyAdmin) {
                navigate('/admin');
                return;
            }
            if (isAdminEmailEntered && adminPin) {
                try {
                    await api.post('/users/me/verify-admin-pin', { pin: adminPin });
                    await reloadProfile();
                    navigate('/admin');
                    return;
                } catch (e) {
                    const code = e?.response?.data?.code;
                    if (code === 'ADMIN_PIN_MISSING') {
                        try {
                            await api.post('/users/me/admin-pin', { pin: adminPin });
                            await api.post('/users/me/verify-admin-pin', { pin: adminPin });
                            await reloadProfile();
                            navigate('/admin');
                            return;
                        } catch {
                            setError('PIN não configurado no servidor. Tente novamente.');
                        }
                    } else {
                        setError('PIN de administrador inválido ou usuário não autorizado');
                    }
                }
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('Usuário não encontrado');
            } else if (err.code === 'auth/wrong-password') {
                setError('Senha incorreta');
            } else {
                setError('Erro ao fazer login: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este email já está em uso');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres');
            } else {
                setError('Erro ao criar conta: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Logo e Título */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                            }}
                        >
                            <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Quiz Concursos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sua plataforma de estudos para concursos públicos
                        </Typography>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Entrar" />
                        <Tab label="Criar Conta" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Formulário de Login */}
                    {tab === 0 && (
                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {isAdminEmailEntered && (
                                <>
                                    <Divider sx={{ my: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Administrador? Digite o PIN
                                        </Typography>
                                    </Divider>
                                    <TextField
                                        fullWidth
                                        label="PIN Admin (opcional)"
                                        type="password"
                                        value={adminPin}
                                        onChange={(e) => setAdminPin(e.target.value)}
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AdminPanelSettings color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </>
                            )}
                            

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    },
                                }}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Button>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Link href="#" variant="body2" underline="hover">
                                    Esqueceu a senha?
                                </Link>
                            </Box>
                        </Box>
                    )}

                    {/* Formulário de Cadastro */}
                    {tab === 1 && (
                        <Box component="form" onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                label="Nome Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                helperText="Mínimo de 6 caracteres"
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    },
                                }}
                            >
                                {loading ? 'Criando conta...' : 'Criar Conta'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
