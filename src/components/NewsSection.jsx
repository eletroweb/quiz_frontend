import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarToday, Person } from '@mui/icons-material';
import api from '../services/api';
import CheckoutDialog from './CheckoutDialog';
//fazendo teste
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [relatedCourse, setRelatedCourse] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const listResponse = await api.get('/news?limit=12');
            const data = Array.isArray(listResponse.data) ? listResponse.data : [];
            const feat = data.find(n => !!n.destaque) || null;
            setFeatured(feat);
            setNews(data.filter(n => n.id !== (feat?.id)));

            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            setLoading(false);
        }
    };

    const handleOpenNews = async (item) => {
        setSelectedNews(item);
        setOpenDialog(true);
        setRelatedCourse(null);
        try {
            const cursoId = item?.curso_id;
            if (cursoId) {
                const resp = await api.get('/cursos');
                const list = Array.isArray(resp.data) ? resp.data : [];
                const course = list.find(c => String(c.id) === String(cursoId));
                if (course) setRelatedCourse(course);
            }
        } catch {
            console.error('Erro ao carregar curso vinculado à notícia');
        }
    };

    const handleCloseNews = () => {
        setOpenDialog(false);
        setSelectedNews(null);
        setRelatedCourse(null);
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

                    {/* Notícias Recentes em Álbum */}
                    <Grid item xs={12} md={7}>
                        {featured && <Box sx={{ borderTop: { xs: '1px solid #e5e7eb', md: 'none' }, mb: 3 }} />}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', borderBottom: '1px solid #000', pb: 1, mb: 3 }}>
                            Recentes
                        </Typography>
                        <Grid container spacing={3}>
                            {news.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {item.imagem_url ? (
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={item.imagem_url.startsWith('http') ? item.imagem_url : `${API_BASE_URL}${item.imagem_url}`}
                                                alt={item.titulo}
                                            />
                                        ) : (
                                            <Box sx={{ height: 140, bgcolor: '#E2E8F0' }} />
                                        )}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 1 }}>
                                                {item.titulo}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {item.resumo}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', fontSize: '0.75rem', gap: 2, mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarToday sx={{ fontSize: 12 }} />
                                                    {formatDate(item.data_publicacao)}
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                                            <Button variant="outlined" fullWidth onClick={() => handleOpenNews(item)}>
                                                Mais detalhes
                                            </Button>
                                        </Box>
                                    </Card>
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
                                {relatedCourse && (
                                    <Button variant="contained" color="primary" onClick={() => setCheckoutOpen(true)}>
                                        Adquirir curso agora
                                    </Button>
                                )}
                                <Button onClick={handleCloseNews} variant="contained" color="primary">
                                    Fechar
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                <CheckoutDialog
                    open={checkoutOpen}
                    onClose={() => setCheckoutOpen(false)}
                    course={relatedCourse}
                    onSuccess={() => {
                        setCheckoutOpen(false);
                        window.location.reload();
                    }}
                />
            </Container>
        </Box>
    );
};

export default NewsSection;
