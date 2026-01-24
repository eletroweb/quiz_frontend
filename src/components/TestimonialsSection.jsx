import React from 'react';
import { Box, Container, Typography, Paper, Avatar, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Ana Silva',
            role: 'Aprovada no TJ-SP',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            content: 'A plataforma mudou minha forma de estudar. As questões comentadas foram essenciais para minha aprovação!',
            rating: 5
        },
        {
            name: 'Carlos Mendes',
            role: 'Aprovado na PF',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            content: 'Os simulados são incrivelmente realistas. Cheguei na prova me sentindo muito confiante e preparado.',
            rating: 5
        },
        {
            name: 'Mariana Costa',
            role: 'Aprovada no INSS',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            content: 'O ranking nacional me motivou a estudar todos os dias. Ver minha evolução foi gratificante.',
            rating: 4
        },
        {
            name: 'Ricardo Oliveira',
            role: 'Estudando para Receita',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            content: 'Material de excelente qualidade e professores super didáticos. Recomendo para todos!',
            rating: 5
        },
        {
            name: 'Fernanda Lima',
            role: 'Aprovada BB',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            content: 'Melhor investimento que fiz. A assinatura se pagou logo no primeiro mês de concursada!',
            rating: 5
        }
    ];

    // Duplicar para loop infinito
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <Box sx={{ py: { xs: 8, md: 10 }, background: 'white', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                {/* Título da Seção */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
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
                        Histórias de Sucesso
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'var(--font-display)',
                            fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-4xl)' },
                            fontWeight: 700,
                            color: '#1e293b',
                            mb: 2,
                        }}
                    >
                        O que nossos alunos dizem
                    </Typography>
                </Box>

                {/* Carrossel Infinito */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            width: '100px',
                            height: '100%',
                            zIndex: 2,
                            pointerEvents: 'none',
                        },
                        '&::before': {
                            left: 0,
                            background: 'linear-gradient(to right, white, transparent)',
                        },
                        '&::after': {
                            right: 0,
                            background: 'linear-gradient(to left, white, transparent)',
                        },
                        '&:hover .carousel-track': {
                            animationPlayState: 'paused',
                        },
                        '@keyframes scroll-left': {
                            '0%': { transform: 'translateX(0)' },
                            '100%': { transform: 'translateX(-33.33%)' }
                        }
                    }}
                >
                    <Box
                        className="carousel-track"
                        sx={{
                            display: 'flex',
                            gap: 4,
                            animation: 'scroll-left 40s linear infinite',
                            width: 'max-content',
                            py: 2
                        }}
                    >
                        {duplicatedTestimonials.map((item, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 4,
                                    width: { xs: '300px', md: '350px' },
                                    borderRadius: '24px',
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    flexShrink: 0,
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                                        borderColor: 'var(--color-primary)',
                                    }
                                }}
                            >
                                <FormatQuoteIcon
                                    sx={{
                                        fontSize: 40,
                                        color: 'var(--color-primary)',
                                        opacity: 0.2,
                                        position: 'absolute',
                                        top: 20,
                                        right: 20
                                    }}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        src={item.image}
                                        alt={item.name}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            mr: 2,
                                            border: '3px solid white',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            {item.role}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Rating value={item.rating} readOnly size="small" sx={{ mb: 2, color: '#FBBF24' }} />

                                <Typography sx={{ color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
                                    "{item.content}"
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default TestimonialsSection;
