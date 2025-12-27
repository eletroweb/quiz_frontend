import { Box, Container, Typography, Grid, Paper } from '@mui/material';

export default function ComoFunciona() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        {/* Título */}
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Como Funciona
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.7}>
          O <strong>Quiz Concursos</strong> é uma plataforma digital desenvolvida
          para auxiliar candidatos a concursos públicos em todas as etapas da
          preparação, com foco no método mais eficiente de estudo:
          <strong> a resolução de questões</strong>.
        </Typography>

        <Grid container spacing={3}>
          {/* Passo 1 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                1. Crie seu cadastro
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                Para utilizar a plataforma, o primeiro passo é realizar o
                cadastro gratuito. Com a conta criada, o aluno passa a ter
                acesso ao ambiente da plataforma, podendo visualizar os planos,
                conhecer os cursos disponíveis e gerenciar seus dados de acesso.
              </Typography>
            </Paper>
          </Grid>

          {/* Passo 2 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                2. Escolha um plano ou curso
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.7}>
                Após o cadastro, é necessário associar a conta a um plano ou
                curso para liberar o acesso ao conteúdo da plataforma.
              </Typography>

              <Typography variant="body2" color="text.secondary" component="div" lineHeight={1.7}>
                A plataforma oferece diferentes opções:
                <ul>
                  <li><strong>Plano Trial:</strong> ideal para conhecer a plataforma por um período limitado.</li>
                  <li><strong>Plano Semanal:</strong> indicado para revisões rápidas ou estudos pontuais.</li>
                  <li><strong>Plano Mensal:</strong> perfeito para quem busca constância nos estudos.</li>
                  <li><strong>Plano Anual:</strong> a opção mais completa, com melhor custo-benefício.</li>
                </ul>
                Além dos planos, o aluno também pode adquirir cursos específicos,
                focados em disciplinas ou concursos determinados.
              </Typography>
            </Paper>
          </Grid>

          {/* Passo 3 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                3. Estude resolvendo questões
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                Com o plano ou curso ativo, o aluno pode resolver questões
                organizadas por matéria, assunto, banca examinadora e nível de
                dificuldade, além de realizar simulados e revisões estratégicas.
              </Typography>
            </Paper>
          </Grid>

          {/* Passo 4 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                4. Acompanhe seu desempenho
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                A plataforma registra o progresso do aluno, permitindo acompanhar
                estatísticas, identificar pontos fortes e fracos e ajustar a
                estratégia de estudo ao longo da preparação.
              </Typography>
            </Paper>
          </Grid>

          {/* Passo 5 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                5. Prepare-se com mais eficiência
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                O Quiz Concursos foi desenvolvido para otimizar o tempo de estudo
                e aumentar o rendimento do aluno, oferecendo uma experiência
                prática, organizada e focada na aprovação em concursos públicos.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
