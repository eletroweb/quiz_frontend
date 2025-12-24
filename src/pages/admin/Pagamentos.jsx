import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, TextField, MenuItem, Grid,
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Card, CardContent
} from '@mui/material';
import {
    CheckCircle, Cancel, Pending, Visibility, Edit, AttachMoney,
    TrendingUp, People, CalendarToday
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';

export default function Pagamentos() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        startDate: '',
        endDate: '',
        planId: ''
    });
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        revenue: 0
    });

    useEffect(() => {
    fetchPayments();
    fetchStats();
}, [fetchPayments]);

    const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
        const params = new URLSearchParams();
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.planId) params.append('planId', filters.planId);

        const response = await api.get(`/payments?${params.toString()}`);
        setPayments(response.data);
    } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
    } finally {
        setLoading(false);
    }
}, [filters]);


    const fetchStats = async () => {
        try {
            const response = await api.get('/payments/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        }
    };

    const handleMarkAsPaid = async (paymentId) => {
        if (!confirm('Tem certeza que deseja marcar este pagamento como pago?')) return;

        try {
            await api.put(`/payments/${paymentId}/mark-paid`);
            fetchPayments();
            fetchStats();
            setOpenDetails(false);
            alert('Pagamento marcado como pago com sucesso!');
        } catch (error) {
            console.error('Erro ao marcar pagamento:', error);
            alert('Erro ao marcar pagamento como pago.');
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            approved: { label: 'Pago', color: 'success', icon: <CheckCircle /> },
            pending: { label: 'Pendente', color: 'warning', icon: <Pending /> },
            rejected: { label: 'Rejeitado', color: 'error', icon: <Cancel /> }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                icon={config.icon}
            />
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Gestão de Pagamentos
            </Typography>

            {/* Estatísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {formatCurrency(stats.revenue)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Receita Total
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <CheckCircle color="success" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.approved}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Pagamentos Aprovados
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Pending color="warning" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Pendentes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <TrendingUp color="info" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.total}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Total de Transações
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtros */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="approved">Pago</MenuItem>
                            <MenuItem value="pending">Pendente</MenuItem>
                            <MenuItem value="rejected">Rejeitado</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Data Início"
                            InputLabelProps={{ shrink: true }}
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Data Fim"
                            InputLabelProps={{ shrink: true }}
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setFilters({ status: 'all', startDate: '', endDate: '', planId: '' })}
                            sx={{ height: '56px' }}
                        >
                            Limpar Filtros
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabela de Pagamentos */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Plano</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Método</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Nenhum pagamento encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id} hover>
                                    <TableCell>#{payment.id}</TableCell>
                                    <TableCell>{payment.user_name || payment.user_email}</TableCell>
                                    <TableCell>{payment.plan_name}</TableCell>
                                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell>
                                        <Chip label={payment.payment_method?.toUpperCase() || 'N/A'} size="small" />
                                    </TableCell>
                                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                                    <TableCell>
                                        {payment.created_at ? format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver Detalhes">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedPayment(payment);
                                                    setOpenDetails(true);
                                                }}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                        {payment.status === 'pending' && (
                                            <Tooltip title="Marcar como Pago">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleMarkAsPaid(payment.id)}
                                                >
                                                    <CheckCircle />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog de Detalhes */}
            <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Detalhes do Pagamento #{selectedPayment?.id}</DialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Usuário
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedPayment.user_name || selectedPayment.user_email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Plano
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedPayment.plan_name}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {formatCurrency(selectedPayment.amount)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Método
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedPayment.payment_method?.toUpperCase() || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        {getStatusChip(selectedPayment.status)}
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Data
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedPayment.created_at ? format(new Date(selectedPayment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-'}
                                    </Typography>
                                </Grid>

                                {selectedPayment.transaction_id && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            ID da Transação
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {selectedPayment.transaction_id}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            {selectedPayment.status === 'pending' && (
                                <Alert severity="info" sx={{ mt: 3 }}>
                                    Este pagamento está pendente. Você pode marcá-lo como pago manualmente após verificar o comprovante.
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetails(false)}>Fechar</Button>
                    {selectedPayment?.status === 'pending' && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleMarkAsPaid(selectedPayment.id)}
                        >
                            Marcar como Pago
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
