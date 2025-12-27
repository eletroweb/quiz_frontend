import { Box, Container, Typography, Grid, Paper } from '@mui/material';

export default function Blog() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Blog
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Conteúdos, dicas e estratégias para otimizar sua preparação para
          concursos públicos.
        </Typography>

        <Grid container spacing={3}>
          {[1, 2, 3].map((post) => (
            <Grid item xs={12} md={4} key={post}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Como estudar com questões
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Descubra por que a resolução de questões é uma das formas mais
                  eficazes de estudo para concursos.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Em breve
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
