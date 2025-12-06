import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Paper
} from '@mui/material';
import {
    People, Quiz, School, Assessment
} from '@mui/icons-material';
import api from '../../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_questions: 0,
        total_subjects: 0,
        total_contests: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [users, questions, subjects, contests] = await Promise.all([
                api.get('/users'),
                api.get('/questoes'),
                api.get('/materias'),
                api.get('/concursos')
            ]);

            setStats({
                total_users: users.data.length,
                total_questions: questions.data.length,
                total_subjects: subjects.data.length,
                total_contests: contests.data.length
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const statCards = [
        {
            title: 'Total de Usuários',
            value: stats.total_users,
            icon: <People sx={{ fontSize: 40 }} />,
            color: '#6366f1',
            bgColor: '#e0e7ff',
        },
        {
            title: 'Total de Questões',
            value: stats.total_questions,
            icon: <Quiz sx={{ fontSize: 40 }} />,
            color: '#10b981',
            bgColor: '#d1fae5',
        },
        {
            title: 'Total de Matérias',
            value: stats.total_subjects,
            icon: <School sx={{ fontSize: 40 }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            title: 'Total de Concursos',
            value: stats.total_contests,
            icon: <Assessment sx={{ fontSize: 40 }} />,
            color: '#ec4899',
            bgColor: '#fce7f3',
        },
    ];

    return (
        <Box>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Dashboard Administrativo
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                    Visão geral da plataforma
                </Typography>
            </Paper>

            <Grid container spacing={3}>
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
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        bgcolor: card.bgColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: card.color,
                                        mb: 2,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <Typography variant="h3" fontWeight="bold" gutterBottom>
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
        </Box>
    );
}
