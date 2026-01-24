import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, IconButton, Grid } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, CheckCircle, TrendingUp, EmojiEvents } from "@mui/icons-material";
import api from "../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get("/banners/ativos");
      const data = Array.isArray(response.data) ? response.data : [];
      setBanners(data.filter((b) => b.tipo === "hero"));
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const defaultBanner = {
    titulo: "Prepare-se para Concursos Públicos",
    descricao: "A sua plataforma completa para alcançar a aprovação com questões, simulados e cursos focados.",
    texto_botao: "Começar Agora",
    imagem_url: null,
  };

  const banner = banners.length > 0 ? banners[currentBanner] : defaultBanner;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "500px", md: "600px" },
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
        overflow: "hidden",
        pt: { xs: 10, md: 0 },
      }}
    >
      {/* Elementos Decorativos Modernos */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.2)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: "500px", py: 4 }}>
          {/* Texto do Banner */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                animation: "fadeInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Badge Superior */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 3,
                  py: 1,
                  mb: 3,
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                }}
              >
                <CheckCircle sx={{ fontSize: 18 }} />
                Plataforma #1 em Aprovações
              </Box>

              {/* Título */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "var(--font-display)",
                  color: "white",
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3rem", lg: "3.5rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {banner.titulo}
              </Typography>

              {/* Descrição */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 4,
                  fontSize: { xs: "var(--text-base)", md: "var(--text-lg)" },
                  lineHeight: 1.7,
                  fontWeight: 400,
                  maxWidth: "500px",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                {banner.descricao}
              </Typography>

              {/* Botões */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    if (banner.link_url) {
                      const validRoutes = ["/login", "/quiz", "/estudar", "/simulados", "/ranking", "/planos", "/perfil", "/dashboard"];
                      const isValidRoute = validRoutes.includes(banner.link_url) || banner.link_url.startsWith("/curso/");

                      if (banner.link_url.startsWith("http")) {
                        window.location.href = banner.link_url;
                      } else if (isValidRoute) {
                        navigate(banner.link_url);
                      } else {
                        console.warn(`⚠️ Rota inválida no banner: ${banner.link_url}`);
                        navigate("/login");
                      }
                    } else {
                      navigate("/login");
                    }
                  }}
                  sx={{
                    background: "white",
                    color: "var(--color-primary)",
                    px: 5,
                    py: 1.8,
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    borderRadius: "var(--radius-lg)",
                    textTransform: "none",
                    boxShadow: "var(--shadow-xl)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.95)",
                      transform: "translateY(-2px)",
                      boxShadow: "var(--shadow-2xl)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {banner.texto_botao || "Começar Agora"}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/planos")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.8,
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    borderRadius: "var(--radius-lg)",
                    textTransform: "none",
                    borderWidth: "2px",
                    "&:hover": {
                      borderColor: "white",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderWidth: "2px",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Ver Planos
                </Button>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  mt: 5,
                  pt: 4,
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {[
                  { value: "10.000+", label: "Questões" },
                  { value: "5.000+", label: "Aprovados" },
                  { value: "98%", label: "Satisfação" },
                ].map((stat, idx) => (
                  <Box key={idx} sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-2xl)",
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "var(--text-xs)",
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Imagem do Banner */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {banner.imagem_url ? (
                <Box
                  component="img"
                  src={
                    banner.imagem_url?.startsWith("http")
                      ? banner.imagem_url
                      : `${API_BASE_URL}${banner.imagem_url}`
                  }
                  alt={banner.titulo}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "450px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                    borderRadius: "var(--radius-xl)",
                  }}
                />
              ) : (
                // Cards Flutuantes (quando não há imagem)
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                  <Box
                    sx={{
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      p: 3,
                      color: "white",
                      boxShadow: "var(--shadow-xl)",
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "var(--text-lg)", mb: 0.5 }}>
                      Evolução Garantida
                    </Typography>
                    <Typography sx={{ fontSize: "var(--text-sm)", opacity: 0.9 }}>
                      Acompanhe seu progresso em tempo real
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      background: "rgba(16, 185, 129, 0.2)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      p: 3,
                      color: "white",
                      boxShadow: "var(--shadow-xl)",
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "var(--text-lg)", mb: 0.5 }}>
                      Ranking Nacional
                    </Typography>
                    <Typography sx={{ fontSize: "var(--text-sm)", opacity: 0.9 }}>
                      Compare-se com milhares de candidatos
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Navegação do Carrossel */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 10, md: 40 },
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 10, md: 40 },
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </>
      )}
    </Box>
  );
}

export default HeroSection;
