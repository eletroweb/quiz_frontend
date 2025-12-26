import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Description, OndemandVideo, ShoppingCart, Info, Close, CheckCircle } from '@mui/icons-material';
import CheckoutDialog from './CheckoutDialog';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const CourseCard = ({ course }) => {
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const price = parseFloat(course.preco || 0);
    const promoPrice = parseFloat(course.promotional_price || 0);
    const finalPrice = promoPrice > 0 ? promoPrice : price;
    const hasDiscount = promoPrice > 0 && promoPrice < price;
    const discountPercent = hasDiscount ? Math.round(((price - promoPrice) / price) * 100) : 0;

    const imageUrl = course.imagem_url
        ? (course.imagem_url.startsWith('http') ? course.imagem_url : `${API_BASE_URL}${course.imagem_url}`)
        : null;

    const isOwned = !!course.owned;

    const handleBuyClick = () => {
        if (!currentUser) {
            // Salvar intenção de compra ou redirecionar
            navigate('/login', { state: { returnUrl: window.location.pathname } });
            return;
        }
        setDetailsOpen(false);
        setCheckoutOpen(true);
    };

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'visible', // Para badge
                    mt: 2, // Espaço para badge subir
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                }}
                elevation={0}
            >
                {/* Badge Flutuante */}
                {course.status_badge && (
                    <Chip
                        label={course.status_badge}
                        color="primary"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: -12,
                            left: 20,
                            zIndex: 2,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 24,
                            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)'
                        }}
                    />
                )}

                {/* Imagem (Menor e Contida) */}
                <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                        width: '100%',
                        height: 160,
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: '#F1F5F9'
                    }}>
                        {imageUrl ? (
                            <CardMedia
                                component="img"
                                image={imageUrl}
                                alt={course.nome}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover' // ou contain se preferir não cortar
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    color: 'white'
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" sx={{ px: 2, textAlign: 'center', fontSize: '1rem' }}>
                                    {course.nome}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>

                    {/* Título */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            mb: 1,
                            lineHeight: 1.3,
                            height: '2.6em',
                            overflow: 'hidden',
                            color: '#1E293B',
                            fontSize: '1rem'
                        }}
                    >
                        {course.nome}
                    </Typography>

                    {/* Stats Compactos */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, color: '#64748B', fontSize: '0.8rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Description sx={{ fontSize: 14 }} />
                            {course.total_modulos || 0} Matérias
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <OndemandVideo sx={{ fontSize: 14 }} />
                            {course.total_conteudos || 0} Aulas
                        </Box>
                    </Box>

                    {/* Divider Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Preço */}
                    <Box sx={{ mb: 2 }}>
                        {price > 0 ? (
                            <Box>
                                {hasDiscount && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'line-through', color: '#94A3B8' }}
                                        >
                                            R$ {price.toFixed(2).replace('.', ',')}
                                        </Typography>
                                        <Box sx={{
                                            bgcolor: '#DCFCE7',
                                            color: '#166534',
                                            fontSize: '0.65rem',
                                            fontWeight: 'bold',
                                            px: 0.5,
                                            borderRadius: 0.5
                                        }}>
                                            {discountPercent}% OFF
                                        </Box>
                                    </Box>
                                )}
                                <Box sx={{ display: 'grid' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            por
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
                                            R$ {finalPrice.toFixed(2).replace('.', ',')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        ou 12x de R$ {(finalPrice / 12).toFixed(2).replace('.', ',')}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#166534' }}>
                                Gratuito
                            </Typography>
                        )}
                    </Box>

                    {/* Botões de Ação */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setDetailsOpen(true)}
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                borderColor: '#E2E8F0',
                                color: '#64748B',
                                '&:hover': {
                                    borderColor: '#CBD5E1',
                                    bgcolor: '#F8FAFC'
                                }
                            }}
                        >
                            Saiba Mais
                        </Button>

                        {isOwned ? (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate(`/curso/${course.id}`)}
                                sx={{
                                    bgcolor: '#166534',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#15803d' }
                                }}
                            >
                                ACESSAR
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setCheckoutOpen(true)}
                                startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
                                sx={{
                                    bgcolor: '#2563EB',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
                                    '&:hover': {
                                        bgcolor: '#1D4ED8',
                                        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)'
                                    }
                                }}
                            >
                                COMPRAR
                            </Button>
                        )}
                    </Box>

                </CardContent>
            </Card>

            {/* Modal de Detalhes (Saiba Mais) */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                    <Typography variant="h6" fontWeight="bold">Detalhes do Curso</Typography>
                    <IconButton
                        onClick={() => setDetailsOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{
                            width: '100%',
                            height: 200,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 2,
                            position: 'relative',
                            bgcolor: '#f1f5f9'
                        }}>
                            {imageUrl ? (
                                <img src={imageUrl} alt={course.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#334155', color: 'white' }}>
                                    {course.nome}
                                </Box>
                            )}
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{course.nome}</Typography>
                        {course.status_badge && <Chip label={course.status_badge} color="primary" sx={{ mb: 2 }} />}
                    </Box>

                    <Typography variant="body1" paragraph color="text.secondary">
                        {course.descricao || 'Este curso oferece uma preparação completa com vídeo-aulas, materiais em PDF e questões comentadas.'}
                    </Typography>

                    <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>O que está incluído:</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography variant="body2">{course.total_modulos || 'Vários'} Módulos</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography variant="body2">{course.total_conteudos || 'Centenas de'} Aulas</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography variant="body2">Acesso Imediato</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography variant="body2">Certificado</Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDetailsOpen(false)} color="inherit">
                        Fechar
                    </Button>
                    {!isOwned && (
                        <Button
                            variant="contained"
                            onClick={handleBuyClick}
                            size="large"
                            startIcon={<ShoppingCart />}
                            sx={{
                                bgcolor: '#0fab33',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 4,
                                '&:hover': { bgcolor: '#0b8a28' }
                            }}
                        >
                            ADQUIRIR AGORA - R$ {finalPrice.toFixed(2).replace('.', ',')}
                        </Button>
                    )}
                    {isOwned && (
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/curso/${course.id}`)}
                            size="large"
                            color="success"
                        >
                            ACESSAR CURSO
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Modal de Pagamento */}
            <CheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                course={course}
                onSuccess={() => {
                    setCheckoutOpen(false);
                    alert('Compra realizada com sucesso!');
                    window.location.reload();
                }}
            />
        </>
    );
};

export default CourseCard;
