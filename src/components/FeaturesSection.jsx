import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function FeaturesSection() {
    const features = [
        {
            icon: <QuizIcon sx={{ fontSize: 48 }} />,
            title: '10.000+ Questões',
            description: 'Banco de dados com milhares de questões comentadas para você treinar.',
            color: 'var(--color-primary)',
            bg: 'var(--color-primary-light)',
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
            title: 'Simulados Realistas',
            description: 'Pratique com simulados que replicam as condições reais das provas.',
            color: 'var(--color-accent)',
            bg: 'var(--color-accent-light)',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
            title: 'Ranking Nacional',
            description: 'Compare seu desempenho com outros candidatos em tempo real.',
            color: 'var(--color-secondary)',
            bg: 'var(--color-secondary-light)',
        }
    ];

    // Duplicar features para criar loop infinito
    const duplicatedFeatures = [...features, ...features, ...features];

    return (
        <Box sx={{ py: { xs: 8, md: 10 }, background: 'var(--color-bg-secondary)' }}>
            <Container maxWidth="lg">
                {/* Título da Seção */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            mb: 2,
                        }}
                    >
                        Por que escolher
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'var(--font-display)',
                            fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-4xl)' },
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            mb: 2,
                        }}
                    >
                        Recursos que Fazem a Diferença
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--color-text-secondary)',
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Tudo que você precisa para alcançar a aprovação
                    </Typography>
                </Box>

                {/* Carrossel Infinito */}
                <Box
                    sx={{
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%',
                        '&:hover .carousel-track': {
                            animationPlayState: 'paused',
                        },
                        '@keyframes scroll': {
                            '0%': {
                                transform: 'translateX(0)',
                            },
                            '100%': {
                                transform: 'translateX(-33.333%)',
                            },
                        },
                    }}
                >
                    <Box
                        className="carousel-track"
                        sx={{
                            display: 'flex',
                            gap: 4,
                            animation: 'scroll 30s linear infinite',
                            width: 'max-content',
                        }}
                    >
                        {duplicatedFeatures.map((feature, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 4,
                                    minWidth: { xs: '280px', sm: '320px', md: '360px' },
                                    maxWidth: { xs: '280px', sm: '320px', md: '360px' },
                                    borderRadius: 'var(--radius-xl)',
                                    background: 'white',
                                    textAlign: 'center',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: 'var(--shadow-xl)',
                                        borderColor: feature.color,
                                        '& .feature-icon': {
                                            transform: 'scale(1.1)',
                                            background: feature.color,
                                            color: 'white',
                                        },
                                    }
                                }}
                            >
                                {/* Elemento Decorativo */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: feature.bg,
                                        opacity: 0.5,
                                        zIndex: 0,
                                    }}
                                />

                                {/* Ícone */}
                                <Box
                                    className="feature-icon"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 80,
                                        height: 80,
                                        mb: 3,
                                        color: feature.color,
                                        background: feature.bg,
                                        borderRadius: 'var(--radius-lg)',
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {feature.icon}
                                </Box>

                                {/* Título */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 600,
                                        mb: 2,
                                        color: 'var(--color-text-primary)',
                                        fontSize: 'var(--text-xl)',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Descrição */}
                                <Typography
                                    sx={{
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 1.7,
                                        fontSize: 'var(--text-base)',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>

                {/* CTA Inferior */}
                <Box
                    sx={{
                        mt: 10,
                        textAlign: 'center',
                        p: { xs: 4, md: 6 },
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-2xl)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    {/* Elementos Decorativos */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '-50px',
                            left: '-50px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.2)',
                            filter: 'blur(40px)',
                        }}
                    />

                    <Typography
                        sx={{
                            fontFamily: 'var(--font-display)',
                            fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-4xl)' },
                            fontWeight: 800,
                            mb: 2,
                            position: 'relative',
                            zIndex: 1,
                            color: '#FFFFFF',
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        Pronto para Começar?
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 'var(--text-lg)',
                            mb: 4,
                            opacity: 1,
                            position: 'relative',
                            zIndex: 1,
                            maxWidth: '600px',
                            mx: 'auto',
                            color: '#F1F5F9',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                            fontWeight: 500
                        }}
                    >
                        Junte-se a milhares de candidatos que já estão se preparando para a aprovação
                    </Typography>
                    <Box
                        component="a"
                        href="/login"
                        sx={{
                            display: 'inline-block',
                            px: 6,
                            py: 2.5,
                            background: 'white',
                            color: 'var(--color-primary)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-xl)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 'var(--shadow-2xl)',
                            },
                        }}
                    >
                        Criar Conta Grátis
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default FeaturesSection;
