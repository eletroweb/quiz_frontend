import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    Paper, Avatar, Chip, Button, Stack, Divider
} from '@mui/material';
import {
    TrendingUp, CheckCircle, Timer, EmojiEvents, School, 
    PictureAsPdf, PlayCircle, AutoFixHigh
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
    const [dashStats, setDashStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myCourses, setMyCourses] = useState([]);
    const [courseStats, setCourseStats] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [oldStats, newDashStats] = await Promise.all([
                api.get('/stats/me'),
                api.get('/stats/dashboard')
            ]);
            setStats(oldStats.data);
            setDashStats(newDashStats.data);
            await loadMyCourses();
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
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

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}min`;
        return `${minutes}min`;
    };

    const statCards = [
        {
            title: 'Questões Respondidas',
            value: dashStats?.general?.total_questions || 0,
            icon: <CheckCircle sx={{ fontSize: 32 }} />,
            color: '#10b981',
            bgColor: '#d1fae5',
        },
        {
            title: 'Taxa de Acerto',
            value: dashStats?.general?.accuracy ? `${Math.round(dashStats.general.accuracy)}%` : '0%',
            icon: <TrendingUp sx={{ fontSize: 32 }} />,
            color: '#6366f1',
            bgColor: '#e0e7ff',
        },
        {
            title: 'Tempo na Semana',
            value: formatTime(dashStats?.weekly_seconds || 0),
            icon: <Timer sx={{ fontSize: 32 }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            title: 'Ranking Geral',
            value: `#${stats?.rank || '-'}`,
            icon: <EmojiEvents sx={{ fontSize: 32 }} />,
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
        <Box sx={{ pb: 4 }}>
            {/* Cabeçalho de Boas-vindas */}
            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontSize: '2rem',
                            border: '4px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        {userProfile?.display_name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Olá, {userProfile?.display_name || 'Estudante'}!
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                            Sua evolução está incrível hoje.
                        </Typography>
                        <Chip
                            label={userProfile?.plan === 'premium' ? 'Plano Premium' : 'Plano Gratuito'}
                            sx={{
                                mt: 1.5,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Painel de Evolução do Usuário */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Painel de Evolução</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: card.bgColor, color: card.color, display: 'flex' }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        {card.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {card.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Domínio por Matéria */}
                {dashStats?.subjects?.map((subj, idx) => {
                    const percent = subj.total > 0 ? Math.round((subj.acertos / subj.total) * 100) : 0;
                    return (
                        <Grid item xs={12} sm={6} key={idx}>
                            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        % domínio {subj.materia}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                        {percent}%
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={percent} 
                                    sx={{ height: 12, borderRadius: 6, bgcolor: '#f0f2f5' }} 
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {subj.acertos} acertos de {subj.total} questões
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Sistema de Reforço Inteligente */}
            {dashStats?.recommendations && (
                <Card sx={{ 
                    mb: 4, 
                    borderRadius: 4, 
                    border: '1px solid #e0e7ff',
                    background: 'linear-gradient(to right, #ffffff, #f8faff)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.05)'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <AutoFixHigh color="primary" />
                            <Typography variant="h5" fontWeight="bold">Reforço Inteligente</Typography>
                            <Chip label="IA Recomendação" color="primary" size="small" variant="outlined" />
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Identificamos que seu desempenho em <strong>{dashStats.recommendations.materia}</strong> está abaixo do esperado ({Math.round(dashStats.recommendations.taxa_acerto)}% de acerto). 
                            Preparamos um plano de ação para você:
                        </Typography>

                        <Grid container spacing={3}>
                            {dashStats.recommendations.video && (
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                        <PlayCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Videoaula Recomendada</Typography>
                                        <Typography variant="caption" display="block" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                                            {dashStats.recommendations.video.titulo}
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            onClick={() => navigate('/estudar')}
                                            fullWidth
                                        >
                                            Assistir Agora
                                        </Button>
                                    </Paper>
                                </Grid>
                            )}
                            
                            {dashStats.recommendations.pdf && (
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                        <PictureAsPdf color="error" sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>PDF de Apoio</Typography>
                                        <Typography variant="caption" display="block" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                                            {dashStats.recommendations.pdf.titulo}
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            component="a" 
                                            href={dashStats.recommendations.pdf.file_url} 
                                            target="_blank"
                                            fullWidth
                                        >
                                            Ler Material
                                        </Button>
                                    </Paper>
                                </Grid>
                            )}

                            <Grid item xs={12} md={4}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                    <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Mini-Simulado Focado</Typography>
                                    <Typography variant="caption" display="block" sx={{ mb: 2, height: 40 }}>
                                        5 questões selecionadas de {dashStats.recommendations.materia}
                                    </Typography>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="success"
                                        onClick={() => navigate('/quiz', { state: { materiaId: dashStats.recommendations.materia_id }})}
                                        fullWidth
                                    >
                                        Gerar Simulado
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Meus Cursos */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Seus Cursos em Estudo</Typography>
                    <Button variant="text" onClick={() => navigate('/estudar')}>Explorar todos</Button>
                </Box>
                {myCourses.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <School sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">Nenhum curso adquirido ainda.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
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
                                    <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h6" fontWeight="bold" sx={{ maxWidth: '60%' }}>{c.nome}</Typography>
                                                <Button size="small" variant="contained" onClick={() => navigate(`/curso/${c.id}`)}>Estudar</Button>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">Progresso</Typography>
                                                    <Typography variant="caption" fontWeight="bold">{overallPercent}%</Typography>
                                                </Box>
                                                <LinearProgress value={overallPercent} variant="determinate" sx={{ height: 6, borderRadius: 3 }} />
                                            </Box>
                                            {s?.proximo_conteudo && (
                                                <Box sx={{ p: 1.5, bgcolor: '#f8faff', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Próxima Aula:</Typography>
                                                    <Typography variant="body2" fontWeight="bold" noWrap>{s.proximo_conteudo.titulo}</Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Paper>

            {/* Áreas Administrativas (se houver) */}
            {userProfile?.role === 'curator' && (
                <Paper sx={{ p: 3, mt: 4, borderRadius: 4, bgcolor: '#fcfcfc', border: '1px dashed #ddd' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Painel do Curador</Typography>
                            <Typography variant="body2" color="text.secondary">Gestão de Conteúdo e Questões</Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button startIcon={<PostAddIcon/>} variant="outlined" size="small" onClick={() => navigate('/admin/questoes')}>Questões</Button>
                            <Button startIcon={<MenuBookIcon/>} variant="outlined" size="small" onClick={() => navigate('/admin/materias')}>Matérias</Button>
                            <Button startIcon={<PlaylistAddIcon/>} variant="outlined" size="small" onClick={() => navigate('/admin/cursos')}>Cursos</Button>
                        </Stack>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
