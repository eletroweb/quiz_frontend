import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, Grid } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import axios from 'axios';
import api from '../services/api';
import homePageDesign from '../assets/home_page_design.png';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

function HeroSection() {
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await api.get('/banners/ativos');
            const data = Array.isArray(response.data) ? response.data : [];
            setBanners(data.filter(b => b.tipo === 'hero'));
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar banners:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentBanner((prev) => (prev + 1) % banners.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    const handlePrev = () => {
        setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    };

    const defaultBanner = {
        titulo: 'Prepare-se para Concursos Públicos',
        descricao: 'A sua plataforma completa para alcançar a aprovação com questões, simulados e cursos focados.',
        texto_botao: 'Começar Agora',
        imagem_url: null // Se tiver imagem, usa, senão usa o layout padrão
    };

    const banner = banners.length > 0 ? banners[currentBanner] : defaultBanner;

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: { xs: '400px', md: '450px' },
                maxHeight: { xs: '500px', md: '550px' },
                height: { xs: 'auto', md: '500px' },
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', // Gradiente Roxo/Azul vibrante
                overflow: 'hidden',
                pt: { xs: 8, md: 0 } // Espaço para o header fixo em mobile
            }}
        >
            {/* Elementos Decorativos de Fundo (Círculos/Blur) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(79, 70, 229, 0.4)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} alignItems="center" sx={{ minHeight: '400px', py: 4 }}>
                    {/* Texto do Banner */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                animation: 'fadeInLeft 0.8s ease-out',
                                '@keyframes fadeInLeft': {
                                    from: { opacity: 0, transform: 'translateX(-30px)' },
                                    to: { opacity: 1, transform: 'translateX(0)' }
                                }
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    color: 'white',
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.02em',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                }}
                            >
                                {banner.titulo}
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 4,
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    lineHeight: 1.6,
                                    fontWeight: 400,
                                    maxWidth: '500px',
                                    mx: { xs: 'auto', md: 0 }
                                }}
                            >
                                {banner.descricao}
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => banner.link_url ? window.location.href = banner.link_url : window.location.href = '/login'}
                                sx={{
                                    background: '#F97316', // Laranja vibrante
                                    color: 'white',
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    borderRadius: '50px', // Botão arredondado moderno
                                    textTransform: 'none',
                                    boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4)',
                                    '&:hover': {
                                        background: '#EA580C',
                                        boxShadow: '0 15px 35px rgba(249, 115, 22, 0.5)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {banner.texto_botao || 'Começar Agora'}
                            </Button>
                        </Box>
                    </Grid>

                    {/* Imagem/Ilustração do Banner */}
                    <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '100%',
                                maxHeight: '350px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'fadeInRight 0.8s ease-out',
                                '@keyframes fadeInRight': {
                                    from: { opacity: 0, transform: 'translateX(30px)' },
                                    to: { opacity: 1, transform: 'translateX(0)' }
                                }
                            }}
                        >
                            {/* Placeholder Ilustrativo ou Imagem do Banner */}
                            {banner.imagem_url ? (
                                <Box
                                    component="img"
                                    src={banner.imagem_url?.startsWith('http') ? banner.imagem_url : `${API_BASE_URL}${banner.imagem_url}`}
                                    alt={banner.titulo}
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))'
                                    }}
                                />
                            ) : (
                                // Ilustração CSS Pura (Placeholder Estiloso)
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'url(/src/assets/home_page_design.png)', // Tenta usar a imagem salva se disponível, ou fallback
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        // Fallback visual se a imagem não carregar bem
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {/* Se não tiver imagem, mostra um card flutuante simulando a interface */}
                                    <Box sx={{
                                        width: '80%',
                                        height: '60%',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 4,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Typography variant="h6">Ilustração do Concurso</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Navegação do Carrossel (Se houver mais de um) */}
            {banners.length > 1 && (
                <>
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: { xs: 10, md: 40 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            backdropFilter: 'blur(5px)',
                            '&:hover': { background: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: { xs: 10, md: 40 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            backdropFilter: 'blur(5px)',
                            '&:hover': { background: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                </>
            )}
        </Box>
    );
}

export default HeroSection;
