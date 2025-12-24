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

  const loadUserCourses = useCallback(async () => {
    setLoading(true);
    const response = await api.get("/cursos/user-courses").then(r => r).catch(() => null);
    if (response && Array.isArray(response.data)) {
      setUserCourses(response.data);
      const first = response.data[0];
      if (first) {
        setSelectedCurso(first);
        const matRes = await api.get(`/cursos/curso-materias/${first.id}`).then(r => r).catch(() => null);
        if (matRes && Array.isArray(matRes.data)) {
          setMaterias(matRes.data);
          const firstMat = matRes.data[0];
          if (firstMat) {
            setSelectedMateria(firstMat.id);
            const contRes = await api.get(`/conteudos?materia_id=${firstMat.id}`).then(r => r).catch(() => null);
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
        const matRes2 = await api.get(`/cursos/curso-materias/${first2.id}`).then(r => r).catch(() => null);
        if (matRes2 && Array.isArray(matRes2.data)) {
          setMaterias(matRes2.data);
          const firstMat2 = matRes2.data[0];
          if (firstMat2) {
            setSelectedMateria(firstMat2.id);
            const contRes2 = await api.get(`/conteudos?materia_id=${firstMat2.id}`).then(r => r).catch(() => null);
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
      setMaterias(response.data);
      if (response.data.length > 0) {
        setSelectedMateria(response.data[0].id);
        loadConteudos(response.data[0].id);
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
    setMobileMenuOpen(false);
    loadCursoMaterias(curso.id);
  };

  const handleMateriaChange = (materia) => {
    setSelectedMateria(materia.id);
    setSelectedConteudo(null);
    loadConteudos(materia.id);
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
        </Box>

        <List sx={{ overflow: "auto", flex: 1 }}>
          {(userCourses.length > 0 ? userCourses : cursos).map((curso) => (
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
                      onClick={() => setSelectedConteudo(null)}
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
                            onClick={() => setSelectedConteudo(conteudo)}
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
