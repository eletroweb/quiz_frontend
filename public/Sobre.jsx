import { Box, Container, Typography, Paper } from '@mui/material';

export default function Sobre() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Sobre Nós
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={2}>
            O <strong>Quiz Concursos</strong> nasceu com o objetivo de tornar a
            preparação para concursos públicos mais eficiente, prática e
            acessível. Acreditamos que a resolução de questões é o método mais
            eficaz para fixar conteúdos e entender o perfil das bancas
            examinadoras.
          </Typography>

          <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={2}>
            Nossa plataforma foi desenvolvida para ajudar estudantes a
            organizarem seus estudos, identificarem pontos de melhoria e
            acompanharem sua evolução ao longo do tempo, sempre com foco na
            aprovação.
          </Typography>

          <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
            Trabalhamos continuamente para oferecer um ambiente simples,
            intuitivo e atualizado, permitindo que o aluno estude de forma
            estratégica e otimizada, independentemente do nível de conhecimento.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
