import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    Paper, Avatar, Chip, Button, Stack
} from '@mui/material';
import {
    TrendingUp, CheckCircle, Timer, EmojiEvents
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function UserDashboard() {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myCourses, setMyCourses] = useState([]);
    const [courseStats, setCourseStats] = useState({});

    useEffect(() => {
        loadStats();
        loadMyCourses();
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
    
    const loadMyCourses = async () => {
        try {
            const response = await api.get('/cursos');
            const list = Array.isArray(response.data) ? response.data : [];
            const owned = list.filter(c => !!c.owned);
            setMyCourses(owned);
            const statsMap = {};
            await Promise.all(owned.map(async (c) => {
                try {
                    const s = await api.get(`/curso-progress/${c.id}/stats`);
                    statsMap[c.id] = s.data;
                } catch {
                    statsMap[c.id] = null;
                }
            }));
            setCourseStats(statsMap);
        } catch (error) {
            console.error('Erro ao carregar meus cursos:', error);
            setMyCourses([]);
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

    if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <LinearProgress sx={{ width: '100%' }} />
        </Box>
    );
  }

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

            {/* Meus Cursos */}
            <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Seus Cursos</Typography>
                    <Button variant="text" onClick={() => navigate('/estudar')}>Ver todos</Button>
                </Box>
                {myCourses.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Nenhum curso adquirido ainda.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {myCourses.map((c) => {
                            const s = courseStats[c.id];
                            const overallPercent = s
                                ? (() => {
                                    const totals = (s.progresso_por_modulo || []).reduce((acc, m) => {
                                        acc.total += Number(m.total_conteudos || 0);
                                        acc.done += Number(m.conteudos_concluidos || 0);
                                        return acc;
                                    }, { total: 0, done: 0 });
                                    return totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;
                                })()
                                : 0;
                            return (
                                <Grid item xs={12} md={6} key={c.id}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="h6" fontWeight="bold">{c.nome}</Typography>
                                                <Button variant="contained" onClick={() => navigate(`/curso/${c.id}`)}>Continuar</Button>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Progresso geral: {overallPercent}%
                                            </Typography>
                                            <LinearProgress value={overallPercent} variant="determinate" sx={{ my: 1 }} />
                                            {s?.proximo_conteudo && (
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2">Próximo conteúdo:</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip label={s.proximo_conteudo.modulo_nome} size="small" />
                                                        <Typography variant="body2" fontWeight="500">{s.proximo_conteudo.titulo}</Typography>
                                                    </Stack>
                                                </Box>
                                            )}
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                {(s?.progresso_por_modulo || []).map((m) => (
                                                    <Chip
                                                        key={m.modulo_id}
                                                        label={`${m.modulo_nome}: ${Math.round(Number(m.percentual || 0))}%`}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Paper>

            {/* Ações Rápidas */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Curator Panel */}
                {userProfile?.role === 'curator' && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Área do Curador</Typography>
                                    <Typography variant="body2" color="text.secondary">Ferramentas para criar/editar conteúdo</Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button startIcon={<PostAddIcon/>} variant="outlined" onClick={() => navigate('/admin/questoes')}>Questões</Button>
                                    <Button startIcon={<MenuBookIcon/>} variant="outlined" onClick={() => navigate('/admin/materias')}>Matérias</Button>
                                    <Button startIcon={<PlaylistAddIcon/>} variant="outlined" onClick={() => navigate('/admin/cursos')}>Cursos</Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>
                )}
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
