import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip,
    FormControl, InputLabel, Select, MenuItem, LinearProgress,
    Radio, RadioGroup, FormControlLabel, Alert, Paper
} from '@mui/material';
import { CheckCircle, Cancel, Timer, NavigateNext } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';

export default function Quiz() {
    const [materias, setMaterias] = useState([]);
    const [concursos, setConcursos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedConcurso, setSelectedConcurso] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFilters();
    }, []);

    const loadFilters = async () => {
        try {
            const [mRes, cRes] = await Promise.all([
                api.get('/materias'),
                api.get('/concursos')
            ]);
            setMaterias(mRes.data);
            setConcursos(cRes.data);
        } catch (error) {
            console.error('Erro ao carregar filtros:', error);
        }
    };

    const startQuiz = async () => {
        setLoading(true);
        try {
            let url = '/questoes?';
            if (selectedMateria) url += `materia_id=${selectedMateria}&`;
            if (selectedConcurso) url += `concurso_id=${selectedConcurso}&`;

            const response = await api.get(url);
            setQuestions(response.data);
            setCurrentIndex(0);
            setScore(0);
            setShowResult(false);
        } catch (error) {
            console.error('Erro ao carregar questões:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === questions[currentIndex].correct_index;
        if (isCorrect) setScore(score + 1);

        // Registrar resposta na API
        try {
            await api.post('/stats/answer', {
                questao_id: questions[currentIndex].id,
                selected_index: selectedAnswer,
                correct: isCorrect
            });
        } catch (error) {
            console.error('Erro ao registrar resposta:', error);
        }

        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const currentQuestion = questions[currentIndex];

    if (questions.length === 0) {
        return (
            <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Quiz de Questões
                </Typography>
                <Paper sx={{ p: 4, mt: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Selecione os filtros e inicie o quiz
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Matéria</InputLabel>
                                <Select
                                    value={selectedMateria}
                                    label="Matéria"
                                    onChange={(e) => setSelectedMateria(e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {materias.map(m => (
                                        <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Concurso</InputLabel>
                                <Select
                                    value={selectedConcurso}
                                    label="Concurso"
                                    onChange={(e) => setSelectedConcurso(e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {concursos.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={startQuiz}
                        disabled={loading}
                        sx={{
                            mt: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        {loading ? 'Carregando...' : 'Iniciar Quiz'}
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header com progresso */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">
                        Questão {currentIndex + 1} de {questions.length}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        Acertos: {score}/{questions.length}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={((currentIndex + 1) / questions.length) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </Box>

            {/* Questão */}
            <Card sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Chip label={currentQuestion.materia_nome} color="primary" sx={{ mr: 1 }} />
                    {currentQuestion.banca && (
                        <Chip label={currentQuestion.banca} variant="outlined" sx={{ mr: 1 }} />
                    )}
                    {currentQuestion.ano && (
                        <Chip label={currentQuestion.ano} variant="outlined" />
                    )}
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    {currentQuestion.text}
                </Typography>

                <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                >
                    {currentQuestion.choices.map((choice, index) => (
                        <FormControlLabel
                            key={index}
                            value={index}
                            control={<Radio />}
                            label={choice}
                            disabled={showResult}
                            sx={{
                                p: 2,
                                mb: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: showResult
                                    ? index === currentQuestion.correct_index
                                        ? 'success.main'
                                        : index === selectedAnswer
                                            ? 'error.main'
                                            : 'divider'
                                    : 'divider',
                                bgcolor: showResult
                                    ? index === currentQuestion.correct_index
                                        ? 'success.light'
                                        : index === selectedAnswer
                                            ? 'error.light'
                                            : 'transparent'
                                    : 'transparent',
                            }}
                        />
                    ))}
                </RadioGroup>

                {showResult && currentQuestion.explanation && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2" component="div">
                            <strong>Explicação:</strong>
                            <Box sx={{
                                mt: 1,
                                '& p': { mb: 1.5, lineHeight: 1.7 },
                                '& strong': { fontWeight: 'bold', color: 'primary.main' },
                                '& em': { fontStyle: 'italic' },
                                '& ul, & ol': { pl: 3, mb: 1.5 },
                                '& li': { mb: 0.5 },
                                '& code': {
                                    bgcolor: 'grey.100',
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    fontFamily: 'monospace',
                                    fontSize: '0.9em'
                                },
                                '& pre': {
                                    bgcolor: 'grey.100',
                                    p: 1.5,
                                    borderRadius: 1,
                                    overflow: 'auto',
                                    '& code': {
                                        bgcolor: 'transparent',
                                        p: 0
                                    }
                                },
                                '& blockquote': {
                                    borderLeft: '4px solid',
                                    borderColor: 'primary.main',
                                    pl: 2,
                                    ml: 0,
                                    fontStyle: 'italic',
                                    color: 'text.secondary'
                                }
                            }}>
                                <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
                            </Box>
                        </Typography>
                    </Alert>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    {!showResult ? (
                        <Button
                            variant="contained"
                            onClick={handleAnswer}
                            disabled={selectedAnswer === null}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Responder
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={nextQuestion}
                            disabled={currentIndex === questions.length - 1}
                            endIcon={<NavigateNext />}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Próxima Questão
                        </Button>
                    )}
                </Box>
            </Card>

            {/* Resultado final */}
            {currentIndex === questions.length - 1 && showResult && (
                <Paper sx={{ p: 3, mt: 3, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Quiz Finalizado!
                    </Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                        {score} / {questions.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {Math.round((score / questions.length) * 100)}% de acerto
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setQuestions([])}
                        sx={{
                            mt: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Fazer Novo Quiz
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
