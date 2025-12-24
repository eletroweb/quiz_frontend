import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Paper, TextField, IconButton,
    List, ListItem, ListItemText, ListItemSecondaryAction, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
    FormControl, InputLabel, Alert, CircularProgress, Accordion,
    AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import {
    ArrowBack, Add, Edit, Delete, ExpandMore, DragIndicator,
    Save, School
} from '@mui/icons-material';
import api from '../../services/api';

export default function CursoEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [bibliotecaConteudos, setBibliotecaConteudos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModuloDialog, setOpenModuloDialog] = useState(false);
    const [openConteudoDialog, setOpenConteudoDialog] = useState(false);
    const [editingModulo, setEditingModulo] = useState(null);
    const [editingConteudo, setEditingConteudo] = useState(null);
    const [selectedModuloId, setSelectedModuloId] = useState(null);

    const [moduloForm, setModuloForm] = useState({
        nome: '',
        descricao: '',
        ordem: 0,
        materia_id: ''
    });

    const [conteudoForm, setConteudoForm] = useState({
        tipo: 'texto',
        titulo: '',
        descricao: '',
        conteudo: '',
        materia_id: '',
        duracao_estimada: 0,
        ordem: 0
    });

    
    const loadCurso = useCallback(async () => {
    try {
        setLoading(true);
        const response = await api.get(`/cursos/${id}`);
        setCurso(response.data);
        setError('');
    } catch (err) {
        console.error('Erro ao carregar curso:', err);
        setError('Erro ao carregar curso');
    } finally {
        setLoading(false);
    }
    }, [id]);

    const loadMaterias = useCallback(async () => {
    try {
        const response = await api.get('/materias');
        setMaterias(response.data);
    } catch (err) {
        console.error('Erro ao carregar matérias:', err);
    }
    }, []);

    const loadBiblioteca = useCallback(async () => {
    try {
        const response = await api.get('/conteudos');
        setBibliotecaConteudos(response.data);
    } catch (err) {
        console.error('Erro ao carregar biblioteca:', err);
    }
    }, []);

    useEffect(() => {
        loadCurso();
        loadMaterias();
        loadBiblioteca();
    }, [loadCurso, loadMaterias, loadBiblioteca]);
    

    // Módulos
    function handleOpenModuloDialog(modulo = null) {
        if (modulo) {
            setEditingModulo(modulo);
            setModuloForm({
                nome: modulo.nome,
                descricao: modulo.descricao || '',
                ordem: modulo.ordem || 0
            });
        } else {
            setEditingModulo(null);
            setModuloForm({
                nome: '',
                descricao: '',
                ordem: curso.modulos?.length || 0,
                materia_id: ''
            });
        }
        setOpenModuloDialog(true);
    }

    async function handleSaveModulo() {
        try {
            const payload = { ...moduloForm };
            if (!payload.materia_id) {
                delete payload.materia_id;
            }

            if (editingModulo) {
                await api.put(`/cursos/modulos/${editingModulo.id}`, payload);
            } else {
                await api.post(`/cursos/${id}/modulos`, payload);
            }
            setOpenModuloDialog(false);
            loadCurso();
        } catch (err) {
            console.error('Erro ao salvar módulo:', err);
            setError('Erro ao salvar módulo');
        }
    }

    async function handleDeleteModulo(moduloId) {
        if (!window.confirm('Tem certeza? Todos os conteúdos deste módulo serão deletados.')) {
            return;
        }
        try {
            await api.delete(`/cursos/modulos/${moduloId}`);
            loadCurso();
        } catch (err) {
            console.error('Erro ao deletar módulo:', err);
            setError('Erro ao deletar módulo');
        }
    }

    // Conteúdos
    function handleOpenConteudoDialog(moduloId, conteudo = null) {
        setSelectedModuloId(moduloId);
        if (conteudo) {
            setEditingConteudo(conteudo);
            setConteudoForm({
                tipo: conteudo.tipo,
                titulo: conteudo.titulo,
                descricao: conteudo.descricao || '',
                conteudo: conteudo.conteudo || '',
                materia_id: conteudo.materia_id || '',
                duracao_estimada: conteudo.duracao_estimada || 0,
                ordem: conteudo.ordem || 0
            });
        } else {
            setEditingConteudo(null);
            const modulo = curso.modulos.find(m => m.id === moduloId);
            setConteudoForm({
                tipo: 'texto',
                titulo: '',
                descricao: '',
                conteudo: '',
                materia_id: '',
                duracao_estimada: 0,
                ordem: modulo?.conteudos?.length || 0
            });
        }
        setOpenConteudoDialog(true);
    }

    async function handleSaveConteudo() {
        try {
            if (editingConteudo) {
                await api.put(`/cursos/conteudos/${editingConteudo.id}`, conteudoForm);
            } else {
                await api.post(`/cursos/modulos/${selectedModuloId}/conteudos`, conteudoForm);
            }
            setOpenConteudoDialog(false);
            loadCurso();
        } catch (err) {
            console.error('Erro ao salvar conteúdo:', err);
            setError('Erro ao salvar conteúdo');
        }
    }

    async function handleDeleteConteudo(conteudoId) {
        if (!window.confirm('Tem certeza que deseja deletar este conteúdo?')) {
            return;
        }
        try {
            await api.delete(`/cursos/conteudos/${conteudoId}`);
            loadCurso();
        } catch (err) {
            console.error('Erro ao deletar conteúdo:', err);
            setError('Erro ao deletar conteúdo');
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!curso) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">Curso não encontrado</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate('/admin/cursos')} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" fontWeight="bold" flexGrow={1}>
                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {curso.nome}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModuloDialog()}
                >
                    Novo Módulo
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    {curso.descricao || 'Sem descrição'}
                </Typography>
            </Paper>

            {/* Lista de Módulos */}
            {curso.modulos && curso.modulos.length > 0 ? (
                curso.modulos.map((modulo, index) => (
                    <Accordion key={modulo.id} defaultExpanded={index === 0}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box display="flex" alignItems="center" width="100%">
                                <DragIndicator sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="h6" flexGrow={1}>
                                    {modulo.nome}
                                </Typography>
                                <Chip
                                    label={`${modulo.conteudos?.length || 0} conteúdos`}
                                    size="small"
                                    sx={{ mr: 2 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenModuloDialog(modulo);
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteModulo(modulo.id);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            {modulo.descricao && (
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {modulo.descricao}
                                </Typography>
                            )}

                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Add />}
                                onClick={() => handleOpenConteudoDialog(modulo.id)}
                                sx={{ mb: 2 }}
                            >
                                Adicionar Conteúdo
                            </Button>

                            <List>
                                {modulo.conteudos && modulo.conteudos.map((conteudo) => (
                                    <React.Fragment key={conteudo.id}>
                                        <ListItem>
                                            <DragIndicator sx={{ mr: 2, color: 'text.secondary' }} />
                                            <ListItemText
                                                primary={conteudo.titulo}
                                                secondary={
                                                    <>
                                                        <Chip label={conteudo.tipo} size="small" sx={{ mr: 1 }} />
                                                        {conteudo.tipo === 'materia' && conteudo.materia_nome && (
                                                            <Chip label={conteudo.materia_nome} size="small" color="primary" />
                                                        )}
                                                        {conteudo.duracao_estimada > 0 && (
                                                            <Typography variant="caption" sx={{ ml: 1 }}>
                                                                {conteudo.duracao_estimada} min
                                                            </Typography>
                                                        )}
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenConteudoDialog(modulo.id, conteudo)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteConteudo(conteudo.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                                {(!modulo.conteudos || modulo.conteudos.length === 0) && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Nenhum conteúdo adicionado"
                                            secondary="Clique em 'Adicionar Conteúdo' para começar"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum módulo criado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Clique em "Novo Módulo" para começar a estruturar seu curso
                    </Typography>
                </Paper>
            )}

            {/* Dialog Módulo */}
            <Dialog open={openModuloDialog} onClose={() => setOpenModuloDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingModulo ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {!editingModulo && (
                            <Box sx={{ mb: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <InputLabel>Importar Matéria (Opcional)</InputLabel>
                                    <Button
                                        size="small"
                                        onClick={() => window.open('/admin/materias', '_blank')}
                                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                                    >
                                        Gerenciar Matérias
                                    </Button>
                                </Box>
                                <FormControl fullWidth>
                                    <Select
                                        value={moduloForm.materia_id || ''}
                                        onChange={(e) => {
                                            const materiaId = e.target.value;
                                            const materia = materias.find(m => m.id === materiaId);
                                            setModuloForm({
                                                ...moduloForm,
                                                materia_id: materiaId,
                                                nome: (!moduloForm.nome && materia) ? materia.nome : moduloForm.nome
                                            });
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Nenhuma</em>
                                        </MenuItem>
                                        {materias.map((materia) => (
                                            <MenuItem key={materia.id} value={materia.id}>
                                                {materia.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            label="Nome do Módulo"
                            value={moduloForm.nome}
                            onChange={(e) => setModuloForm({ ...moduloForm, nome: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            value={moduloForm.descricao}
                            onChange={(e) => setModuloForm({ ...moduloForm, descricao: e.target.value })}
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Ordem"
                            type="number"
                            value={moduloForm.ordem}
                            onChange={(e) => setModuloForm({ ...moduloForm, ordem: parseInt(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModuloDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveModulo} variant="contained" disabled={!moduloForm.nome}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Conteúdo */}
            <Dialog open={openConteudoDialog} onClose={() => setOpenConteudoDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingConteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {!editingConteudo && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Importar da Biblioteca (Opcional)</InputLabel>
                                <Select
                                    value=""
                                    label="Importar da Biblioteca (Opcional)"
                                    onChange={(e) => {
                                        const conteudoId = e.target.value;
                                        const conteudoOrigem = bibliotecaConteudos.find(c => c.id === conteudoId);
                                        if (conteudoOrigem) {
                                            setConteudoForm({
                                                ...conteudoForm,
                                                tipo: conteudoOrigem.tipo.toLowerCase(),
                                                titulo: conteudoOrigem.titulo,
                                                descricao: '',
                                                conteudo: conteudoOrigem.youtube_url || conteudoOrigem.file_url || conteudoOrigem.conteudo || '',
                                                materia_id: conteudoOrigem.materia_id || '',
                                                duracao_estimada: 0
                                            });
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Nenhum</em>
                                    </MenuItem>
                                    {bibliotecaConteudos.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>
                                            {c.titulo} ({c.tipo})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tipo de Conteúdo</InputLabel>
                            <Select
                                value={conteudoForm.tipo}
                                label="Tipo de Conteúdo"
                                onChange={(e) => setConteudoForm({ ...conteudoForm, tipo: e.target.value })}
                            >
                                <MenuItem value="texto">Texto</MenuItem>
                                <MenuItem value="video">Vídeo</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="materia">Matéria (Questões)</MenuItem>
                                <MenuItem value="quiz">Quiz</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Título"
                            value={conteudoForm.titulo}
                            onChange={(e) => setConteudoForm({ ...conteudoForm, titulo: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Descrição"
                            value={conteudoForm.descricao}
                            onChange={(e) => setConteudoForm({ ...conteudoForm, descricao: e.target.value })}
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />

                        {conteudoForm.tipo === 'materia' ? (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Matéria</InputLabel>
                                <Select
                                    value={conteudoForm.materia_id}
                                    label="Matéria"
                                    onChange={(e) => setConteudoForm({ ...conteudoForm, materia_id: e.target.value })}
                                >
                                    {materias.map((materia) => (
                                        <MenuItem key={materia.id} value={materia.id}>
                                            {materia.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label={conteudoForm.tipo === 'video' ? 'URL do Vídeo' : conteudoForm.tipo === 'pdf' ? 'URL do PDF' : 'Conteúdo'}
                                value={conteudoForm.conteudo}
                                onChange={(e) => setConteudoForm({ ...conteudoForm, conteudo: e.target.value })}
                                multiline={conteudoForm.tipo === 'texto'}
                                rows={conteudoForm.tipo === 'texto' ? 4 : 1}
                                sx={{ mb: 2 }}
                            />
                        )}

                        <Box display="flex" gap={2}>
                            <TextField
                                label="Duração Estimada (min)"
                                type="number"
                                value={conteudoForm.duracao_estimada}
                                onChange={(e) => setConteudoForm({ ...conteudoForm, duracao_estimada: parseInt(e.target.value) })}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Ordem"
                                type="number"
                                value={conteudoForm.ordem}
                                onChange={(e) => setConteudoForm({ ...conteudoForm, ordem: parseInt(e.target.value) })}
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConteudoDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveConteudo} variant="contained" disabled={!conteudoForm.titulo}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
