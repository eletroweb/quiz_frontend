import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import HandshakeIcon from '@mui/icons-material/Handshake';

function StatsSection() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const stats = [
        {
            icon: <GroupIcon sx={{ fontSize: 40 }} />,
            value: 150000,
            suffix: '+',
            label: 'Alunos Ativos'
        },
        {
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            value: 10000000,
            suffix: '+',
            label: 'Questões Resolvidas'
        },
        {
            icon: <ThumbUpIcon sx={{ fontSize: 40 }} />,
            value: 95,
            suffix: '%',
            label: 'Taxa de Aprovação'
        },
        {
            icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
            value: 500,
            suffix: '+',
            label: 'Parcerias com Professores'
        }
    ];

    return (
        <Box
            ref={ref}
            sx={{
                py: 8,
                background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)', // Gradiente Indigo to Violet
                mt: 8,
                borderRadius: { xs: 0, md: 4 }, // Bordas arredondadas se não for mobile full width
                mx: { xs: 0, md: 4 }, // Margem lateral em desktop
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    {stats.map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column', // Ícone acima do texto
                                    alignItems: 'center', // Centralizado
                                    textAlign: 'center',
                                    gap: 1
                                }}
                            >
                                <Box sx={{ opacity: 1, mb: 1, color: '#FEF08A' }}>
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                        lineHeight: 1,
                                        color: '#1e293b',
                                        textShadow: '0 2px 0px rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {inView ? (
                                        <CountUp end={stat.value} duration={2.5} separator="." />
                                    ) : (
                                        '0'
                                    )}
                                    {stat.suffix}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 700,
                                        opacity: 1,
                                        fontSize: '1rem',
                                        color: '#334155'
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default StatsSection;
