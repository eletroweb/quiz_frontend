import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    Paper, Avatar, Chip
} from '@mui/material';
import {
    TrendingUp, CheckCircle, Timer, EmojiEvents
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function UserDashboard() {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get('/stats/me');
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            // Se der erro, usar dados vazios
            setStats({});
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Questões Respondidas',
            value: stats?.total_answered || 0,
            icon: <CheckCircle sx={{ fontSize: 40 }} />,
            color: '#10b981',
            bgColor: '#d1fae5',
        },
        {
            title: 'Taxa de Acerto',
            value: stats?.accuracy ? `${Math.round(stats.accuracy)}%` : '0%',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: '#6366f1',
            bgColor: '#e0e7ff',
        },
        {
            title: 'Tempo de Estudo',
            value: stats?.study_time ? `${Math.round(stats.study_time / 60)}h` : '0h',
            icon: <Timer sx={{ fontSize: 40 }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            title: 'Ranking',
            value: `#${stats?.rank || '-'}`,
            icon: <EmojiEvents sx={{ fontSize: 40 }} />,
            color: '#ec4899',
            bgColor: '#fce7f3',
        },
    ];

    return (
        <Box>
            {/* Cabeçalho de Boas-vindas */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontSize: '1.5rem',
                        }}
                    >
                        {userProfile?.display_name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Olá, {userProfile?.display_name || 'Estudante'}!
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Continue seus estudos e alcance seus objetivos
                        </Typography>
                        <Chip
                            label={userProfile?.plan === 'premium' ? 'Plano Premium' : 'Plano Gratuito'}
                            sx={{
                                mt: 1,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Cards de Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                },
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            bgcolor: card.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: card.color,
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {card.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Progresso Semanal */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Progresso desta Semana
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Meta: 50 questões
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {stats?.weekly_answered || 0} / 50
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(((stats?.weekly_answered || 0) / 50) * 100, 100)}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Ações Rápidas */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => navigate('/quiz')}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🎯 Fazer Quiz
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Responda questões e teste seus conhecimentos
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => navigate('/estudar')}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📚 Estudar
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Acesse vídeos, PDFs e conteúdos de estudo
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
