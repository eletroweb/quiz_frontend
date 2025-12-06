import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, TextField, Alert, Divider, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import { Save, CheckCircle } from '@mui/icons-material';
import api from '../../services/api';

export default function Payments() {
    const [config, setConfig] = useState({
        mp_access_token: '',
        mp_public_key: '',
        pix_key: '',
        pix_recipient_name: '',
        pix_recipient_document: ''
    });
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadConfig();
        loadPendingPayments();
    }, []);

    async function loadConfig() {
        try {
            const response = await api.get('/payments/config');
            setConfig({
                ...config,
                ...response.data
            });
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    }

    async function loadPendingPayments() {
        try {
            const response = await api.get('/payments?status=aguardando_confirmacao');
            setPendingPayments(response.data);
        } catch (error) {
            console.error('Erro ao carregar pagamentos pendentes:', error);
        }
    }

    async function handleSave() {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            await api.post('/payments/config', config);

            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
        } finally {
            setLoading(false);
        }
    }

    async function handleApprovePayment(paymentId) {
        try {
            await api.put(`/payments/${paymentId}/mark-paid`);
            setMessage({ type: 'success', text: 'Pagamento aprovado com sucesso!' });
            loadPendingPayments();
        } catch (error) {
            console.error('Erro ao aprovar pagamento:', error);
            setMessage({ type: 'error', text: 'Erro ao aprovar pagamento' });
        }
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Configuração de Pagamentos</Typography>

            {/* Pagamentos Pendentes */}
            {pendingPayments.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Pagamentos Aguardando Confirmação</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>Plano</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{payment.user_name || payment.user_email}</TableCell>
                                        <TableCell>{payment.plan_name}</TableCell>
                                        <TableCell>R$ {parseFloat(payment.valor).toFixed(2)}</TableCell>
                                        <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip label="Aguardando" color="warning" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="success"
                                                onClick={() => handleApprovePayment(payment.id)}
                                                title="Aprovar Pagamento"
                                            >
                                                <CheckCircle />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Configurações */}
            <Paper sx={{ p: 4, maxWidth: 600 }}>
                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 3 }}>
                        {message.text}
                    </Alert>
                )}

                <Typography variant="h6" gutterBottom>Mercado Pago</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Configure as credenciais do Mercado Pago para processar pagamentos via cartão e PIX automático.
                </Typography>

                <TextField
                    label="Access Token (Produção)"
                    value={config.mp_access_token}
                    onChange={(e) => setConfig({ ...config, mp_access_token: e.target.value })}
                    fullWidth
                    type="password"
                    sx={{ mb: 2 }}
                    helperText="Disponível no painel de desenvolvedor do Mercado Pago"
                />

                <TextField
                    label="Public Key (Produção)"
                    value={config.mp_public_key}
                    onChange={(e) => setConfig({ ...config, mp_public_key: e.target.value })}
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Chave PIX Manual</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Configure os dados para recebimento via PIX manual.
                </Typography>

                <TextField
                    label="Nome do Recebedor"
                    value={config.pix_recipient_name}
                    onChange={(e) => setConfig({ ...config, pix_recipient_name: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                    placeholder="Nome completo ou razão social"
                />

                <TextField
                    label="CPF ou CNPJ"
                    value={config.pix_recipient_document}
                    onChange={(e) => setConfig({ ...config, pix_recipient_document: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />

                <TextField
                    label="Chave PIX"
                    value={config.pix_key}
                    onChange={(e) => setConfig({ ...config, pix_key: e.target.value })}
                    fullWidth
                    sx={{ mb: 3 }}
                    placeholder="E-mail, CPF/CNPJ ou Chave Aleatória"
                />

                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    fullWidth
                    size="large"
                >
                    {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
            </Paper>
        </Box>
    );
}
