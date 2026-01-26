import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarToday, Person } from '@mui/icons-material';
import api from '../services/api';
import CheckoutDialog from './CheckoutDialog';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    const { currentUser } = useAuth();
    const navigate = useNavigate();

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
        <Box sx={{
            py: 10,
            bgcolor: '#F8FAFC',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorativo */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                opacity: 0.4,
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: '800px' }}>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                mb: 2,
                                display: 'inline-block',
                                px: 2,
                                py: 0.5,
                                borderRadius: '9999px',
                                background: 'rgba(37, 99, 235, 0.1)'
                            }}
                        >
                            Fique por dentro
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'var(--font-display)',
                                fontSize: { xs: 'var(--text-4xl)', md: 'var(--text-5xl)' },
                                fontWeight: 800,
                                color: '#0F172A', // Slate 900
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                mb: 2
                            }}
                        >
                            Últimas Notícias
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'var(--text-lg)',
                                color: 'var(--color-text-secondary)',
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            Atualizações, dicas de estudo e novidades sobre concursos em primeira mão.
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* Define articles */}
                    {(() => {
                        const allNews = featured ? [featured, ...news] : news;
                        if (allNews.length === 0) return null;

                        const mainArticle = allNews[0];
                        const sidebarArticles = allNews.slice(1, 4); // Display next 3 items

                        return (
                            <>
                                {/* Main Hero Article (Esquerda) */}
                                <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex' }}>
                                    <Card
                                        elevation={0}
                                        onClick={() => handleOpenNews(mainArticle)}
                                        sx={{
                                            width: '100%',
                                            position: 'relative',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: { xs: '400px', md: '500px' },
                                            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                                '& .hero-image': { transform: 'scale(1.05)' },
                                                '& .hero-overlay': { opacity: 0.9 }
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            className="hero-image"
                                            image={mainArticle.imagem_url?.startsWith('http') ? mainArticle.imagem_url : `${API_BASE_URL}${mainArticle.imagem_url}`}
                                            alt={mainArticle.titulo}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.6s ease',
                                                zIndex: 0
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <Box className="hero-overlay" sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)',
                                            transition: 'opacity 0.3s ease',
                                            zIndex: 1
                                        }} />

                                        {/* Categories */}
                                        <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 2, display: 'flex', gap: 1 }}>
                                            <Box sx={{
                                                bgcolor: 'var(--color-primary)',
                                                color: '#fff',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                            }}>
                                                DESTAQUE
                                            </Box>
                                            {mainArticle.categoria && (
                                                <Box sx={{
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(8px)',
                                                    color: '#fff',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    border: '1px solid rgba(255,255,255,0.3)'
                                                }}>
                                                    {mainArticle.categoria}
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ mt: 'auto', p: { xs: 3, md: 5 }, position: 'relative', zIndex: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, color: '#94A3B8' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarToday sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2" fontWeight={500}>{formatDate(mainArticle.data_publicacao)}</Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="h3" sx={{
                                                color: 'white',
                                                fontSize: { xs: '1.5rem', md: '2.25rem' },
                                                fontWeight: 800,
                                                lineHeight: 1.2,
                                                mb: 2,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                            }}>
                                                {mainArticle.titulo}
                                            </Typography>

                                            <Typography sx={{
                                                color: '#CBD5E1',
                                                fontSize: '1.1rem',
                                                lineHeight: 1.6,
                                                maxWidth: '90%',
                                                mb: 3,
                                                display: { xs: 'none', sm: '-webkit-box' },
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {mainArticle.conteudo}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    borderRadius: '50px',
                                                    px: 4,
                                                    py: 1,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700,
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Ler Agora
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* Sidebar List (Direita) */}
                                <Grid item xs={12} md={5} lg={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                                        {sidebarArticles.map((item) => (
                                            <Card
                                                key={item.id}
                                                elevation={0}
                                                onClick={() => handleOpenNews(item)}
                                                sx={{
                                                    display: 'flex',
                                                    background: '#fff',
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: '1px solid #E2E8F0',
                                                    transition: 'all 0.3s ease',
                                                    minHeight: '130px',
                                                    '&:hover': {
                                                        transform: 'translateX(8px)',
                                                        borderColor: 'var(--color-primary)',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                                    }
                                                }}
                                            >
                                                <Box sx={{ width: '130px', flexShrink: 0, position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={item.imagem_url?.startsWith('http') ? item.imagem_url : `${API_BASE_URL}${item.imagem_url}`}
                                                        alt={item.titulo}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Box>
                                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                    <Box sx={{ mb: 1 }}>
                                                        <Typography variant="caption" sx={{
                                                            color: 'var(--color-primary)',
                                                            fontWeight: 700,
                                                            letterSpacing: '0.05em',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {item.categoria || 'NOTÍCIA'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="subtitle1" sx={{
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        lineHeight: 1.3,
                                                        color: '#1E293B',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        mb: 1
                                                    }}>
                                                        {item.titulo}
                                                    </Typography>
                                                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1, color: '#94A3B8', fontSize: '0.75rem' }}>
                                                        <CalendarToday sx={{ fontSize: 12 }} />
                                                        {formatDate(item.data_publicacao)}
                                                    </Box>
                                                </Box>
                                            </Card>
                                        ))}

                                        {/* View All Button */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                mt: 'auto',
                                                py: 1.5,
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                borderRadius: 3,
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    borderColor: 'var(--color-primary)',
                                                    color: 'var(--color-primary)',
                                                    bgcolor: 'transparent'
                                                }
                                            }}
                                        >
                                            Ver todas as notícias
                                        </Button>
                                    </Box>
                                </Grid>
                            </>
                        );
                    })()}
                </Grid>

                {/* Dialog de Leitura */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseNews}
                    maxWidth="md"
                    fullWidth
                    scroll="paper"
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            overflow: 'hidden'
                        }
                    }}
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
                                    <Button variant="contained" color="primary" onClick={() => {
                                        // If user is logged, open checkout; otherwise save to local cart and send to login
                                        if (currentUser) {
                                            setCheckoutOpen(true);
                                        } else {
                                            try {
                                                const raw = localStorage.getItem('cart_items');
                                                const arr = raw ? JSON.parse(raw) : [];
                                                // store minimal course info so CheckoutDialog can use it
                                                const item = {
                                                    product_type: 'course',
                                                    product_id: relatedCourse.id,
                                                    nome: relatedCourse.nome,
                                                    descricao: relatedCourse.descricao,
                                                    promocional: relatedCourse.promotional_price,
                                                    preco: relatedCourse.preco,
                                                    imagem_url: relatedCourse.imagem_url,
                                                    id: relatedCourse.id
                                                };
                                                // avoid duplicates
                                                const exists = arr.find(it => String(it.product_id) === String(item.product_id));
                                                if (!exists) arr.push(item);
                                                localStorage.setItem('cart_items', JSON.stringify(arr));
                                            } catch (e) {
                                                console.error('Erro salvando carrinho local:', e);
                                            }
                                            // redirect to login and then to /cart
                                            navigate('/login', { state: { returnUrl: '/cart' } });
                                        }
                                    }}>
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
