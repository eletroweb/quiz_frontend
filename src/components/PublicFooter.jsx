import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';

function PublicFooter() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        'Plataforma': [
            { label: 'Sobre Nós', href: '#' },
            { label: 'Como Funciona', href: '#' },
            { label: 'Planos e Preços', href: '/login' },
            { label: 'Blog', href: '#' }
        ],
        'Recursos': [
            { label: 'Questões', href: '/login' },
            { label: 'Simulados', href: '/login' },
            { label: 'Cursos', href: '/login' },
            { label: 'Ranking', href: '/login' }
        ],
        'Suporte': [
            { label: 'Central de Ajuda', href: '#' },
            { label: 'Contato', href: '#' },
            { label: 'FAQ', href: '#' },
            { label: 'Termos de Uso', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
        { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
        { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
        { icon: <YouTubeIcon />, href: '#', label: 'YouTube' }
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: '#1a1a1a',
                color: 'white',
                pt: 8,
                pb: 4
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Logo e Descrição */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <SchoolIcon sx={{ fontSize: 36, color: '#4F46E5' }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Quiz Concursos
                            </Typography>
                        </Box>
                        <Typography sx={{ color: '#9ca3af', mb: 3, lineHeight: 1.7 }}>
                            A melhor plataforma para você se preparar e conquistar sua aprovação nos concursos públicos.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    sx={{
                                        color: 'white',
                                        background: 'rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            background: '#4F46E5',
                                            transform: 'translateY(-3px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <Grid item xs={6} md={2.66} key={title}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
                                {title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        sx={{
                                            color: '#9ca3af',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            '&:hover': {
                                                color: '#4F46E5',
                                                textDecoration: 'none'
                                            },
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Copyright */}
                <Box
                    sx={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        mt: 6,
                        pt: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        © {currentYear} Quiz Concursos. Todos os direitos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default PublicFooter;
