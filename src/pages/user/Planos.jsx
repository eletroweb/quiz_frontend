import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, List,
    ListItem, ListItemIcon, ListItemText, Chip, Paper, CircularProgress, Alert
} from '@mui/material';
import { Check, Close, Star, Bolt, Rocket } from '@mui/icons-material';
import api from '../../services/api';
import CheckoutDialog from '../../components/CheckoutDialog';

export default function Planos() {
    const [plans, setPlans] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openCheckout, setOpenCheckout] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansRes, campaignsRes] = await Promise.all([
                api.get('/plans'),
                api.get('/campaigns/active')
            ]);
            setPlans(plansRes.data.filter(p => p.active));
            setCampaigns(campaignsRes.data || []);
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
            setError('Não foi possível carregar os planos.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribeClick = (plan) => {
        setSelectedPlan(plan);
        setOpenCheckout(true);
    };

    const handleCheckoutSuccess = () => {
        // Recarregar dados do usuário
        window.location.reload();
    };

    const getDiscountedPrice = (price) => {
        const activeCampaign = campaigns.find(c => c.active);
        if (activeCampaign) {
            const discount = parseFloat(activeCampaign.discount_percentage) / 100;
            return (parseFloat(price) * (1 - discount)).toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    const getActiveCampaign = () => {
        return campaigns.find(c => c.active);
    };

    const getPlanIcon = (name) => {
        if (name.toLowerCase().includes('mensal')) return <Bolt sx={{ fontSize: 40 }} />;
        if (name.toLowerCase().includes('anual')) return <Rocket sx={{ fontSize: 40 }} />;
        return <Star sx={{ fontSize: 40 }} />;
    };

    const getPlanColor = (name) => {
        if (name.toLowerCase().includes('mensal')) return '#6366f1';
        if (name.toLowerCase().includes('anual')) return '#ec4899';
        return '#64748b';
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

    return (
        <Box>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Escolha seu Plano
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Invista no seu futuro e alcance a aprovação
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {plans.map((plan) => {
                    const color = getPlanColor(plan.name);
                    const icon = getPlanIcon(plan.name);
                    const isPopular = plan.name.toLowerCase().includes('mensal');
                    const activeCampaign = getActiveCampaign();
                    const originalPrice = parseFloat(plan.price).toFixed(2);
                    const finalPrice = getDiscountedPrice(plan.price);
                    const hasDiscount = activeCampaign && originalPrice !== finalPrice;

                    return (
                        <Grid item xs={12} md={4} key={plan.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    height: '100%',
                                    position: 'relative',
                                    border: isPopular ? '2px solid' : 'none',
                                    borderColor: color,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                {isPopular && (
                                    <Chip
                                        label="MAIS POPULAR"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            bgcolor: color,
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                )}
                                {hasDiscount && (
                                    <Chip
                                        label={`${activeCampaign.discount_percentage}% OFF`}
                                        size="small"
                                        color="success"
                                        sx={{
                                            position: 'absolute',
                                            top: isPopular ? 48 : 16,
                                            right: 16,
                                            fontWeight: 'bold',
                                        }}
                                    />
                                )}

                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: `${color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            color: color,
                                        }}
                                    >
                                        {icon}
                                    </Box>

                                    <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                                        {plan.name}
                                    </Typography>

                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1 }}>
                                            {hasDiscount && (
                                                <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                                                    R$ {originalPrice}
                                                </Typography>
                                            )}
                                            <Typography variant="h3" fontWeight="bold" color={color}>
                                                R$ {finalPrice}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary">
                                            {plan.duration_days} dias de acesso
                                        </Typography>
                                    </Box>

                                    <List>
                                        {plan.features && plan.features.map((feature, idx) => (
                                            <ListItem key={idx} sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    {feature.included !== false ? (
                                                        <Check color="success" />
                                                    ) : (
                                                        <Close color="disabled" />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature.text || feature}
                                                    primaryTypographyProps={{
                                                        color: feature.included !== false ? 'text.primary' : 'text.disabled',
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => handleSubscribeClick(plan)}
                                        sx={{
                                            mt: 2,
                                            py: 1.5,
                                            bgcolor: color,
                                            '&:hover': { bgcolor: color },
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

            {/* Checkout Dialog */}
            <CheckoutDialog
                open={openCheckout}
                onClose={() => setOpenCheckout(false)}
                plan={selectedPlan}
                onSuccess={handleCheckoutSuccess}
            />

            {/* Garantia */}
            <Paper
                sx={{
                    p: 3,
                    mt: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🛡️ Acesso liberado por 1 semana para testar.
                </Typography>
                <Typography variant="body2">
                    Experimente a metodologia que vai acelerar sua jornada até a aprovação.
                </Typography>
            </Paper>
        </Box>
    );
}
