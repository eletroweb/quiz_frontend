import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CTASection() {
    const navigate = useNavigate();
    return (
        <Box sx={{ py: 12, textAlign: 'center', background: 'white' }}>
            <Container maxWidth="md">
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 3,
                        color: '#0F172A',
                        fontSize: { xs: '2rem', md: '3rem' },
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    Pronto para começar sua jornada?
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: '#475569',
                        mb: 6,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    Junte-se a milhares de estudantes que já estão transformando seus sonhos em realidade com o Quiz Concursos.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/cadastro')}
                        sx={{
                            background: '#F97316',
                            color: 'white',
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '50px',
                            textTransform: 'none',
                            boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)',
                            '&:hover': {
                                background: '#EA580C',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 15px 25px rgba(249, 115, 22, 0.4)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Criar Conta Grátis
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/planos')}
                        sx={{
                            borderColor: '#CBD5E1',
                            color: '#475569',
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '50px',
                            textTransform: 'none',
                            borderWidth: '2px',
                            '&:hover': {
                                borderColor: '#4F46E5',
                                color: '#4F46E5',
                                background: 'transparent',
                                borderWidth: '2px'
                            }
                        }}
                    >
                        Ver Planos
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default CTASection;
