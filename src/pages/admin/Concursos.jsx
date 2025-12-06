import React, { useState, useEffect } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Typography, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';

export default function Concursos() {
    const [concursos, setConcursos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        ano: new Date().getFullYear()
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadConcursos();
    }, []);

    const loadConcursos = async () => {
        try {
            const response = await api.get('/concursos');
            setConcursos(response.data);
        } catch (error) {
            console.error('Erro ao carregar concursos:', error);
            setError('Erro ao carregar concursos');
        }
    };

    const handleOpenDialog = (concurso = null) => {
        if (concurso) {
            setEditingId(concurso.id);
            setFormData({
                nome: concurso.nome,
                descricao: concurso.descricao || '',
                ano: concurso.ano || new Date().getFullYear()
            });
        } else {
            setEditingId(null);
            setFormData({
                nome: '',
                descricao: '',
                ano: new Date().getFullYear()
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
        setFormData({ nome: '', descricao: '', ano: new Date().getFullYear() });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/concursos/${editingId}`, formData);
                setSuccess('Concurso atualizado com sucesso!');
            } else {
                await api.post('/concursos', formData);
                setSuccess('Concurso criado com sucesso!');
            }
            handleCloseDialog();
            loadConcursos();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao salvar concurso:', error);
            setError('Erro ao salvar concurso');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este concurso?')) return;

        try {
            await api.delete(`/concursos/${id}`);
            setSuccess('Concurso excluído com sucesso!');
            loadConcursos();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao excluir concurso:', error);
            setError('Erro ao excluir concurso');
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Gerenciar Concursos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Novo Concurso
                </Button>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Descrição</strong></TableCell>
                            <TableCell><strong>Ano</strong></TableCell>
                            <TableCell align="right"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {concursos.map((concurso) => (
                            <TableRow key={concurso.id} hover>
                                <TableCell>{concurso.id}</TableCell>
                                <TableCell>{concurso.nome}</TableCell>
                                <TableCell>{concurso.descricao}</TableCell>
                                <TableCell>{concurso.ano}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(concurso)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(concurso.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog para criar/editar */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingId ? 'Editar Concurso' : 'Novo Concurso'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nome do Concurso"
                            fullWidth
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                        />
                        <TextField
                            label="Descrição"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        />
                        <TextField
                            label="Ano"
                            type="number"
                            fullWidth
                            value={formData.ano}
                            onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.nome}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
