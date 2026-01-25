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
        <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                mb: 2,
                            }}
                        >
                            Fique por dentro
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'var(--font-display)',
                                fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-4xl)' },
                                fontWeight: 700,
                                color: '#1e293b',
                            }}
                        >
                            Últimas Notícias
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {/* Juntar destaque e outras notícias em uma única lista */}
                    {(featured ? [featured, ...news] : news).map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    maxWidth: '382px',
                                    height: '282px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#1F2937',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                                    }
                                }}
                            >
                                {/* Imagem com altura fixa menor */}
                                <Box sx={{ position: 'relative', height: '140px', flexShrink: 0 }}>
                                    {item.imagem_url ? (
                                        <CardMedia
                                            component="img"
                                            image={item.imagem_url.startsWith('http') ? item.imagem_url : `${API_BASE_URL}${item.imagem_url}`}
                                            alt={item.titulo}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: '#374151',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography sx={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Sem imagem</Typography>
                                        </Box>
                                    )}
                                </Box>

                                <CardContent sx={{
                                    flexGrow: 1,
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="700"
                                        sx={{
                                            color: '#F9FAFB',
                                            lineHeight: 1.3,
                                            fontSize: '1rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {item.titulo}
                                    </Typography>

                                    <Button
                                        onClick={() => handleOpenNews(item)}
                                        sx={{
                                            alignSelf: 'flex-start',
                                            color: '#3B82F6',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            padding: 0,
                                            mt: 0.5,
                                            minWidth: 'auto',
                                            '&:hover': {
                                                background: 'transparent',
                                                color: '#60A5FA',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                        endIcon={<span style={{ fontSize: '1.1em' }}>→</span>}
                                    >
                                        SAIBA MAIS
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
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
