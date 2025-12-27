import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Faq() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Perguntas Frequentes
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Preciso pagar para usar o Quiz Concursos?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Sim. Após o cadastro, é necessário contratar um plano ou curso para
              acessar o conteúdo, exceto durante o período trial, quando disponível.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Quais planos estão disponíveis?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Oferecemos planos Trial, Semanal, Mensal e Anual, além de cursos
              específicos.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Posso cancelar meu plano?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Sim, o cancelamento pode ser feito conforme as regras descritas nos
              Termos de Uso.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>As questões são atualizadas?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Sim. Nosso banco de questões passa por atualizações constantes.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
