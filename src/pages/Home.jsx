import React from 'react';
import { Box } from '@mui/material';
import PublicHeader from '../components/PublicHeader';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CoursesSection from '../components/CoursesSection';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';
import PublicFooter from '../components/PublicFooter';

import NewsSection from '../components/NewsSection';

function Home() {
    return (
        <Box>
            <PublicHeader />
            <Box id="inicio">
                <HeroSection />
            </Box>
            <NewsSection />
            <Box id="concursos">
                <FeaturesSection />
            </Box>
            <TestimonialsSection />
            <Box id="cursos">
                <CoursesSection />
            </Box>
            <StatsSection />
            <Box id="planos">
                <CTASection />
            </Box>
            <PublicFooter />
        </Box>
    );
}

export default Home;
