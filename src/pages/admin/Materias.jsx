import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ nome: '', descricao: '' });

    useEffect(() => {
        loadMaterias();
    }, []);

    const loadMaterias = async () => {
        try {
            const response = await api.get('/materias');
            setMaterias(response.data);
        } catch (error) {
            console.error('Erro ao carregar matérias:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (materia = null) => {
        if (materia) {
            setEditingId(materia.id);
            setFormData({ nome: materia.nome, descricao: materia.descricao || '' });
        } else {
            setEditingId(null);
            setFormData({ nome: '', descricao: '' });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/materias/${editingId}`, formData);
            } else {
                await api.post('/materias', formData);
            }
            setOpen(false);
            loadMaterias();
        } catch (error) {
            console.error('Erro ao salvar matéria:', error);
            alert('Erro ao salvar matéria');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
            try {
                await api.delete(`/materias/${id}`);
                loadMaterias();
            } catch (error) {
                console.error('Erro ao excluir:', error);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gerenciar Matérias</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Nova Matéria
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materias.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>{m.id}</TableCell>
                                <TableCell>{m.nome}</TableCell>
                                <TableCell>{m.descricao}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(m)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(m.id)} size="small" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingId ? 'Editar Matéria' : 'Nova Matéria'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        fullWidth
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
