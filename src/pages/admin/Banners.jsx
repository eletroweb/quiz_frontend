import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    MenuItem,
    Grid,
    Card,
    CardMedia
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function Banners() {
    const { token } = useAuth();
    const [banners, setBanners] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        link_url: '',
        texto_botao: 'Saiba Mais',
        ordem: 0,
        ativo: true,
        tipo: 'hero',
        imagem_url: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/banners', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBanners(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar banners:', error);
            setLoading(false);
        }
    };

    const handleOpen = (banner = null) => {
        if (banner) {
            setFormData({
                titulo: banner.titulo,
                descricao: banner.descricao || '',
                link_url: banner.link_url || '',
                texto_botao: banner.texto_botao || '',
                ordem: banner.ordem,
                ativo: banner.ativo === 1 || banner.ativo === true,
                tipo: banner.tipo,
                imagem_url: banner.imagem_url || ''
            });
            setEditingId(banner.id);
            setImagePreview(banner.imagem_url ? `http://localhost:3001${banner.imagem_url}` : null);
        } else {
            setFormData({
                titulo: '',
                descricao: '',
                link_url: '',
                texto_botao: 'Saiba Mais',
                ordem: 0,
                ativo: true,
                tipo: 'hero',
                imagem_url: ''
            });
            setEditingId(null);
            setImagePreview(null);
        }
        setSelectedImage(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            titulo: '',
            descricao: '',
            link_url: '',
            texto_botao: '',
            ordem: 0,
            ativo: true,
            tipo: 'hero',
            imagem_url: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = formData.imagem_url;

            if (selectedImage) {
                const formDataImage = new FormData();
                formDataImage.append('imagem', selectedImage);

                const uploadResponse = await axios.post('http://localhost:3001/api/banners/upload', formDataImage, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imageUrl = uploadResponse.data.url;
            }

            const bannerData = {
                ...formData,
                imagem_url: imageUrl
            };

            if (editingId) {
                await axios.put(`http://localhost:3001/api/banners/${editingId}`, bannerData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:3001/api/banners', bannerData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            fetchBanners();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar banner:', error);
            alert('Erro ao salvar banner');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este banner?')) {
            try {
                await axios.delete(`http://localhost:3001/api/banners/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBanners();
            } catch (error) {
                console.error('Erro ao excluir banner:', error);
            }
        }
    };

    const handleToggleActive = async (banner) => {
        try {
            await axios.put(`http://localhost:3001/api/banners/${banner.id}`, {
                ...banner,
                ativo: !banner.ativo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBanners();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Gerenciar Banners</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Novo Banner
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imagem</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Ordem</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    {banner.imagem_url && (
                                        <img
                                            src={`http://localhost:3001${banner.imagem_url}`}
                                            alt={banner.titulo}
                                            style={{ width: 100, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{banner.titulo}</TableCell>
                                <TableCell>{banner.tipo}</TableCell>
                                <TableCell>{banner.ordem}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={banner.ativo === 1 || banner.ativo === true}
                                        onChange={() => handleToggleActive(banner)}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(banner)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(banner.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {banners.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Nenhum banner cadastrado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? 'Editar Banner' : 'Novo Banner'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Descrição"
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Tipo"
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                >
                                    <MenuItem value="hero">Hero (Principal)</MenuItem>
                                    <MenuItem value="promocao">Promoção</MenuItem>
                                    <MenuItem value="informativo">Informativo</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Ordem"
                                    value={formData.ordem}
                                    onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Texto do Botão"
                                    value={formData.texto_botao}
                                    onChange={(e) => setFormData({ ...formData, texto_botao: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Link URL"
                                    value={formData.link_url}
                                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.ativo}
                                            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                        />
                                    }
                                    label="Ativo"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCameraIcon />}
                                    fullWidth
                                >
                                    Upload Imagem
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {imagePreview && (
                                    <Box mt={2} display="flex" justifyContent="center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Banners;
