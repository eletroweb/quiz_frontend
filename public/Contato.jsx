import { Box, Container, Typography, Paper, TextField, Button } from '@mui/material';

export default function Contato() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Fale Conosco
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Tem alguma dúvida, sugestão ou deseja falar com a equipe do Quiz Concursos?
          Preencha o formulário abaixo e entraremos em contato.
        </Typography>

        <Paper sx={{ p: 4 }}>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
          />

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Assunto"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Mensagem"
            multiline
            rows={4}
            margin="normal"
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Enviar Mensagem
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
