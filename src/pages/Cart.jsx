import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckoutDialog from '../components/CheckoutDialog';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('cart_items');
            const parsed = raw ? JSON.parse(raw) : [];
            setItems(Array.isArray(parsed) ? parsed : []);
        } catch {
            setItems([]);
        }
    }, []);

    const handleProceed = (item) => {
        if (!currentUser) {
            navigate('/login', { state: { returnUrl: '/cart' } });
            return;
        }
        setSelectedItem(item);
        setCheckoutOpen(true);
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Alert severity="info">Seu carrinho está vazio.</Alert>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => navigate('/')}>Voltar à Home</Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Seu Carrinho</Typography>
            <Box sx={{ mb: 3 }}>
                {items.map((it, idx) => (
                    <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', mb: 2 }}>
                        <Typography variant="h6">{it.nome || it.title || `Produto ${it.product_id}`}</Typography>
                        <Typography variant="body2" color="text.secondary">{it.descricao || ''}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" onClick={() => handleProceed(it)}>Finalizar compra</Button>
                        </Box>
                    </Box>
                ))}
            </Box>

            <CheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                plan={selectedItem?.product_type === 'plan' ? selectedItem : undefined}
                course={selectedItem?.product_type === 'course' ? selectedItem : undefined}
                onSuccess={() => {
                    setCheckoutOpen(false);
                    // limpar carrinho local ao finalizar
                    localStorage.removeItem('cart_items');
                    navigate('/dashboard');
                }}
            />
        </Container>
    );
}
