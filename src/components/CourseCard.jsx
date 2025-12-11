import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Description, OndemandVideo, ShoppingCart } from '@mui/icons-material';
import CheckoutDialog from './CheckoutDialog';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const CourseCard = ({ course }) => {
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const price = parseFloat(course.preco || 0);
    const promoPrice = parseFloat(course.promotional_price || 0);
    const finalPrice = promoPrice > 0 ? promoPrice : price;
    const hasDiscount = promoPrice > 0 && promoPrice < price;
    const discountPercent = hasDiscount ? Math.round(((price - promoPrice) / price) * 100) : 0;

    const imageUrl = course.imagem_url
        ? (course.imagem_url.startsWith('http') ? course.imagem_url : `${API_BASE_URL}${course.imagem_url}`)
        : null;

    const isOwned = !!course.owned;

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }
                }}
                elevation={0}
            >
                {/* Badge de Status */}
                {course.status_badge && (
                    <Chip
                        label={course.status_badge}
                        color="primary"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            zIndex: 2,
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            height: 24
                        }}
                    />
                )}

                {/* Imagem */}
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#f1f5f9', overflow: 'hidden' }}>
                    {imageUrl ? (
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={course.nome}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(45deg, #1e293b 30%, #334155 90%)',
                                color: 'white'
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" sx={{ px: 2, textAlign: 'center' }}>
                                {course.nome}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>

                    {/* Título */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            lineHeight: 1.3,
                            height: '2.6em', // Limite de 2 linhas
                            overflow: 'hidden',
                            color: '#1E293B',
                            fontSize: '1rem'
                        }}
                    >
                        {course.nome}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, color: '#64748B' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Description sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight="500">
                                {course.total_modulos || 12} Matérias
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <OndemandVideo sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight="500">
                                {course.total_conteudos || 850} Aulas
                            </Typography>
                        </Box>
                    </Box>

                    {/* Divider Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Preço */}
                    <Box sx={{ mb: 2 }}>
                        {price > 0 ? (
                            <>
                                {hasDiscount && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'line-through', color: '#94A3B8' }}
                                        >
                                            De R$ {price.toFixed(2).replace('.', ',')}
                                        </Typography>
                                        <Chip
                                            label={`${discountPercent}% OFF`}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                bgcolor: '#DCFCE7',
                                                color: '#166534',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        por
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
                                        R$ {finalPrice.toFixed(2).replace('.', ',')}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    ou 12x de R$ {(finalPrice / 12).toFixed(2).replace('.', ',')}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#166534' }}>
                                Gratuito
                            </Typography>
                        )}
                    </Box>

                    {/* Botão */}
                    {/* Botão */}
                    {isOwned ? (
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<OndemandVideo sx={{ fontSize: 18 }} />}
                            onClick={() => window.location.href = `/curso/${course.id}`} // Redirecionar para o curso
                            sx={{
                                bgcolor: '#166534', // Verde
                                fontWeight: 700,
                                textTransform: 'none',
                                py: 1.2,
                                borderRadius: 2,
                                fontSize: '0.9rem',
                                '&:hover': {
                                    bgcolor: '#15803d',
                                }
                            }}
                        >
                            ACESSAR
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
                            onClick={() => setCheckoutOpen(true)}
                            sx={{
                                bgcolor: '#2563EB', // Azul vibrante
                                fontWeight: 700,
                                textTransform: 'none',
                                py: 1.2,
                                borderRadius: 2,
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)',
                                '&:hover': {
                                    bgcolor: '#1D4ED8',
                                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                                }
                            }}
                        >
                            COMPRAR
                        </Button>
                    )}

                    <Button
                        size="small"
                        sx={{
                            mt: 1,
                            textTransform: 'none',
                            color: '#64748B',
                            fontSize: '0.75rem',
                            '&:hover': { bgcolor: 'transparent', color: '#1E293B' }
                        }}
                    >
                        Adicionar ao carrinho
                    </Button>

                </CardContent>
            </Card>

            {/* Modal de Pagamento */}
            <CheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                course={course}
                onSuccess={() => {
                    setCheckoutOpen(false);
                    // Aqui poderia redirecionar ou mostrar toast
                    alert('Compra realizada com sucesso!');
                }}
            />
        </>
    );
};

export default CourseCard;
