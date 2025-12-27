import { Box, Container, Typography, Paper } from '@mui/material';

export default function Termos() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Termos de Uso
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8} mb={2}>
            Ao acessar e utilizar a plataforma <strong>Quiz Concursos</strong>,
            o usuário concorda com os presentes Termos de Uso.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            1. Cadastro
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            Para utilizar os serviços, é necessário realizar o cadastro,
            fornecendo informações verdadeiras e atualizadas.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            2. Planos e Acesso
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            O acesso ao conteúdo está condicionado à contratação de um plano ou
            curso ativo, respeitando o período de vigência contratado.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            3. Uso da Plataforma
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            É proibida a reprodução, distribuição ou comercialização do conteúdo
            sem autorização expressa.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
            4. Cancelamento
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            O usuário pode cancelar o plano conforme as regras descritas na
            plataforma, respeitando os termos contratados.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
