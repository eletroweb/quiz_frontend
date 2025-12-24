import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

function PublicHeader() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { label: 'Início', path: '/' },
        { label: 'Concursos', path: '#concursos' },
        { label: 'Cursos', path: '#cursos' },
        { label: 'Planos', path: '#planos' },
    ];

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
                color: '#1a1a1a'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    {/* Logo */}
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        <SchoolIcon sx={{ fontSize: 32, color: '#4F46E5' }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            Quiz Concursos
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.label}
                                    onClick={() =>
                                        item.path.startsWith('#')
                                            ? document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' })
                                            : navigate(item.path)
                                    }
                                    sx={{
                                        color: '#1a1a1a',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: '#4F46E5',
                                            background: 'transparent'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderColor: '#4F46E5',
                                    color: '#4F46E5',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#4F46E5',
                                        background: 'rgba(79, 70, 229, 0.05)'
                                    }
                                }}
                            >
                                Entrar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{
                                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                    fontWeight: 600,
                                    px: 3,
                                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                                        boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)',
                                    }
                                }}
                            >
                                Cadastrar
                            </Button>
                        </Box>
                    )}

                    {/* Mobile Menu */}
                    {isMobile && (
                        <>
                            <IconButton onClick={handleMenuOpen} sx={{ color: '#1a1a1a' }}>
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                {menuItems.map((item) => (
                                    <MenuItem
                                        key={item.label}
                                        onClick={() => {
                                            if (item.path.startsWith('#')) {
                                                document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' });
                                            } else {
                                                navigate(item.path);
                                            }
                                            handleMenuClose();
                                        }}
                                    >
                                        {item.label}
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
                                    Entrar
                                </MenuItem>
                                <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
                                    Cadastrar
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default PublicHeader;
