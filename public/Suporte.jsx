import { Box, Container, Typography, Paper, Button, Stack } from '@mui/material';

export default function Suporte() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Suporte ao Aluno
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Precisa de ajuda com acesso à plataforma, planos, pagamentos ou
          funcionamento do sistema? Estamos aqui para ajudar.
        </Typography>

        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              🔐 Problemas de Acesso
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Dificuldade para entrar na plataforma, redefinir senha ou acessar
              o conteúdo contratado.
            </Typography>
            <Button variant="outlined">
              Solicitar Ajuda
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              💳 Planos e Pagamentos
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Dúvidas sobre cobrança, renovação, cancelamento ou mudança de plano.
            </Typography>
            <Button variant="outlined">
              Falar com Suporte
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              🛠️ Problemas Técnicos
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Erros no sistema, falhas de carregamento ou funcionamento inesperado.
            </Typography>
            <Button variant="outlined">
              Reportar Problema
            </Button>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
