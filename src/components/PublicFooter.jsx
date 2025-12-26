import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';

function PublicFooter() {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('site_config');
            if (raw) setConfig(JSON.parse(raw));
            else setConfig(null);
        } catch (e) {
            setConfig(null);
        }
    }, []);

    const defaults = {
        description: 'A melhor plataforma para você se preparar e conquistar sua aprovação nos concursos públicos.',
        footerLinks: {
            Plataforma: [
                { label: 'Sobre Nós', href: '/sobre' },
                { label: 'Como Funciona', href: '/como-funciona' },
                { label: 'Planos e Preços', href: '/planos' },
                { label: 'Blog', href: '/blog' }
            ],
            Recursos: [
                { label: 'Questões', href: '/questoes' },
                { label: 'Simulados', href: '/simulados' },
                { label: 'Cursos', href: '/cursos' },
                { label: 'Ranking', href: '/ranking' }
            ],
            Suporte: [
                { label: 'Central de Ajuda', href: '/suporte' },
                { label: 'Contato', href: '/contato' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Termos de Uso', href: '/termos' }
            ]
        },
        socialLinks: [
            { icon: 'facebook', href: 'https://facebook.com' },
            { icon: 'instagram', href: 'https://instagram.com' },
            { icon: 'twitter', href: 'https://twitter.com' },
            { icon: 'youtube', href: 'https://youtube.com' }
        ]
    };

    const data = config || defaults;

    const renderSocialIcon = (name) => {
        if (name === 'facebook') return <FacebookIcon />;
        if (name === 'instagram') return <InstagramIcon />;
        if (name === 'twitter') return <TwitterIcon />;
        if (name === 'youtube') return <YouTubeIcon />;
        return <FacebookIcon />;
    };

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
                            {data.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {data.socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    onClick={() => window.open(social.href, '_blank')}
                                    aria-label={social.icon}
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
                                    {renderSocialIcon(social.icon)}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Links */}
                    {Object.entries(data.footerLinks).map(([title, links]) => (
                        <Grid item xs={6} md={2.66} key={title}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
                                {title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        component="button"
                                        onClick={() => {
                                            if (link.href && link.href.startsWith('/')) navigate(link.href);
                                            else if (link.href) window.open(link.href, '_blank');
                                        }}
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
