import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, Typography, TextField,
    Button, Avatar, Paper, Divider, Alert
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function Perfil() {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        display_name: '',
        email: '',
    });
    const [success, setSuccess] = useState(false);
    const [disconnectMsg, setDisconnectMsg] = useState('');

    useEffect(() => {
        if (userProfile) {
            setFormData({
                display_name: userProfile.display_name || '',
                email: currentUser?.email || '',
            });
        }
    }, [userProfile, currentUser]);

    const handleSave = async () => {
        try {
            await api.put('/users/me', {
                display_name: formData.display_name
            });
            setEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Meu Perfil
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Perfil atualizado com sucesso!
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Card de Informações Pessoais */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Informações Pessoais
                                </Typography>
                                {!editing ? (
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => setEditing(true)}
                                    >
                                        Editar
                                    </Button>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            startIcon={<Save />}
                                            variant="contained"
                                            onClick={handleSave}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            }}
                                        >
                                            Salvar
                                        </Button>
                                        <Button
                                            startIcon={<Cancel />}
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nome Completo"
                                        fullWidth
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        disabled={!editing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value={formData.email}
                                        disabled
                                        helperText="O email não pode ser alterado"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Estatísticas */}
                    <Card sx={{ borderRadius: 3, mt: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Minhas Estatísticas
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="h4" fontWeight="bold" color="primary">
                                            {userProfile?.total_answered || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Questões
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="h4" fontWeight="bold" color="success.main">
                                            {userProfile?.accuracy ? Math.round(userProfile.accuracy) : 0}%
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Acertos
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                                            {userProfile?.study_time ? Math.round(userProfile.study_time / 60) : 0}h
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Estudo
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                                            #{userProfile?.rank || '-'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ranking
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Avatar e Plano */}
                    <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto 16px',
                                    fontSize: '3rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {formData.display_name?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {formData.display_name || 'Usuário'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {formData.email}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: userProfile?.plan === 'premium'
                                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                        : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    {userProfile?.plan === 'premium' ? '⭐ Premium' : '🆓 Gratuito'}
                                </Typography>
                                {userProfile?.plan === 'trial' && userProfile?.trial_ends_at && (
                                    <Typography variant="caption">
                                        Trial até {new Date(userProfile.trial_ends_at).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Box>
                            {userProfile?.plan !== 'premium' && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                    onClick={() => navigate('/planos')}
                                >
                                    Fazer Upgrade
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={async () => {
                                    try {
                                        await api.post('/users/me/sessions/kill-others');
                                        setDisconnectMsg('Outros dispositivos foram desconectados.');
                                    } catch {
                                        setDisconnectMsg('Falha ao desconectar outras sessões.');
                                    }
                                }}
                            >
                                Desconectar outros dispositivos
                            </Button>
                            {disconnectMsg && <Alert sx={{ mt: 2 }} severity="info">{disconnectMsg}</Alert>}
                        </CardContent>
                    </Card>

                    {/* Conquistas */}
                    <Card sx={{ borderRadius: 3, mt: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Conquistas
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 2,
                                        bgcolor: '#FFD700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                    }}
                                >
                                    🏆
                                </Box>
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 2,
                                        bgcolor: '#C0C0C0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                    }}
                                >
                                    🎯
                                </Box>
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 2,
                                        bgcolor: '#CD7F32',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                    }}
                                >
                                    ⚡
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
