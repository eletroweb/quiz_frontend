import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  LinearProgress,
  Chip,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import api from '../../services/api';

export default function Curso() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({
    percentual_concluido: 0,
    conteudos_concluidos: 0,
    total_conteudos: 0,
  });

  useEffect(() => {
    async function fetchCurso() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/cursos/${id}`);
        setCurso(response.data);
      } catch {
        setError('Não foi possível carregar o curso. Verifique seu acesso.');
      } finally {
        setLoading(false);
      }
    }
    fetchCurso();
  }, [id]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const resp = await api.get(`/curso-progress/${id}`);
        const prog = resp.data || {};
        setProgress({
          percentual_concluido: prog.percentual_concluido || 0,
          conteudos_concluidos: prog.conteudos_concluidos || 0,
          total_conteudos: prog.total_conteudos || 0,
        });

        if (curso && Array.isArray(curso.modulos)) {
          const map = {};
          (prog.conteudos || []).forEach((c) => {
            map[c.id] = c.progresso?.concluido || false;
          });

          setCurso((prev) => {
            if (!prev) return prev;
            const modulos = prev.modulos.map((m) => ({
              ...m,
              conteudos: (m.conteudos || []).map((c) => ({
                ...c,
                concluido: map[c.id] || false,
              })),
            }));
            return { ...prev, modulos };
          });
        }
      } catch {
        // erro ignorado propositalmente
      }
    }

    if (id) fetchProgress();
  }, [id, curso]);

  async function toggleConcluido(conteudoId, current) {
    try {
      await api.post(`/curso-progress/${conteudoId}/marcar`, {
        concluido: !current,
      });

      setCurso((prev) => {
        if (!prev) return prev;
        const modulos = prev.modulos.map((m) => ({
          ...m,
          conteudos: (m.conteudos || []).map((c) =>
            c.id === conteudoId ? { ...c, concluido: !current } : c
          ),
        }));
        return { ...prev, modulos };
      });

      const newCompleted =
        (progress.conteudos_concluidos || 0) + (current ? -1 : 1);
      const total = progress.total_conteudos || 0;

      setProgress({
        total_conteudos: total,
        conteudos_concluidos: Math.max(0, newCompleted),
        percentual_concluido:
          total > 0
            ? Math.round((Math.max(0, newCompleted) / total) * 100)
            : 0,
      });
    } catch {
      // erro ignorado
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!curso) {
    return (
      <Container sx={{ mt: 3 }}>
        <Alert severity="warning">Curso não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {curso.nome}
      </Typography>

      {curso.descricao && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {curso.descricao}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Progresso: {progress.percentual_concluido}% (
          {progress.conteudos_concluidos}/{progress.total_conteudos})
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress.percentual_concluido}
        />
      </Box>

      <Paper sx={{ p: 2 }}>
        {Array.isArray(curso.modulos) && curso.modulos.length > 0 ? (
          curso.modulos.map((modulo) => (
            <Accordion key={modulo.id} sx={{ mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" fontWeight="bold">
                  {modulo.nome}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <List dense>
                  {(modulo.conteudos || []).map((conteudo) => (
                    <ListItem
                      key={conteudo.id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          checked={!!conteudo.concluido}
                          onChange={() =>
                            toggleConcluido(
                              conteudo.id,
                              !!conteudo.concluido
                            )
                          }
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography sx={{ fontWeight: 500 }}>
                              {conteudo.titulo}
                            </Typography>
                            {conteudo.tipo && (
                              <Chip size="small" label={conteudo.tipo} />
                            )}
                          </Box>
                        }
                        secondary={
                          conteudo.materia_nome
                            ? `Matéria: ${conteudo.materia_nome}`
                            : undefined
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
              <Divider />
            </Accordion>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum conteúdo disponível neste curso ainda.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
