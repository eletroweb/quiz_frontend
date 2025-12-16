import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Card, CardContent, CardActions,
    Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Alert, FormControlLabel, Switch, CircularProgress, CardMedia
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Article as ArticleIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import api from '../../services/api';

export default function NewsAdmin() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        resumo: '',
        conteudo: '',
        imagem_url: '',
        destaque: false,
        categoria: 'geral'
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        loadNews();
    }, []);

    async function loadNews() {
        try {
            setLoading(true);
            const response = await api.get('/news');
            setNews(response.data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar notícias:', err);
            setError('Erro ao carregar notícias');
        } finally {
            setLoading(false);
        }
    }

    function handleOpenDialog(item = null) {
        if (item) {
            setEditingNews(item);
            setFormData({
                titulo: item.titulo,
                resumo: item.resumo || '',
                conteudo: item.conteudo || '',
                imagem_url: item.imagem_url || '',
                destaque: item.destaque || false,
                categoria: item.categoria || 'geral'
            });
        } else {
            setEditingNews(null);
            setFormData({
                titulo: '',
                resumo: '',
                conteudo: '',
                imagem_url: '',
                destaque: false,
                categoria: 'geral'
            });
        }
        setOpenDialog(true);
    }

    function handleCloseDialog() {
        setOpenDialog(false);
        setEditingNews(null);
    }

    async function handleSubmit() {
        try {
            if (editingNews) {
                await api.put(`/news/${editingNews.id}`, formData);
            } else {
                await api.post('/news', formData);
            }
            handleCloseDialog();
            loadNews();
        } catch (err) {
            console.error('Erro ao salvar notícia:', err);
            setError('Erro ao salvar notícia');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Tem certeza que deseja deletar esta notícia?')) return;
        try {
            await api.delete(`/news/${id}`);
            loadNews();
        } catch (err) {
            setError('Erro ao deletar notícia');
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const formDataUpload = new FormData();
            formDataUpload.append('imagem', file);

            const response = await api.post('/uploads/banner', formDataUpload, { // Usando rota genérica de upload
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData({ ...formData, imagem_url: response.data.url });
        } catch (err) {
            console.error('Erro no upload:', err);
            setError('Erro ao fazer upload da imagem');
        } finally {
            setUploadingImage(false);
        }
    }

    if (loading) return <CircularProgress />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Gerenciar Notícias
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nova Notícia
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Grid container spacing={3}>
                {news.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {item.imagem_url && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.imagem_url}
                                    alt={item.titulo}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>{item.titulo}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {item.resumo}
                                </Typography>
                                {item.destaque && (
                                    <Typography variant="caption" color="primary" fontWeight="bold" display="block" mt={1}>
                                        ★ DESTAQUE
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleOpenDialog(item)} color="primary"><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Título"
                            fullWidth
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        />
                        <TextField
                            label="Resumo"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.resumo}
                            onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                        />
                        <TextField
                            label="Conteúdo Completo (HTML ou Texto)"
                            fullWidth
                            multiline
                            rows={6}
                            value={formData.conteudo}
                            onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                        />

                        <Box border={1} borderColor="divider" p={2} borderRadius={1}>
                            <Typography variant="subtitle2" gutterBottom>Imagem de Capa</Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                disabled={uploadingImage}
                                sx={{ mb: 2 }}
                            >
                                {uploadingImage ? 'Carregando...' : 'Upload Imagem'}
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </Button>

                            <TextField
                                label="Ou URL da Imagem (Cloudinary)"
                                fullWidth
                                size="small"
                                value={formData.imagem_url}
                                onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.destaque}
                                    onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                                />
                            }
                            label="Destaque na Página Inicial"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
