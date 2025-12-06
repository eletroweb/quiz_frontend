import React, { useState, useEffect } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Typography, Alert,
    FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { Add, Edit, Delete, PlayCircle, PictureAsPdf, Article } from '@mui/icons-material';
import api from '../../services/api';

export default function Conteudos() {
    const [conteudos, setConteudos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        tipo: 'video',
        materia_id: '',
        youtube_url: '',
        file_url: '',
        conteudo: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [contRes, matRes] = await Promise.all([
                api.get('/conteudos'),
                api.get('/materias')
            ]);
            setConteudos(contRes.data);
            setMaterias(matRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar dados');
        }
    };

    const handleOpenDialog = (conteudo = null) => {
        if (conteudo) {
            setEditingId(conteudo.id);
            setFormData({
                titulo: conteudo.titulo,
                tipo: conteudo.tipo,
                materia_id: conteudo.materia_id,
                youtube_url: conteudo.youtube_url || '',
                file_url: conteudo.file_url || '',
                conteudo: conteudo.conteudo || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                titulo: '',
                tipo: 'video',
                materia_id: '',
                youtube_url: '',
                file_url: '',
                conteudo: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
        setFormData({
            titulo: '',
            tipo: 'video',
            materia_id: '',
            youtube_url: '',
            file_url: '',
            conteudo: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/conteudos/${editingId}`, formData);
                setSuccess('Conteúdo atualizado com sucesso!');
            } else {
                await api.post('/conteudos', formData);
                setSuccess('Conteúdo criado com sucesso!');
            }
            handleCloseDialog();
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            setError('Erro ao salvar conteúdo');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este conteúdo?')) return;

        try {
            await api.delete(`/conteudos/${id}`);
            setSuccess('Conteúdo excluído com sucesso!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Erro ao excluir conteúdo:', error);
            setError('Erro ao excluir conteúdo');
        }
    };

    const getIcon = (tipo) => {
        if (tipo === 'video') return <PlayCircle color="primary" />;
        if (tipo === 'pdf') return <PictureAsPdf color="error" />;
        return <Article color="action" />;
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Gerenciar Conteúdos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Novo Conteúdo
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
                            <TableCell><strong>Tipo</strong></TableCell>
                            <TableCell><strong>Título</strong></TableCell>
                            <TableCell><strong>Matéria</strong></TableCell>
                            <TableCell align="right"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {conteudos.map((conteudo) => (
                            <TableRow key={conteudo.id} hover>
                                <TableCell>{conteudo.id}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getIcon(conteudo.tipo)}
                                        <Chip
                                            label={conteudo.tipo.toUpperCase()}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>{conteudo.titulo}</TableCell>
                                <TableCell>{conteudo.materia_nome}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(conteudo)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(conteudo.id)}
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
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingId ? 'Editar Conteúdo' : 'Novo Conteúdo'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Título"
                            fullWidth
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={formData.tipo}
                                label="Tipo"
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            >
                                <MenuItem value="video">Vídeo (YouTube)</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="texto">Texto</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Matéria</InputLabel>
                            <Select
                                value={formData.materia_id}
                                label="Matéria"
                                onChange={(e) => setFormData({ ...formData, materia_id: e.target.value })}
                                required
                            >
                                {materias.map(m => (
                                    <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {formData.tipo === 'video' && (
                            <TextField
                                label="URL do YouTube"
                                fullWidth
                                value={formData.youtube_url}
                                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=..."
                                helperText="Cole a URL completa do vídeo do YouTube"
                            />
                        )}

                        {formData.tipo === 'pdf' && (
                            <TextField
                                label="URL do PDF"
                                fullWidth
                                value={formData.file_url}
                                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                                placeholder="https://..."
                                helperText="Cole a URL do arquivo PDF"
                            />
                        )}

                        {formData.tipo === 'texto' && (
                            <TextField
                                label="Conteúdo"
                                fullWidth
                                multiline
                                rows={8}
                                value={formData.conteudo}
                                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                                helperText="Você pode usar HTML básico"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.titulo || !formData.materia_id}
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
