import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import api from '../services/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CourseCard from './CourseCard';
import { useAuth } from '../contexts/AuthContext';

function CoursesSection() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userProfile } = useAuth();

    const fetchCursos = useCallback(async () => {
        try {
            const response = await api.get('/cursos');
            const data = Array.isArray(response.data) ? response.data : [];
            setCursos(data);
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: true,
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
                    slidesToScroll: 1,
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px'
                }
            }
        ]
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, background: 'white', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: { xs: 4, md: 6 },
                        color: '#1E293B',
                        textAlign: 'left',
                        fontSize: { xs: '1.75rem', md: '3rem' }
                    }}
                >
                    Concursos em Destaque
                </Typography>

                {loading ? (
                    <Typography variant="body1">
                        Carregando cursos...
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            '& .slick-list': {
                                overflow: 'visible'
                            },
                            '& .slick-slide': { 
                                px: { xs: 1, md: 1.5 },
                                transition: 'opacity 0.3s ease',
                                opacity: 1
                            },
                            '& .slick-dots': { bottom: -40 },
                            '& .slick-prev': { 
                                left: -35,
                                zIndex: 1,
                                display: { xs: 'none !important', md: 'block !important' }
                            },
                            '& .slick-next': { 
                                right: -35,
                                zIndex: 1,
                                display: { xs: 'none !important', md: 'block !important' }
                            },
                            '& .slick-prev:before, & .slick-next:before': {
                                color: '#4F46E5',
                                fontSize: 30
                            }
                        }}
                    >
                        <Slider {...sliderSettings}>
                            {(userProfile &&
                            (userProfile.plan === 'annual' ||
                                userProfile.plan === 'lifetime')
                                ? cursos
                                : cursos
                            ).map((curso, index) => (
                                <Box key={curso.id || index} sx={{ px: 1, pb: 2 }}>
                                    <CourseCard course={curso} />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default CoursesSection;
