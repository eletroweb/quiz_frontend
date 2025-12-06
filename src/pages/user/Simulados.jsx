import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, TextField,
    FormControl, InputLabel, Select, MenuItem, Chip, Paper,
    List, ListItem, ListItemText, Divider, Dialog, DialogTitle,
    DialogContent, DialogActions, LinearProgress
} from '@mui/material';
import { Add, PlayArrow, Assessment, Delete } from '@mui/icons-material';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Simulados() {
    const [materias, setMaterias] = useState([]);
    const [simulados, setSimulados] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newSimulado, setNewSimulado] = useState({
        nome: '',
        materia_id: '',
        num_questoes: 10,
        dificuldade: 'medio'
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [mRes] = await Promise.all([
                api.get('/materias')
            ]);
            setMaterias(mRes.data);
            // Simulados salvos viriam do localStorage ou API
            const saved = JSON.parse(localStorage.getItem('simulados') || '[]');
            setSimulados(saved);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const createSimulado = async () => {
        try {
            // Buscar questões da API
            let url = `/questoes?`;
            if (newSimulado.materia_id) url += `materia_id=${newSimulado.materia_id}&`;
            if (newSimulado.dificuldade) url += `dificuldade=${newSimulado.dificuldade}&`;

            const response = await api.get(url);
            const questions = response.data.slice(0, newSimulado.num_questoes);

            const simulado = {
                id: Date.now(),
                ...newSimulado,
                questoes: questions,
                created_at: new Date().toISOString(),
                completed: false,
                score: null
            };

            const updated = [...simulados, simulado];
            setSimulados(updated);
            localStorage.setItem('simulados', JSON.stringify(updated));
            setOpenDialog(false);
            setNewSimulado({ nome: '', materia_id: '', num_questoes: 10, dificuldade: 'medio' });
        } catch (error) {
            console.error('Erro ao criar simulado:', error);
        }
    };

    const deleteSimulado = (id) => {
        const updated = simulados.filter(s => s.id !== id);
        setSimulados(updated);
        localStorage.setItem('simulados', JSON.stringify(updated));
    };

    const startSimulado = (simulado) => {
        // Redirecionar para página de quiz com as questões do simulado
        localStorage.setItem('current_simulado', JSON.stringify(simulado));
        navigate('/quiz');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Simulados
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Criar Simulado
                </Button>
            </Box>

            {simulados.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Assessment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Nenhum simulado criado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Crie seu primeiro simulado personalizado para testar seus conhecimentos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Criar Simulado
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {simulados.map((simulado) => (
                        <Grid item xs={12} md={6} key={simulado.id}>
                            <Card sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {simulado.nome}
                                        </Typography>
                                        <Chip
                                            label={simulado.completed ? 'Concluído' : 'Pendente'}
                                            color={simulado.completed ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Box>

                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary="Questões"
                                                secondary={`${simulado.num_questoes} questões`}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Dificuldade"
                                                secondary={simulado.dificuldade}
                                            />
                                        </ListItem>
                                        {simulado.completed && (
                                            <ListItem>
                                                <ListItemText
                                                    primary="Resultado"
                                                    secondary={`${simulado.score}/${simulado.num_questoes} (${Math.round((simulado.score / simulado.num_questoes) * 100)}%)`}
                                                />
                                            </ListItem>
                                        )}
                                    </List>

                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<PlayArrow />}
                                            onClick={() => startSimulado(simulado)}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            }}
                                        >
                                            {simulado.completed ? 'Refazer' : 'Iniciar'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => deleteSimulado(simulado.id)}
                                        >
                                            <Delete />
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog para criar simulado */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Criar Novo Simulado</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nome do Simulado"
                            fullWidth
                            value={newSimulado.nome}
                            onChange={(e) => setNewSimulado({ ...newSimulado, nome: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Matéria</InputLabel>
                            <Select
                                value={newSimulado.materia_id}
                                label="Matéria"
                                onChange={(e) => setNewSimulado({ ...newSimulado, materia_id: e.target.value })}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {materias.map(m => (
                                    <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Número de Questões"
                            type="number"
                            fullWidth
                            value={newSimulado.num_questoes}
                            onChange={(e) => setNewSimulado({ ...newSimulado, num_questoes: parseInt(e.target.value) })}
                            inputProps={{ min: 5, max: 50 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Dificuldade</InputLabel>
                            <Select
                                value={newSimulado.dificuldade}
                                label="Dificuldade"
                                onChange={(e) => setNewSimulado({ ...newSimulado, dificuldade: e.target.value })}
                            >
                                <MenuItem value="facil">Fácil</MenuItem>
                                <MenuItem value="medio">Médio</MenuItem>
                                <MenuItem value="dificil">Difícil</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={createSimulado}
                        variant="contained"
                        disabled={!newSimulado.nome}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Criar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
