import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Tabs, Tab,
    List, ListItem, ListItemText, Chip, Paper,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { PlayCircle, PictureAsPdf, Article, ExpandMore } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';

export default function Study() {
    const [materias, setMaterias] = useState([]);
    const [conteudos, setConteudos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState(null);
    const [selectedConteudo, setSelectedConteudo] = useState(null);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        loadMaterias();
    }, []);

    useEffect(() => {
        if (selectedMateria) {
            loadConteudos(selectedMateria);
        }
    }, [selectedMateria]);

    const loadMaterias = async () => {
        try {
            const response = await api.get('/materias');
            setMaterias(response.data);
            if (response.data.length > 0) {
                setSelectedMateria(response.data[0].id);
            }
        } catch (error) {
            console.error('Erro ao carregar matérias:', error);
        }
    };

    const loadConteudos = async (materiaId) => {
        try {
            const response = await api.get(`/conteudos?materia_id=${materiaId}`);
            setConteudos(response.data);
        } catch (error) {
            console.error('Erro ao carregar conteúdos:', error);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.split('v=')[1] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const filteredConteudos = conteudos.filter(c => {
        if (tab === 0) return c.tipo === 'video';
        if (tab === 1) return c.tipo === 'pdf';
        if (tab === 2) return c.tipo === 'texto';
        return true;
    });

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Área de Estudos
            </Typography>

            <Grid container spacing={3}>
                {/* Sidebar de Matérias */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Matérias
                        </Typography>
                        {materias.map((materia) => (
                            <Accordion
                                key={materia.id}
                                expanded={selectedMateria === materia.id}
                                onChange={() => setSelectedMateria(
                                    selectedMateria === materia.id ? null : materia.id
                                )}
                                sx={{
                                    mb: 1,
                                    '&:before': { display: 'none' },
                                    boxShadow: 'none',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px !important',
                                    '&.Mui-expanded': {
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                        borderColor: 'primary.main',
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                        '&.Mui-expanded': {
                                            minHeight: 48,
                                        },
                                        '& .MuiAccordionSummary-content.Mui-expanded': {
                                            margin: '12px 0',
                                        }
                                    }}
                                >
                                    <Typography fontWeight={selectedMateria === materia.id ? 'bold' : 'normal'}>
                                        {materia.nome}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {conteudos.filter(c => c.materia_id === materia.id).length} conteúdos disponíveis
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Paper>
                </Grid>

                {/* Área de Conteúdo */}
                <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                            <Tab icon={<PlayCircle />} label="Vídeos" />
                            <Tab icon={<PictureAsPdf />} label="PDFs" />
                            <Tab icon={<Article />} label="Textos" />
                        </Tabs>

                        {selectedConteudo ? (
                            <Grid container spacing={3}>
                                {/* Lista Lateral de Conteúdos */}
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined" sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                        <List>
                                            {filteredConteudos.map((conteudo) => (
                                                <ListItem
                                                    button
                                                    key={conteudo.id}
                                                    selected={selectedConteudo.id === conteudo.id}
                                                    onClick={() => setSelectedConteudo(conteudo)}
                                                >
                                                    <Box sx={{ mr: 1, display: 'flex' }}>
                                                        {conteudo.tipo === 'video' && <PlayCircle fontSize="small" color={selectedConteudo.id === conteudo.id ? "primary" : "action"} />}
                                                        {conteudo.tipo === 'pdf' && <PictureAsPdf fontSize="small" color={selectedConteudo.id === conteudo.id ? "primary" : "action"} />}
                                                        {conteudo.tipo === 'texto' && <Article fontSize="small" color={selectedConteudo.id === conteudo.id ? "primary" : "action"} />}
                                                    </Box>
                                                    <ListItemText
                                                        primary={conteudo.titulo}
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            fontWeight: selectedConteudo.id === conteudo.id ? 'bold' : 'normal'
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                        onClick={() => setSelectedConteudo(null)}
                                    >
                                        Voltar para Grade
                                    </Button>
                                </Grid>

                                {/* Visualizador de Conteúdo */}
                                <Grid item xs={12} md={8}>
                                    <Box>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {selectedConteudo.titulo}
                                        </Typography>

                                        {selectedConteudo.tipo === 'video' && selectedConteudo.youtube_url && (
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    paddingBottom: '56.25%',
                                                    height: 0,
                                                    overflow: 'hidden',
                                                    borderRadius: 2,
                                                    mt: 2,
                                                }}
                                            >
                                                <iframe
                                                    src={getYouTubeEmbedUrl(selectedConteudo.youtube_url)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 0,
                                                    }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </Box>
                                        )}

                                        {selectedConteudo.tipo === 'pdf' && selectedConteudo.file_url && (
                                            <Box sx={{ mt: 2, height: '80vh' }}>
                                                <iframe
                                                    src={selectedConteudo.file_url}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 0,
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {selectedConteudo.tipo === 'texto' && (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    '& p': { mb: 2, lineHeight: 1.8, textAlign: 'justify' },
                                                    '& h1': { mt: 4, mb: 2, fontSize: '2rem', fontWeight: 'bold', color: 'primary.main' },
                                                    '& h2': { mt: 3, mb: 2, fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main' },
                                                    '& h3': { mt: 2.5, mb: 1.5, fontSize: '1.25rem', fontWeight: 'bold' },
                                                    '& h4, & h5, & h6': { mt: 2, mb: 1, fontWeight: 'bold' },
                                                    '& ul, & ol': { pl: 4, mb: 2 },
                                                    '& li': { mb: 1, lineHeight: 1.7 },
                                                    '& strong': { fontWeight: 'bold', color: 'primary.dark' },
                                                    '& em': { fontStyle: 'italic', color: 'text.secondary' },
                                                    '& code': {
                                                        bgcolor: 'grey.100',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.9em',
                                                        color: 'error.main'
                                                    },
                                                    '& pre': {
                                                        bgcolor: 'grey.100',
                                                        p: 2,
                                                        borderRadius: 2,
                                                        overflow: 'auto',
                                                        mb: 2,
                                                        '& code': {
                                                            bgcolor: 'transparent',
                                                            p: 0,
                                                            color: 'text.primary'
                                                        }
                                                    },
                                                    '& blockquote': {
                                                        borderLeft: '4px solid',
                                                        borderColor: 'primary.main',
                                                        pl: 2,
                                                        ml: 0,
                                                        my: 2,
                                                        fontStyle: 'italic',
                                                        color: 'text.secondary',
                                                        bgcolor: 'grey.50',
                                                        py: 1,
                                                        borderRadius: 1
                                                    },
                                                    '& hr': {
                                                        my: 3,
                                                        borderColor: 'divider'
                                                    },
                                                    '& table': {
                                                        width: '100%',
                                                        borderCollapse: 'collapse',
                                                        mb: 2
                                                    },
                                                    '& th, & td': {
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        p: 1.5,
                                                        textAlign: 'left'
                                                    },
                                                    '& th': {
                                                        bgcolor: 'grey.100',
                                                        fontWeight: 'bold'
                                                    }
                                                }}
                                            >
                                                <ReactMarkdown>{selectedConteudo.conteudo}</ReactMarkdown>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredConteudos.map((conteudo) => (
                                    <Grid item xs={12} sm={6} md={4} key={conteudo.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4,
                                                },
                                            }}
                                            onClick={() => setSelectedConteudo(conteudo)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    {conteudo.tipo === 'video' && <PlayCircle color="primary" />}
                                                    {conteudo.tipo === 'pdf' && <PictureAsPdf color="error" />}
                                                    {conteudo.tipo === 'texto' && <Article color="action" />}
                                                    <Typography variant="caption" sx={{ ml: 1 }}>
                                                        {conteudo.tipo.toUpperCase()}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {conteudo.titulo}
                                                </Typography>
                                                <Chip
                                                    label={conteudo.materia_nome}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
