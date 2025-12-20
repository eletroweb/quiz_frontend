import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    text: "",
    materia_id: "",
    concurso_id: "",
    banca: "",
    ano: new Date().getFullYear(),
    dificuldade: "medio",
    type: "mc",
    choices: ["", "", "", "", ""],
    correct_index: 0,
    explanation: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  // Quando o tipo muda para TF, ajusta automaticamente
  useEffect(() => {
    if (formData.type === "tf") {
      setFormData((prev) => ({
        ...prev,
        choices: ["Certo", "Errado"],
        correct_index: 0,
      }));
    }
  }, [formData.type]);

  const loadData = async () => {
    try {
      const [qRes, mRes, cRes] = await Promise.all([
        api.get("/questoes"),
        api.get("/materias"),
        api.get("/concursos"),
      ]);
      setQuestions(qRes.data);
      setMaterias(mRes.data);
      setConcursos(cRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (question = null) => {
    if (question) {
      setEditingId(question.id);
      setFormData({
        text: question.text,
        materia_id: question.materia_id || "",
        concurso_id: question.concurso_id || "",
        banca: question.banca || "",
        ano: question.ano || new Date().getFullYear(),
        dificuldade: question.dificuldade || "medio",
        type: question.type || "mc",
        choices: question.choices || ["", "", "", "", ""],
        correct_index: question.correct_index || 0,
        explanation: question.explanation || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        text: "",
        materia_id: "",
        concurso_id: "",
        banca: "",
        ano: new Date().getFullYear(),
        dificuldade: "medio",
        type: "mc",
        choices: ["", "", "", "", ""],
        correct_index: 0,
        explanation: "",
      });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/questoes/${editingId}`, formData);
      } else {
        await api.post("/questoes", formData);
      }
      setOpen(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      alert("Erro ao salvar questão");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta questão?")) {
      try {
        await api.delete(`/questoes/${id}`);
        loadData();
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Gerenciar Questões</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nova Questão
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Texto</TableCell>
              <TableCell>Matéria</TableCell>
              <TableCell>Banca/Ano</TableCell>
              <TableCell>Dificuldade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 300,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {q.text}
                </TableCell>
                <TableCell>{q.materia_nome}</TableCell>
                <TableCell>
                  {q.banca} / {q.ano}
                </TableCell>
                <TableCell>
                  <Chip
                    label={q.dificuldade}
                    color={
                      q.dificuldade === "facil"
                        ? "success"
                        : q.dificuldade === "medio"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(q)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(q.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Editar Questão" : "Nova Questão"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Enunciado"
              multiline
              rows={3}
              fullWidth
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Questão</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo de Questão"
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <MenuItem value="mc">📝 Múltiplas Alternativas</MenuItem>
                    <MenuItem value="tf">✓✗ Certo/Errado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {formData.type === "mc" && (
                  <FormControl fullWidth>
                    <InputLabel>Nº de Alternativas</InputLabel>
                    <Select
                      value={formData.choices.length}
                      label="Nº de Alternativas"
                      onChange={(e) => {
                        const newChoices = Array(e.target.value).fill("");
                        formData.choices.forEach((c, i) => {
                          if (i < e.target.value) newChoices[i] = c;
                        });
                        setFormData({
                          ...formData,
                          choices: newChoices,
                          correct_index: Math.min(
                            formData.correct_index,
                            e.target.value - 1
                          ),
                        });
                      }}
                    >
                      <MenuItem value={4}>4 Alternativas</MenuItem>
                      <MenuItem value={5}>5 Alternativas</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Banca"
                  fullWidth
                  value={formData.banca}
                  onChange={(e) =>
                    setFormData({ ...formData, banca: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Ano"
                  type="number"
                  fullWidth
                  value={formData.ano}
                  onChange={(e) =>
                    setFormData({ ...formData, ano: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Dificuldade</InputLabel>
                  <Select
                    value={formData.dificuldade}
                    label="Dificuldade"
                    onChange={(e) =>
                      setFormData({ ...formData, dificuldade: e.target.value })
                    }
                  >
                    <MenuItem value="facil">Fácil</MenuItem>
                    <MenuItem value="medio">Médio</MenuItem>
                    <MenuItem value="dificil">Difícil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Matéria</InputLabel>
                  <Select
                    value={formData.materia_id}
                    label="Matéria"
                    onChange={(e) =>
                      setFormData({ ...formData, materia_id: e.target.value })
                    }
                  >
                    {materias.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Concurso</InputLabel>
                  <Select
                    value={formData.concurso_id}
                    label="Concurso"
                    onChange={(e) =>
                      setFormData({ ...formData, concurso_id: e.target.value })
                    }
                  >
                    <MenuItem value="">Nenhum</MenuItem>
                    {concursos.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Alternativas
            </Typography>
            {formData.choices.map((choice, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  fullWidth
                  label={
                    formData.type === "tf"
                      ? index === 0
                        ? "Certo"
                        : "Errado"
                      : `Alternativa ${String.fromCharCode(65 + index)}`
                  }
                  value={choice}
                  disabled={formData.type === "tf"}
                  onChange={(e) => {
                    const newChoices = [...formData.choices];
                    newChoices[index] = e.target.value;
                    setFormData({ ...formData, choices: newChoices });
                  }}
                />
                <Button
                  variant={
                    formData.correct_index === index ? "contained" : "outlined"
                  }
                  color="success"
                  onClick={() =>
                    setFormData({ ...formData, correct_index: index })
                  }
                >
                  Correta
                </Button>
              </Box>
            ))}

            <TextField
              label="Explicação / Comentário"
              multiline
              rows={3}
              fullWidth
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
