import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Switch, FormControlLabel, Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_days: 30,
        features: [],
        active: true
    });
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        loadPlans();
    }, []);

    async function loadPlans() {
        try {
            const response = await api.get('/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
        }
    }

    function handleOpen(plan = null) {
        if (plan) {
            setCurrentPlan(plan);
            setFormData({
                name: plan.name,
                description: plan.description || '',
                price: plan.price,
                duration_days: plan.duration_days,
                features: plan.features || [],
                active: plan.active
            });
        } else {
            setCurrentPlan(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                duration_days: 30,
                features: [],
                active: true
            });
        }
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setCurrentPlan(null);
    }

    async function handleSave() {
        try {
            if (currentPlan) {
                await api.put(`/plans/${currentPlan.id}`, formData);
            } else {
                await api.post('/plans', formData);
            }
            loadPlans();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar plano:', error);
            alert('Erro ao salvar plano');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Tem certeza que deseja remover este plano?')) {
            try {
                await api.delete(`/plans/${id}`);
                loadPlans();
            } catch (error) {
                console.error('Erro ao remover plano:', error);
            }
        }
    }

    function addFeature() {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    }

    function removeFeature(index) {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestão de Planos</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Novo Plano
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Duração (dias)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>R$ {Number(plan.price).toFixed(2)}</TableCell>
                                <TableCell>{plan.duration_days}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={plan.active ? 'Ativo' : 'Inativo'}
                                        color={plan.active ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(plan)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(plan.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nome do Plano"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Descrição"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Preço (R$)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Duração (dias)"
                                type="number"
                                value={formData.duration_days}
                                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                fullWidth
                            />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                    label="Adicionar Benefício"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                                <Button variant="outlined" onClick={addFeature}>Adicionar</Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {formData.features.map((feature, index) => (
                                    <Chip
                                        key={index}
                                        label={feature}
                                        onDelete={() => removeFeature(index)}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                            }
                            label="Plano Ativo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
