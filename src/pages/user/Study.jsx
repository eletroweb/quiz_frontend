import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  PlayCircle,
  PictureAsPdf,
  Article,
  ExpandMore,
  School,
  LibraryBooks,
  CheckCircle,
  ArrowBack,
  Menu as MenuIcon,
  LiveTv,
  MenuBook,
  HelpOutline,
  SupportAgent,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import api from "../../services/api";

export default function Study() {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [conteudos, setConteudos] = useState([]);
  const [selectedConteudo, setSelectedConteudo] = useState(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [quizError, setQuizError] = useState("");

  const normalizeMaterias = (rows) => {
    if (!Array.isArray(rows)) return [];
    const map = new Map();
    rows.forEach((row) => {
      const materiaId = row?.materia_id ?? row?.id;
      const materiaNome = row?.materia_nome ?? row?.nome;
      if (!materiaId || !materiaNome) return;
      if (!map.has(materiaId)) {
        map.set(materiaId, { id: materiaId, nome: materiaNome });
      }
    });
    return Array.from(map.values());
  };

  const loadUserCourses = useCallback(async () => {
    setLoading(true);
    const response = await api.get("/cursos/user-courses").then(r => r).catch(() => null);
    if (response && Array.isArray(response.data)) {
      setUserCourses(response.data);
      const first = response.data[0];
      if (first) {
        setSelectedCurso(first);
        const matRes = await api
          .get(`/cursos/curso-materias/${first.id}`)
          .then((r) => r)
          .catch(() => null);
        if (matRes && Array.isArray(matRes.data)) {
          const normalized = normalizeMaterias(matRes.data);
          setMaterias(normalized);
          const firstMat = normalized[0];
          if (firstMat) {
            setSelectedMateria(firstMat.id);
            const contRes = await api
              .get(`/conteudos?materia_id=${firstMat.id}`)
              .then((r) => r)
              .catch(() => null);
            if (contRes && Array.isArray(contRes.data)) {
              setConteudos(contRes.data);
              setSelectedConteudo(null);
            }
          }
        }
        setLoading(false);
        return;
      }
    }
    const response2 = await api.get("/cursos").then(r => r).catch(() => null);
    if (response2 && Array.isArray(response2.data)) {
      setCursos(response2.data);
      const first2 = response2.data[0];
      if (first2) {
        setSelectedCurso(first2);
        const matRes2 = await api
          .get(`/cursos/curso-materias/${first2.id}`)
          .then((r) => r)
          .catch(() => null);
        if (matRes2 && Array.isArray(matRes2.data)) {
          const normalized = normalizeMaterias(matRes2.data);
          setMaterias(normalized);
          const firstMat2 = normalized[0];
          if (firstMat2) {
            setSelectedMateria(firstMat2.id);
            const contRes2 = await api
              .get(`/conteudos?materia_id=${firstMat2.id}`)
              .then((r) => r)
              .catch(() => null);
            if (contRes2 && Array.isArray(contRes2.data)) {
              setConteudos(contRes2.data);
              setSelectedConteudo(null);
            }
          }
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserCourses();
  }, [loadUserCourses]);

  

  

  const loadCursoMaterias = async (cursoId) => {
    try {
      const response = await api.get(`/cursos/curso-materias/${cursoId}`);
      const normalized = normalizeMaterias(response.data);
      setMaterias(normalized);
      if (normalized.length > 0) {
        setSelectedMateria(normalized[0].id);
        loadConteudos(normalized[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar matérias do curso:", error);
    }
  };

  const loadConteudos = async (materiaId) => {
    try {
      const response = await api.get(`/conteudos?materia_id=${materiaId}`);
      setConteudos(response.data);
      setSelectedConteudo(null);
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const filteredConteudos = conteudos.filter((c) => {
    if (tab === 0) return c.tipo === "video";
    if (tab === 1) return c.tipo === "pdf";
    if (tab === 2) return c.tipo === "texto";
    return true;
  });

  const handleCursoChange = (curso) => {
    setSelectedCurso(curso);
    setSelectedConteudo(null);
    setLessonCompleted(false);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
    setShowAllCourses(false);
    setMobileMenuOpen(false);
    loadCursoMaterias(curso.id);
  };

  const handleMateriaChange = (materia) => {
    setSelectedMateria(materia.id);
    setSelectedConteudo(null);
    setLessonCompleted(false);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
    setTab(0);
    loadConteudos(materia.id);
  };

  const handleConteudoSelect = (conteudo) => {
    setSelectedConteudo(conteudo);
    setLessonCompleted(false);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
  };

  const handleConteudoBack = () => {
    setSelectedConteudo(null);
    setLessonCompleted(false);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
  };

  const visibleCourses = showAllCourses
    ? (userCourses.length > 0 ? userCourses : cursos)
    : (selectedCurso ? [selectedCurso] : []);

  const loadQuizForMateria = async (materiaId) => {
    if (!materiaId) return;
    setQuizLoading(true);
    setQuizError("");
    try {
      const res = await api.get(`/questoes?materia_id=${materiaId}&limit=3`);
      const items = Array.isArray(res.data) ? res.data : [];
      const normalized = items.map((q) => ({
        ...q,
        choices: Array.isArray(q.choices)
          ? q.choices
          : typeof q.choices === "string"
            ? JSON.parse(q.choices)
            : [],
      }));
      setQuizQuestions(normalized.slice(0, 3));
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
      setQuizError("Não foi possível carregar o quiz desta matéria.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleLessonComplete = () => {
    const materiaId = selectedConteudo?.materia_id || selectedMateria;
    setLessonCompleted(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
    loadQuizForMateria(materiaId);
  };

  const handleQuizAnswerChange = (questionId, selectedIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (quizQuestions.length === 0) return;
    const unanswered = quizQuestions.filter(
      (q) => quizAnswers[q.id] === undefined
    );
    if (unanswered.length > 0) {
      setQuizError("Responda todas as 3 questões para finalizar.");
      return;
    }
    setQuizError("");
    const total = quizQuestions.length;
    const correct = quizQuestions.reduce((acc, q) => {
      return acc + (Number(quizAnswers[q.id]) === Number(q.correct_index) ? 1 : 0);
    }, 0);
    setQuizScore({ correct, total });
    setQuizSubmitted(true);

    try {
      await Promise.all(
        quizQuestions.map((q) =>
          api.post("/stats/answer", {
            questao_id: q.id,
            selected_index: Number(quizAnswers[q.id]),
            correct: Number(quizAnswers[q.id]) === Number(q.correct_index),
          })
        )
      );
    } catch (error) {
      console.error("Erro ao registrar respostas do quiz:", error);
    }
  };

  const handleRetryQuiz = () => {
    const materiaId = selectedConteudo?.materia_id || selectedMateria;
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizError("");
    loadQuizForMateria(materiaId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 100px)",
        gap: 2,
        p: 2,
        bgcolor: "#f5f7fa",
      }}
    >
      {/* MENU LATERAL - CURSOS */}
      <Paper
        sx={{
          width: { xs: "0", md: "280px" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          maxHeight: "calc(100vh - 120px)",
          overflow: "auto",
          borderRadius: 2,
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <School />
            <Typography variant="h6">Meus Cursos</Typography>
          </Box>
          {!showAllCourses && (
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1, borderColor: "rgba(255,255,255,0.7)", color: "white" }}
              onClick={() => setShowAllCourses(true)}
            >
              Trocar curso
            </Button>
          )}
        </Box>

        <List sx={{ overflow: "auto", flex: 1 }}>
          {visibleCourses.map((curso) => (
            <ListItemButton
              key={curso.id}
              selected={selectedCurso?.id === curso.id}
              onClick={() => handleCursoChange(curso)}
              sx={{
                borderLeft:
                  selectedCurso?.id === curso.id ? "4px solid #667eea" : "none",
                pl: selectedCurso?.id === curso.id ? "12px" : 2,
                mb: 1,
                mx: 1,
                borderRadius: 1,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
                "&.Mui-selected": {
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  "&:hover": { bgcolor: "rgba(102, 126, 234, 0.15)" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LibraryBooks fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={curso.nome || curso.title}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: selectedCurso?.id === curso.id ? 600 : 500,
                }}
                secondary={`${materias.length} matérias`}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* CONTEÚDO PRINCIPAL */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* HEADER */}
        <Paper sx={{ p: 2, borderRadius: 2, background: "white" }}>
          {loading && <LinearProgress />}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {selectedCurso?.nome ||
                  selectedCurso?.title ||
                  "Selecione um Curso"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedMateria &&
                  `${materias.length} matérias • ${conteudos.length} conteúdos`}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<MenuIcon />}
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              Cursos
            </Button>
          </Box>
        </Paper>

        {/* MOBILE MENU - CURSOS */}
        <Dialog
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Meus Cursos</DialogTitle>
          <DialogContent>
            <List>
              {(userCourses.length > 0 ? userCourses : cursos).map((curso) => (
                <ListItemButton
                  key={curso.id}
                  selected={selectedCurso?.id === curso.id}
                  onClick={() => handleCursoChange(curso)}
                >
                  <ListItemIcon>
                    <LibraryBooks />
                  </ListItemIcon>
                  <ListItemText
                    primary={curso.nome || curso.title}
                    secondary={`${materias.length} matérias`}
                  />
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
        </Dialog>

        {/* GRID PRINCIPAL */}
        <Grid container spacing={2} sx={{ flex: 1 }}>
          {/* MENU MATÉRIAS - LEFT SIDEBAR */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                borderRadius: 2,
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LibraryBooks fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Matérias
                  </Typography>
                </Box>
              </Box>
              <List sx={{ p: 1 }}>
                {materias.map((materia) => (
                  <ListItemButton
                    key={materia.id}
                    selected={selectedMateria === materia.id}
                    onClick={() => handleMateriaChange(materia)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      transition: "all 0.2s",
                      borderLeft:
                        selectedMateria === materia.id
                          ? "3px solid #667eea"
                          : "none",
                      pl: selectedMateria === materia.id ? "13px" : 2,
                      "&.Mui-selected": {
                        bgcolor: "rgba(102, 126, 234, 0.08)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={materia.nome}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: selectedMateria === materia.id ? 600 : 500,
                      }}
                      secondary={
                        <Chip
                          label={`${
                            conteudos.filter((c) => c.materia_id === materia.id)
                              .length
                          } itens`}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* CONTEÚDO - CENTER/RIGHT */}
          <Grid item xs={12} md={selectedConteudo ? 9 : 9}>
            <Paper sx={{ borderRadius: 2, p: 3, height: "100%" }}>
              {selectedConteudo ? (
                <Box>
                  {/* HEADER CONTEÚDO */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={handleConteudoBack}
                      sx={{ textTransform: "none" }}
                    >
                      Voltar
                    </Button>
                    <Chip
                      icon={
                        selectedConteudo.tipo === "video" ? (
                          <PlayCircle />
                        ) : selectedConteudo.tipo === "pdf" ? (
                          <PictureAsPdf />
                        ) : (
                          <Article />
                        )
                      }
                      label={selectedConteudo.tipo.toUpperCase()}
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {selectedConteudo.titulo}
                  </Typography>

                  {/* VÍDEO */}
                  {selectedConteudo.tipo === "video" &&
                    selectedConteudo.youtube_url && (
                      <Box
                        sx={{
                          position: "relative",
                          paddingBottom: "56.25%",
                          height: 0,
                          overflow: "hidden",
                          borderRadius: 2,
                          mt: 2,
                          mb: 3,
                          bgcolor: "#000",
                        }}
                      >
                        <iframe
                          src={getYouTubeEmbedUrl(selectedConteudo.youtube_url)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </Box>
                    )}

                  {/* PDF */}
                  {selectedConteudo.tipo === "pdf" &&
                    selectedConteudo.file_url && (
                      <Box sx={{ mt: 2, mb: 3 }}>
                        <Button
                          variant="contained"
                          startIcon={<PictureAsPdf />}
                          href={selectedConteudo.file_url}
                          target="_blank"
                          fullWidth
                        >
                          Abrir PDF
                        </Button>
                      </Box>
                    )}

                  {/* TEXTO */}
                  {selectedConteudo.tipo === "texto" &&
                    selectedConteudo.conteudo && (
                      <Box
                        sx={{
                          mt: 3,
                          "& h1, & h2, & h3": { mt: 2, mb: 1 },
                          "& p": { mb: 1.5, lineHeight: 1.7 },
                        }}
                      >
                        <ReactMarkdown>
                          {selectedConteudo.conteudo}
                        </ReactMarkdown>
                      </Box>
                    )}

                  <Box sx={{ mt: 3 }}>
                    {!lessonCompleted ? (
                      <Button
                        variant="contained"
                        onClick={handleLessonComplete}
                        sx={{ textTransform: "none" }}
                      >
                        Concluir aula e fazer quiz
                      </Button>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Quiz rápido (3 questões)
                        </Typography>
                        {quizLoading && <LinearProgress sx={{ mb: 2 }} />}
                        {quizError && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            {quizError}
                          </Alert>
                        )}
                        {quizQuestions.length === 0 && !quizLoading ? (
                          <Alert severity="info">
                            Nenhuma questão encontrada para esta matéria.
                          </Alert>
                        ) : (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {quizQuestions.map((q, idx) => (
                              <Paper key={q.id} sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  {`Questão ${idx + 1}`}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>{q.text}</Typography>
                                <FormControl component="fieldset" fullWidth>
                                  <RadioGroup
                                    value={quizAnswers[q.id] ?? ""}
                                    onChange={(e) =>
                                      handleQuizAnswerChange(q.id, Number(e.target.value))
                                    }
                                  >
                                    {q.choices.map((choice, cIndex) => {
                                      const isSelected = Number(quizAnswers[q.id]) === cIndex;
                                      const isCorrect = Number(q.correct_index) === cIndex;
                                      const showResult = quizSubmitted && (isSelected || isCorrect);
                                      return (
                                        <FormControlLabel
                                          key={`${q.id}-${cIndex}`}
                                          value={cIndex}
                                          control={<Radio />}
                                          label={choice}
                                          sx={{
                                            alignItems: "flex-start",
                                            ...(showResult && isCorrect && {
                                              bgcolor: "rgba(46, 125, 50, 0.12)",
                                              borderRadius: 1,
                                              px: 1,
                                            }),
                                            ...(showResult && isSelected && !isCorrect && {
                                              bgcolor: "rgba(211, 47, 47, 0.12)",
                                              borderRadius: 1,
                                              px: 1,
                                            }),
                                          }}
                                        />
                                      );
                                    })}
                                  </RadioGroup>
                                </FormControl>
                                {quizSubmitted && q.explanation && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {q.explanation}
                                  </Typography>
                                )}
                              </Paper>
                            ))}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                              {!quizSubmitted ? (
                                <Button variant="contained" onClick={handleSubmitQuiz}>
                                  Enviar respostas
                                </Button>
                              ) : (
                                <>
                                  <Chip
                                    color="success"
                                    label={`Acertos: ${quizScore?.correct ?? 0}/${quizScore?.total ?? 3}`}
                                  />
                                  <Button variant="outlined" onClick={handleRetryQuiz}>
                                    Refazer quiz
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                /* GRID DE CONTEÚDOS */
                <Box>
                  {/* TABS */}
                  <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    sx={{ mb: 3, borderBottom: "1px solid #e0e0e0" }}
                  >
                    <Tab
                      icon={<PlayCircle />}
                      label={`Vídeos (${
                        conteudos.filter((c) => c.tipo === "video").length
                      })`}
                      iconPosition="start"
                    />
                    <Tab
                      icon={<PictureAsPdf />}
                      label={`PDFs (${
                        conteudos.filter((c) => c.tipo === "pdf").length
                      })`}
                      iconPosition="start"
                    />
                    <Tab
                      icon={<Article />}
                      label={`Textos (${
                        conteudos.filter((c) => c.tipo === "texto").length
                      })`}
                      iconPosition="start"
                    />
                  </Tabs>

                  {/* LISTA DE CONTEÚDOS */}
                  {filteredConteudos.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Article
                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                      />
                      <Typography color="text.secondary">
                        Nenhum conteúdo disponível nesta matéria
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {filteredConteudos.map((conteudo) => (
                        <Grid item xs={12} sm={6} lg={4} key={conteudo.id}>
                          <Card
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.3s",
                              height: "100%",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                              },
                            }}
                            onClick={() => handleConteudoSelect(conteudo)}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 1,
                                }}
                              >
                                {conteudo.tipo === "video" && (
                                  <PlayCircle color="primary" />
                                )}
                                {conteudo.tipo === "pdf" && (
                                  <PictureAsPdf color="error" />
                                )}
                                {conteudo.tipo === "texto" && (
                                  <Article color="success" />
                                )}
                                <Chip
                                  label={conteudo.tipo}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                gutterBottom
                              >
                                {conteudo.titulo}
                              </Typography>
                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ textTransform: "none" }}
                                >
                                  Estudar
                                </Button>
                                <CheckCircle
                                  sx={{
                                    color: "success.main",
                                    display: "none",
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export function MaterialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/conteudos");
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data.filter((c) => c.tipo === "pdf"));
      } catch {
        setError("Erro ao carregar materiais.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Apostilas e livros
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && items.length === 0 && (
        <Alert severity="info">Nenhum material encontrado.</Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <PictureAsPdf color="error" />
                  <Chip
                    label={c.materia_nome || "Material"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {c.titulo}
                </Typography>
                {c.descricao && (
                  <Typography variant="body2" color="text.secondary">
                    {c.descricao}
                  </Typography>
                )}
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  href={c.file_url || c.conteudo}
                  target="_blank"
                  disabled={!c.file_url && !c.conteudo}
                >
                  Abrir PDF
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function LiveClassesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/conteudos");
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data.filter((c) => c.tipo === "video"));
      } catch {
        setError("Erro ao carregar aulas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const id = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Aulas ao vivo
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && items.length === 0 && (
        <Alert severity="info">Nenhuma aula encontrada.</Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((c) => (
          <Grid item xs={12} md={6} key={c.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LiveTv color="primary" />
                  <Chip
                    label={c.materia_nome || "Aula"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {c.titulo}
                </Typography>
                {c.descricao && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {c.descricao}
                  </Typography>
                )}
                {c.youtube_url || c.conteudo ? (
                  <Box
                    sx={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                      borderRadius: 2,
                      bgcolor: "#000",
                    }}
                  >
                    <iframe
                      src={getYouTubeEmbedUrl(c.youtube_url || c.conteudo)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function MentoriasPage() {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mentorias
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <SupportAgent color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Acompanhamento personalizado
          </Typography>
        </Box>
        <Typography sx={{ mb: 2 }}>
          Tenha acesso a um plano de estudo guiado, com orientações da equipe do
          Quiz Concursos para organizar sua rotina e acompanhar sua evolução.
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Envie suas dúvidas e receba indicações de aulas, materiais e
          simulados focados no seu objetivo.
        </Typography>
        <Button
          variant="contained"
          startIcon={<SupportAgent />}
          href="mailto:contato@quizconcursos.com?subject=Mentoria%20Quiz%20Concursos"
        >
          Falar com um mentor
        </Button>
      </Paper>
    </Box>
  );
}

export function FaqAlunoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/news?limit=50");
        const data = Array.isArray(res.data) ? res.data : [];
        const filtered = data.filter((n) => {
          const cat = (n.categoria || "").toString().toLowerCase();
          const title = (n.titulo || "").toString().toLowerCase();
          return (
            cat.includes("dúvida") ||
            cat.includes("duvida") ||
            cat.includes("faq") ||
            title.includes("dúvida") ||
            title.includes("duvida")
          );
        });
        setItems(filtered.length > 0 ? filtered : data);
      } catch {
        setError("Erro ao carregar dúvidas frequentes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dúvidas Frequentes
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && items.length === 0 && (
        <Alert severity="info">Nenhum conteúdo encontrado.</Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((n) => (
          <Grid item xs={12} sm={6} md={4} key={n.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <HelpOutline color="primary" />
                  <Chip label={n.categoria || "Geral"} size="small" variant="outlined" />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {n.titulo}
                </Typography>
                {n.resumo && (
                  <Typography variant="body2" color="text.secondary">
                    {n.resumo}
                  </Typography>
                )}
              </CardContent>
              {n.conteudo && (
                <Box sx={{ p: 2, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {n.conteudo}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
