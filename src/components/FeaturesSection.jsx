import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function FeaturesSection() {
    const features = [
        {
            icon: <QuizIcon sx={{ fontSize: 60 }} />,
            title: '10.000+ Questões',
            description: 'Banco de dados com milhares de questões comentadas para você treinar.',
            color: '#4F46E5', // Indigo
            bg: '#EEF2FF'
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 60 }} />,
            title: 'Simulados Realistas',
            description: 'Pratique com simulados que replicam as condições reais das provas.',
            color: '#F97316', // Orange
            bg: '#FFF7ED'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 60 }} />,
            title: 'Ranking Nacional',
            description: 'Compare seu desempenho com outros candidatos em tempo real.',
            color: '#7C3AED', // Purple
            bg: '#F5F3FF'
        }
    ];

    return (
        <Box sx={{ py: 8, background: '#F8FAFC' }}>
            <Container maxWidth="md">
                {/* Título da Seção removido para ficar mais limpo como na referência, ou pode ser mantido discreto */}

                <Grid container spacing={3} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 4,
                                    background: 'white',
                                    textAlign: 'center',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    maxWidth: { xs: '100%', sm: '350px' },
                                    mx: 'auto',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        borderColor: feature.color
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        mb: 2,
                                        color: feature.color,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        // background: feature.bg, // Opcional: fundo colorido no ícone
                                        display: 'inline-flex'
                                    }}
                                >
                                    {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 1.5,
                                        color: '#1E293B',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#64748B',
                                        lineHeight: 1.6,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default FeaturesSection;
