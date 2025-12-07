import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import api from '../services/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function CoursesSection() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await api.get('/cursos');
            setCursos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
            setLoading(false);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Box sx={{ py: 10, background: 'white' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 6,
                        color: '#1E293B', // Slate 800
                        textAlign: 'left' // Alinhado a esquerda como na referência ou centralizado se preferir
                    }}
                >
                    Cursos Populares
                </Typography>

                <Box sx={{
                    '& .slick-slide': {
                        px: 1.5
                    },
                    '& .slick-dots': {
                        bottom: -40
                    },
                    '& .slick-dots li button:before': {
                        fontSize: 10,
                        color: '#4F46E5'
                    },
                    '& .slick-dots li.slick-active button:before': {
                        color: '#4F46E5'
                    },
                    '& .slick-prev, & .slick-next': {
                        zIndex: 1
                    },
                    '& .slick-prev': {
                        left: -35
                    },
                    '& .slick-next': {
                        right: -35
                    },
                    '& .slick-prev:before, & .slick-next:before': {
                        color: '#4F46E5',
                        fontSize: 30
                    }
                }}>
                    <Slider {...sliderSettings}>
                        {cursos.map((curso, index) => (
                            <Box key={index} sx={{ px: 1 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        border: '1px solid #E2E8F0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', background: '#f1f5f9' }}>
                                        {/* Número do Ranking */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 10,
                                                width: 30,
                                                height: 30,
                                                background: 'white',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                color: '#1E293B',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                zIndex: 2
                                            }}
                                        >
                                            {index + 1}
                                        </Box>

                                        {/* Imagem Placeholder Colorida se não tiver imagem real */}
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            background: `linear-gradient(135deg, ${['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} 0%, #1E293B 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {curso.imagem_url ? (
                                                <CardMedia component="img" image={curso.imagem_url} height="100%" />
                                            ) : (
                                                <Typography variant="h6" sx={{ color: 'white', opacity: 0.8 }}>Curso</Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                lineHeight: 1.3,
                                                height: '2.6em', // Limita a 2 linhas
                                                overflow: 'hidden',
                                                color: '#1E293B'
                                            }}
                                        >
                                            {curso.nome}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
                                            <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                                {curso.rating || '4.8'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                                /5 ({curso.avaliacoes || 100} avaliações)
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderRadius: 50,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: '#CBD5E1',
                                                color: '#475569',
                                                '&:hover': {
                                                    borderColor: '#4F46E5',
                                                    color: '#4F46E5',
                                                    background: 'transparent'
                                                }
                                            }}
                                        >
                                            Ver Curso
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
}

export default CoursesSection;
