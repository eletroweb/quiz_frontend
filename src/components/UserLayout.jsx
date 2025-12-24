import React, { useState } from 'react';
import {
    AppBar, Box, Toolbar, Typography, IconButton, Drawer, List,
    ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Menu, MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, School, Quiz, Assessment,
    AccountCircle, Logout, CardMembership, EmojiEvents
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

export default function UserLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth(); // ✅ removido userProfile

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Estudar', icon: <School />, path: '/estudar' },
        { text: 'Quiz', icon: <Quiz />, path: '/quiz' },
        { text: 'Simulados', icon: <Assessment />, path: '/simulados' },
        { text: 'Ranking', icon: <EmojiEvents />, path: '/ranking' },
        { text: 'Planos', icon: <CardMembership />, path: '/planos' },
    ];

    const drawer = (
        <div>
            <Toolbar sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    Quiz Concursos
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        selected={location.pathname === item.path}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                },
                                '& .MuiListItemIcon-root': {
                                    color: 'white',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <List sx={{ px: 1 }}>
                <ListItemButton
                    onClick={() => navigate('/perfil')}
                    sx={{ borderRadius: 2 }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary="Perfil" />
                </ListItemButton>
                <ListItemButton
                    onClick={() => auth.signOut()}
                    sx={{ borderRadius: 2 }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                </ListItemButton>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: 'white',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(item => item.path === location.pathname)?.text || 'Quiz Concursos'}
                    </Typography>
                    <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        size="small"
                    >
                        <Avatar sx={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                            {currentUser?.email?.[0].toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { navigate('/perfil'); setAnchorEl(null); }}>
                            Perfil
                        </MenuItem>
                        <MenuItem onClick={() => { auth.signOut(); setAnchorEl(null); }}>
                            Sair
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
