import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Card, CardContent, CardActions,
    Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Alert, Chip, CircularProgress, CardMedia, LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Visibility as VisibilityIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import api from '../../services/api';

export default function CursosAdmin() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCurso, setEditingCurso] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        imagem_url: '',
        ordem: 0,
        preco: '',
        promotional_price: '',
        status_badge: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        loadCursos();
    }, []);

    async function loadCursos() {
        try {
            setLoading(true);
            const response = await api.get('/cursos');
            setCursos(response.data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar cursos:', err);
            setError('Erro ao carregar cursos');
        } finally {
            setLoading(false);
        }
    }

    function handleOpenDialog(curso = null) {
        if (curso) {
            setEditingCurso(curso);
            setFormData({
                nome: curso.nome,
                descricao: curso.descricao || '',
                imagem_url: curso.imagem_url || '',
                ordem: curso.ordem || 0,
                preco: curso.preco || '',
                promotional_price: curso.promotional_price || '',
                status_badge: curso.status_badge || ''
            });
        } else {
            setEditingCurso(null);
            setFormData({
                nome: '',
                descricao: '',
                imagem_url: '',
                ordem: 0,
                preco: '',
                promotional_price: '',
                status_badge: ''
            });
        }
        setOpenDialog(true);
    }

    function handleCloseDialog() {
        setOpenDialog(false);
        setEditingCurso(null);
        setFormData({
            nome: '',
            descricao: '',
            imagem_url: '',
            ordem: 0
        });
        setImagePreview('');
        setUploadingImage(false);
    }

    async function handleSubmit() {
        try {
            if (editingCurso) {
                await api.put(`/cursos/${editingCurso.id}`, formData);
            } else {
                await api.post('/cursos', formData);
            }
            handleCloseDialog();
            loadCursos();
        } catch (err) {
            console.error('Erro ao salvar curso:', err);
            setError('Erro ao salvar curso');
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('A imagem deve ter no máximo 5MB');
            return;
        }

        try {
            setUploadingImage(true);
            setError('');

            // Criar preview local
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Fazer upload para o backend
            const formDataUpload = new FormData();
            formDataUpload.append('imagem', file);

            const response = await api.post('/uploads/curso-imagem', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Atualizar URL da imagem no formData
            setFormData({ ...formData, imagem_url: response.data.url });

        } catch (err) {
            console.error('Erro ao fazer upload:', err);
            setError(err.response?.data?.error || 'Erro ao fazer upload da imagem');
            setImagePreview('');
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Tem certeza que deseja deletar este curso?')) {
            return;
        }

        try {
            await api.delete(`/cursos/${id}`);
            loadCursos();
        } catch (err) {
            console.error('Erro ao deletar curso:', err);
            setError('Erro ao deletar curso');
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Gerenciar Cursos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Novo Curso
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {cursos.map((curso) => (
                    <Grid item xs={12} sm={6} md={4} key={curso.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {curso.imagem_url && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={curso.imagem_url}
                                    alt={curso.nome}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {curso.nome}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {curso.descricao || 'Sem descrição'}
                                </Typography>
                                <Box mt={2}>
                                    <Chip
                                        label={`${curso.total_modulos || 0} módulos`}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`${curso.total_conteudos || 0} conteúdos`}
                                        size="small"
                                    />
                                </Box>
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => window.location.href = `/admin/cursos/${curso.id}/editar`}
                                    title="Editar conteúdo"
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenDialog(curso)}
                                    title="Editar informações"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(curso.id)}
                                    title="Deletar"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

                {cursos.length === 0 && (
                    <Grid item xs={12}>
                        <Box textAlign="center" py={8}>
                            <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Nenhum curso cadastrado
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Clique em "Novo Curso" para começar
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Dialog de Criar/Editar */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCurso ? 'Editar Curso' : 'Novo Curso'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome do Curso"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />

                        {/* Upload de Imagem */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Imagem do Curso
                            </Typography>

                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                disabled={uploadingImage}
                                fullWidth
                                sx={{ mb: 1 }}
                            >
                                {uploadingImage ? 'Fazendo upload...' : 'Escolher Arquivo'}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>

                            {uploadingImage && (
                                <LinearProgress sx={{ mb: 1 }} />
                            )}

                            {(imagePreview || formData.imagem_url) && (
                                <Box
                                    component="img"
                                    src={imagePreview || formData.imagem_url}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        maxHeight: 200,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        mb: 1
                                    }}
                                />
                            )}

                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Ou insira uma URL de imagem:
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="URL da Imagem"
                            value={formData.imagem_url}
                            onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Preço (R$)"
                                    type="number"
                                    value={formData.preco}
                                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Preço Promocional (R$)"
                                    type="number"
                                    value={formData.promotional_price}
                                    onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                                    helperText="Deixe vazio se não houver promoção"
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Status Badge (ex: Edital Aberto)"
                            value={formData.status_badge}
                            onChange={(e) => setFormData({ ...formData, status_badge: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Ordem"
                            type="number"
                            value={formData.ordem}
                            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.nome}
                    >
                        {editingCurso ? 'Salvar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
