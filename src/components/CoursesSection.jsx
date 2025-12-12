import React, { useState, useEffect } from 'react';
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
                        color: '#1E293B',
                        textAlign: 'left'
                    }}
                >
                    Concursos em Destaque
                </Typography>

                <Box sx={{
                    '& .slick-slide': { px: 1.5 },
                    '& .slick-dots': { bottom: -40 },
                    '& .slick-prev': { left: -35 },
                    '& .slick-next': { right: -35 },
                    '& .slick-prev:before, & .slick-next:before': { color: '#4F46E5', fontSize: 30 }
                }}>
                    <Slider {...sliderSettings}>
                        {(userProfile && (userProfile.plan === 'annual' || userProfile.plan === 'lifetime')
                          ? cursos
                          : cursos.filter(c => c.owned || c.includedInPlan))
                          .map((curso, index) => (
                            <Box key={curso.id || index} sx={{ px: 1, pb: 2 }}>
                                <CourseCard course={curso} />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
}

export default CoursesSection;
