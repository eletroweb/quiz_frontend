import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, Typography, Chip, Card,
    CardContent, Grid, LinearProgress
} from '@mui/material';
import { EmojiEvents, TrendingUp, Star } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Ranking() {
    const [rankings, setRankings] = useState([]);
    const [myStats, setMyStats] = useState(null);
    const { userProfile } = useAuth();

    useEffect(() => {
        loadRanking();
    }, []);

    const loadRanking = async () => {
        try {
            // Simulação de dados de ranking
            // Em produção, viria de um endpoint /api/ranking
            const mockRanking = [
                { id: 1, name: 'João Silva', score: 950, accuracy: 95, answered: 200, avatar: 'J' },
                { id: 2, name: 'Maria Santos', score: 920, accuracy: 92, answered: 180, avatar: 'M' },
                { id: 3, name: 'Pedro Costa', score: 890, accuracy: 89, answered: 170, avatar: 'P' },
                { id: 4, name: 'Ana Oliveira', score: 850, accuracy: 85, answered: 160, avatar: 'A' },
                { id: 5, name: 'Carlos Souza', score: 820, accuracy: 82, answered: 150, avatar: 'C' },
            ];

            setRankings(mockRanking);

            // Carregar estatísticas do usuário
            const response = await api.get('/stats/me');
            setMyStats(response.data);
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
        }
    };

    const getMedalColor = (position) => {
        if (position === 1) return '#FFD700'; // Ouro
        if (position === 2) return '#C0C0C0'; // Prata
        if (position === 3) return '#CD7F32'; // Bronze
        return 'transparent';
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Ranking
            </Typography>

            {/* Meu Desempenho */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Meu Desempenho
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold">
                                #{myStats?.rank || '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Posição no Ranking
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold">
                                {myStats?.total_answered || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Questões Respondidas
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold">
                                {myStats?.accuracy ? Math.round(myStats.accuracy) : 0}%
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Taxa de Acerto
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Top 3 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {rankings.slice(0, 3).map((user, index) => (
                    <Grid item xs={12} md={4} key={user.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'visible',
                                border: index === 0 ? '2px solid #FFD700' : 'none',
                            }}
                        >
                            <CardContent sx={{ pt: 4 }}>
                                {index < 3 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: getMedalColor(index + 1),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: 3,
                                        }}
                                    >
                                        <EmojiEvents sx={{ color: 'white' }} />
                                    </Box>
                                )}
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        margin: '0 auto 16px',
                                        fontSize: '2rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    {user.avatar}
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold">
                                    {user.name}
                                </Typography>
                                <Typography variant="h4" color="primary" fontWeight="bold" sx={{ my: 1 }}>
                                    {user.score}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    pontos
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={`${user.accuracy}% acerto`}
                                        size="small"
                                        color="success"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`${user.answered} questões`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tabela Completa */}
            <Paper sx={{ borderRadius: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Posição</TableCell>
                                <TableCell>Usuário</TableCell>
                                <TableCell align="right">Pontos</TableCell>
                                <TableCell align="right">Taxa de Acerto</TableCell>
                                <TableCell align="right">Questões</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rankings.map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        bgcolor: userProfile?.id === user.id ? 'action.selected' : 'inherit',
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {index < 3 && (
                                                <EmojiEvents
                                                    sx={{
                                                        color: getMedalColor(index + 1),
                                                        fontSize: 20,
                                                    }}
                                                />
                                            )}
                                            <Typography fontWeight="bold">
                                                #{index + 1}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                }}
                                            >
                                                {user.avatar}
                                            </Avatar>
                                            <Typography>{user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold" color="primary">
                                            {user.score}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={`${user.accuracy}%`}
                                            size="small"
                                            color="success"
                                        />
                                    </TableCell>
                                    <TableCell align="right">{user.answered}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
