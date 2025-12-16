import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarToday, Person } from '@mui/icons-material';
import api from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            // Buscar destaques
            const featuredResponse = await api.get('/news?featured=true&limit=1');
            if (featuredResponse.data && featuredResponse.data.length > 0) {
                setFeatured(featuredResponse.data[0]);
            }

            // Buscar lista geral (excluindo o destaque se possível)
            const listResponse = await api.get('/news?limit=5');
            // Filtrar o destaque da lista
            const listData = listResponse.data.filter(n => n.id !== (featuredResponse.data[0]?.id));
            setNews(listData);

            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            setLoading(false);
        }
    };

    const handleOpenNews = (item) => {
        setSelectedNews(item);
        setOpenDialog(true);
    };

    const handleCloseNews = () => {
        setOpenDialog(false);
        setSelectedNews(null);
    };

    if (loading || (news.length === 0 && !featured)) return null;

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options).toUpperCase();
    };

    return (
        <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '2px solid #000', pb: 1 }}>
                    <Typography variant="h4" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Últimas Notícias
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Destaque Principal (Spotlight) */}
                    {featured && (
                        <Grid item xs={12} md={5}>
                            <Box
                                onClick={() => handleOpenNews(featured)}
                                sx={{
                                    position: 'relative',
                                    height: '100%',
                                    minHeight: 400,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                <Typography variant="h6" sx={{ bgcolor: 'black', color: 'white', display: 'inline-block', px: 2, py: 0.5, mb: 2, fontWeight: 'bold' }}>
                                    DESTAQUE
                                </Typography>
                                {featured.imagem_url && (
                                    <Box
                                        component="img"
                                        src={featured.imagem_url.startsWith('http') ? featured.imagem_url : `${API_BASE_URL}${featured.imagem_url}`}
                                        alt={featured.titulo}
                                        sx={{ width: '100%', height: 300, objectFit: 'cover', mb: 2, display: 'block' }}
                                    />
                                )}
                                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
                                    {featured.titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {featured.resumo}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', fontSize: '0.8rem', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday sx={{ fontSize: 14 }} />
                                        {formatDate(featured.data_publicacao)}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Person sx={{ fontSize: 14 }} />
                                        ADMIN
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Lista Lateral (News) */}
                    <Grid item xs={12} md={7}>
                        {featured && <Box sx={{ borderTop: { xs: '1px solid #e5e7eb', md: 'none' }, mb: 3 }} />}

                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', borderBottom: '1px solid #000', pb: 1, mb: 3 }}>
                            Recentes
                        </Typography>

                        <Grid container spacing={3}>
                            {news.map((item) => (
                                <Grid item xs={12} key={item.id}>
                                    <Box
                                        onClick={() => handleOpenNews(item)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 0.8 }
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={4} sm={3}>
                                                {item.imagem_url ? (
                                                    <Box
                                                        component="img"
                                                        src={item.imagem_url.startsWith('http') ? item.imagem_url : `${API_BASE_URL}${item.imagem_url}`}
                                                        alt={item.titulo}
                                                        sx={{ width: '100%', height: 90, objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box sx={{ width: '100%', height: 90, bgcolor: '#E2E8F0' }} />
                                                )}
                                            </Grid>
                                            <Grid item xs={8} sm={9}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 1 }}>
                                                    {item.titulo}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    mb: 1
                                                }}>
                                                    {item.resumo}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', fontSize: '0.75rem', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarToday sx={{ fontSize: 12 }} />
                                                        {formatDate(item.data_publicacao)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                {/* Dialog de Leitura */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseNews}
                    maxWidth="md"
                    fullWidth
                    scroll="paper"
                >
                    {selectedNews && (
                        <>
                            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {selectedNews.categoria?.toUpperCase() || 'NOTÍCIA'}
                                </Typography>
                                <Button onClick={handleCloseNews} color="inherit">Fechar</Button>
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography variant="h4" fontWeight="900" gutterBottom>
                                    {selectedNews.titulo}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, color: 'text.secondary', fontSize: '0.9rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarToday fontSize="small" />
                                        {formatDate(selectedNews.data_publicacao)}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Person fontSize="small" />
                                        ADMIN
                                    </Box>
                                </Box>

                                {selectedNews.imagem_url && (
                                    <Box
                                        component="img"
                                        src={selectedNews.imagem_url.startsWith('http') ? selectedNews.imagem_url : `${API_BASE_URL}${selectedNews.imagem_url}`}
                                        alt={selectedNews.titulo}
                                        sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', mb: 3, borderRadius: 1 }}
                                    />
                                )}

                                <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
                                    {selectedNews.resumo}
                                </Typography>

                                <Box sx={{ mt: 3, lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                    {selectedNews.conteudo}
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseNews} variant="contained" color="primary">
                                    Fechar
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Container>
        </Box>
    );
};

export default NewsSection;
