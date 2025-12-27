import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Dialog, DialogContent, Box, Typography, Button, Grid, Card, CardContent, Chip
} from '@mui/material';
import { Lock, Rocket, Star } from '@mui/icons-material';

export default function TrialExpiredDialog({ open, plans, onSelectPlan }) {
    const recommendedPlan = plans?.find(p => p.nome === 'Mensal') || plans?.[0];
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                }
            }}
        >
            <DialogContent sx={{ p: 4 }}>
                {/* Ícone e Mensagem Principal */}
                <Box
                    textAlign="center"
                    mb={4}
                    sx={{
                        bgcolor: 'white',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'warning.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}
                    >
                        <Lock sx={{ fontSize: 40, color: 'warning.dark' }} />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Seu Período de Teste Expirou
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={2}>
                        Continue aproveitando todos os recursos e conquiste seus objetivos!
                    </Typography>

                    <Chip
                        label="🎉 Promoção Especial para Você!"
                        color="success"
                        sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
                    />
                </Box>

                {/* Planos */}
                <Grid container spacing={2} mb={3}>
                    {plans?.slice(0, 3).map((plan) => {
                        const isRecommended = plan.id === recommendedPlan?.id;

                        return (
                            <Grid item xs={12} md={4} key={plan.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        position: 'relative',
                                        border: isRecommended ? '2px solid' : '1px solid',
                                        borderColor: isRecommended ? 'primary.main' : 'divider',
                                        transform: isRecommended ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    {isRecommended && (
                                        <Chip
                                            label="MAIS POPULAR"
                                            color="primary"
                                            size="small"
                                            icon={<Star />}
                                            sx={{
                                                position: 'absolute',
                                                top: -12,
                                                left: '50%',
                                                transform: 'translateX(-50%)'
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {plan.name}
                                        </Typography>

                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            R$ {(parseFloat(plan.price) || 0).toFixed(2)}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            {plan.duration_days} dias
                                        </Typography>

                                        <Button
                                            variant={isRecommended ? 'contained' : 'outlined'}
                                            fullWidth
                                            onClick={() => {
                                                if (currentUser) {
                                                    onSelectPlan(plan);
                                                } else {
                                                    try {
                                                        const raw = localStorage.getItem('cart_items');
                                                        const arr = raw ? JSON.parse(raw) : [];
                                                        const item = {
                                                            product_type: 'plan',
                                                            product_id: plan.id,
                                                            nome: plan.name || plan.nome || plan.title,
                                                            descricao: plan.description || plan.descricao || '',
                                                            preco: plan.price || plan.preco || 0,
                                                            duration_days: plan.duration_days,
                                                            id: plan.id
                                                        };
                                                        const exists = arr.find(it => String(it.product_id) === String(item.product_id) && it.product_type === 'plan');
                                                        if (!exists) arr.push(item);
                                                        localStorage.setItem('cart_items', JSON.stringify(arr));
                                                    } catch (e) {
                                                        console.error('Erro salvando plano no carrinho local:', e);
                                                    }
                                                    navigate('/login', { state: { returnUrl: '/cart' } });
                                                }
                                            }}
                                            sx={{
                                                mt: 2,
                                                ...(isRecommended && {
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                })
                                            }}
                                        >
                                            Assinar Agora
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Benefícios */}
                <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                        ✨ O que você ganha ao assinar:
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Rocket color="primary" />
                                <Typography variant="body2">
                                    Acesso ilimitado a todas as questões
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Rocket color="primary" />
                                <Typography variant="body2">
                                    Simulados personalizados
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Rocket color="primary" />
                                <Typography variant="body2">
                                    Estatísticas detalhadas
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Rocket color="primary" />
                                <Typography variant="body2">
                                    Conteúdos de estudo exclusivos
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Garantia */}
                <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
                    🔒 Pagamento 100% seguro • 💯 Garantia de 7 dias
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
