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
    useTheme,
    Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
        { label: 'Planos', path: '/planos' },
    ];

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 0, md: 2 } }}>
                    {/* Logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => navigate('/')}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)',
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: 'var(--text-lg)',
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: { xs: 'none', sm: 'block' },
                            }}
                        >
                            Quiz Concursos
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.label}
                                    onClick={() =>
                                        item.path.startsWith('#')
                                            ? document.querySelector(item.path)?.scrollIntoView({ behavior: 'smooth' })
                                            : navigate(item.path)
                                    }
                                    sx={{
                                        color: 'var(--color-text-primary)',
                                        fontWeight: 500,
                                        fontSize: 'var(--text-sm)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'var(--color-primary-light)',
                                            color: 'var(--color-primary)',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}

                            <Box sx={{ width: '1px', height: '24px', background: 'var(--color-border)', mx: 1 }} />

                            <Button
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderColor: 'var(--color-primary)',
                                    color: 'var(--color-primary)',
                                    fontWeight: 600,
                                    fontSize: 'var(--text-sm)',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary)',
                                        background: 'var(--color-primary-light)',
                                    },
                                }}
                            >
                                Entrar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{
                                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: 'var(--text-sm)',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'var(--shadow-lg)',
                                    },
                                }}
                            >
                                Cadastrar
                            </Button>

                            {/* Cart icon */}
                            <IconButton
                                sx={{
                                    ml: 1,
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'var(--color-primary-light)',
                                        color: 'var(--color-primary)',
                                    },
                                }}
                                onClick={() => navigate('/cart')}
                                aria-label="carrinho"
                            >
                                <Badge
                                    badgeContent={(() => {
                                        try {
                                            const raw = localStorage.getItem('cart_items');
                                            const arr = raw ? JSON.parse(raw) : [];
                                            return Array.isArray(arr) ? arr.length : 0;
                                        } catch {
                                            return 0;
                                        }
                                    })()}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            background: 'var(--color-accent)',
                                            color: 'white',
                                            fontWeight: 700,
                                        },
                                    }}
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Box>
                    )}

                    {/* Mobile Menu */}
                    {isMobile && (
                        <>
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{
                                    color: 'var(--color-text-primary)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border)',
                                        boxShadow: 'var(--shadow-xl)',
                                    },
                                }}
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
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: 'var(--text-sm)',
                                            '&:hover': {
                                                background: 'var(--color-primary-light)',
                                                color: 'var(--color-primary)',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </MenuItem>
                                ))}
                                <MenuItem
                                    onClick={() => {
                                        navigate('/login');
                                        handleMenuClose();
                                    }}
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: 'var(--text-sm)',
                                        '&:hover': { background: 'var(--color-primary-light)' },
                                    }}
                                >
                                    Entrar
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/login');
                                        handleMenuClose();
                                    }}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: 'var(--text-sm)',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        '&:hover': { background: 'var(--color-primary-dark)' },
                                    }}
                                >
                                    Cadastrar
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/cart');
                                        handleMenuClose();
                                    }}
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: 'var(--text-sm)',
                                        '&:hover': { background: 'var(--color-primary-light)' },
                                    }}
                                >
                                    Carrinho
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar >
    );
}

export default PublicHeader;
