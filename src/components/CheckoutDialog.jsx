import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, Typography, Tabs, Tab, CircularProgress, Alert, Chip,
    Divider, IconButton, Tooltip, TextField
} from '@mui/material';
import { QrCode, ContentCopy, CheckCircle, Timer, Close } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';

export default function CheckoutDialog({ open, onClose, plan, onSuccess }) {
    const [tab, setTab] = useState(0); // 0 = PIX, 1 = Mercado Pago
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [timeLeft, setTimeLeft] = useState(360); // 6 minutos em segundos
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open && tab === 0 && !pixData) {
            generatePixPayment();
        }
    }, [open, tab]);

    // Timer de expiração
    useEffect(() => {
        if (!pixData || paymentStatus !== 'pending') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Verificar uma última vez se o pagamento foi concluído
                    checkPaymentStatus();
                    // Fechar diálogo após 2 segundos
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [pixData, paymentStatus]);

    // Função para verificar status do pagamento
    const checkPaymentStatus = async () => {
        if (!pixData?.paymentId) return;

        try {
            const response = await api.get(`/payments/${pixData.paymentId}/status`);
            if (response.data.status === 'aprovado' || response.data.status === 'aguardando_confirmacao') {
                setPaymentStatus('approved');
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    };

    // Polling para verificar pagamento
    useEffect(() => {
        if (!pixData || paymentStatus !== 'pending') return;

        const interval = setInterval(() => {
            checkPaymentStatus();
        }, 3000); // Verifica a cada 3 segundos

        return () => clearInterval(interval);
    }, [pixData, paymentStatus]);

    const generatePixPayment = async () => {
        setLoading(true);
        try {
            const response = await api.post('/payments/pix', {
                planId: plan.id
            });
            setPixData(response.data);
        } catch (error) {
            console.error('Erro ao gerar PIX:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMercadoPago = async () => {
        setLoading(true);
        try {
            const response = await api.post('/payments/preference', {
                planId: plan.id
            });
            // Redirecionar para checkout do Mercado Pago
            window.location.href = response.data.initPoint;
        } catch (error) {
            console.error('Erro ao criar preferência:', error);
            setLoading(false);
        }
    };

    const copyPixCode = () => {
        if (pixData?.pixCode) {
            navigator.clipboard.writeText(pixData.pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!plan) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Finalizar Assinatura</Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Informações do Plano */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary.dark">
                        Plano {plan.name}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                        R$ {parseFloat(plan.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {plan.duration_days} dias de acesso
                    </Typography>
                </Box>

                {/* Tabs de Pagamento */}
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab icon={<QrCode />} label="PIX" />
                    <Tab icon={<img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__large_plus.png" alt="MP" style={{ height: 20 }} />} label="Mercado Pago" />
                </Tabs>

                {/* Conteúdo PIX */}
                {tab === 0 && (
                    <Box>
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : paymentStatus === 'approved' ? (
                            <Alert severity="success" icon={<CheckCircle />}>
                                <Typography variant="h6">Pagamento Confirmado!</Typography>
                                <Typography variant="body2">
                                    Seu plano foi ativado com sucesso.
                                </Typography>
                            </Alert>
                        ) : timeLeft === 0 ? (
                            <Box sx={{
                                p: 3,
                                bgcolor: 'white',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'warning.main',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" color="warning.main" gutterBottom>
                                    ⏱️ Código PIX Expirado
                                </Typography>
                                <Typography variant="body2" color="text.primary" paragraph>
                                    O código PIX expirou. Se você já realizou o pagamento, aguarde a confirmação ou entre em contato com o suporte.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Caso contrário, feche esta janela e gere um novo código.
                                </Typography>
                            </Box>
                        ) : pixData ? (
                            <>
                                {/* Timer */}
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <Chip
                                        icon={<Timer />}
                                        label={`Expira em ${formatTime(timeLeft)}`}
                                        color={timeLeft < 120 ? 'error' : 'primary'}
                                        sx={{ fontSize: '1rem', py: 2 }}
                                    />
                                </Box>

                                {/* Código PIX Copia e Cola - DESTAQUE */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body1" fontWeight="bold" mb={1} textAlign="center">
                                        Código PIX Copia e Cola
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        p: 2,
                                        bgcolor: 'grey.100',
                                        borderRadius: 2,
                                        border: '2px dashed',
                                        borderColor: 'primary.main'
                                    }}>
                                        <TextField
                                            fullWidth
                                            value={pixData.pixCode}
                                            InputProps={{
                                                readOnly: true,
                                                sx: {
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.75rem',
                                                    bgcolor: 'white'
                                                }
                                            }}
                                            size="small"
                                            multiline
                                            rows={3}
                                        />
                                        <Tooltip title={copied ? 'Copiado!' : 'Copiar código'}>
                                            <IconButton
                                                onClick={copyPixCode}
                                                color="primary"
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.dark' },
                                                    height: 'fit-content'
                                                }}
                                            >
                                                {copied ? <CheckCircle /> : <ContentCopy />}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                                        Copie o código acima e cole no app do seu banco na opção PIX Copia e Cola
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }}>ou escaneie o QR Code</Divider>

                                {/* QR Code */}
                                {pixData.qrCode ? (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
                                                <QRCodeSVG value={pixData.pixCode} size={200} />
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" textAlign="center" color="text.secondary" mb={2}>
                                            Escaneie o QR Code com o app do seu banco
                                        </Typography>
                                    </>
                                ) : (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        QR Code não disponível. Use o código Copia e Cola acima.
                                    </Alert>
                                )}

                                <Alert severity="info">
                                    <Typography variant="body2" fontWeight="bold">
                                        Aguardando confirmação do pagamento...
                                    </Typography>
                                    <Typography variant="caption">
                                        Após realizar o pagamento, a confirmação será automática em alguns segundos.
                                    </Typography>
                                </Alert>
                            </>
                        ) : (
                            <Alert severity="error">
                                Erro ao gerar código PIX. Tente novamente ou entre em contato com o suporte.
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Conteúdo Mercado Pago */}
                {tab === 1 && (
                    <Box>
                        <Typography variant="body1" mb={2}>
                            Você será redirecionado para o checkout seguro do Mercado Pago.
                        </Typography>
                        <Alert severity="info">
                            Aceita cartão de crédito, débito e outros métodos de pagamento.
                        </Alert>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                {tab === 1 && (
                    <Button
                        variant="contained"
                        onClick={handleMercadoPago}
                        disabled={loading}
                        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {loading ? 'Processando...' : 'Ir para Mercado Pago'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
