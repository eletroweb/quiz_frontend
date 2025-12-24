import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { People, Quiz, School, Assessment } from '@mui/icons-material';
import api from '../../services/api';

const STAT_CONFIG = [
  { key: 'users', title: 'Total de Usuários', icon: People, color: '#6366f1', bgColor: '#e0e7ff' },
  { key: 'questions', title: 'Total de Questões', icon: Quiz, color: '#10b981', bgColor: '#d1fae5' },
  { key: 'subjects', title: 'Total de Matérias', icon: School, color: '#f59e0b', bgColor: '#fef3c7' },
  { key: 'contests', title: 'Total de Concursos', icon: Assessment, color: '#ec4899', bgColor: '#fce7f3' },
];

const ENDPOINTS = {
  users: '/users',
  questions: '/questoes',
  subjects: '/materias',
  contests: '/concursos',
};

const initialStats = { total_users: 0, total_questions: 0, total_subjects: 0, total_contests: 0 };

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, questionsRes, subjectsRes, contestsRes] = await Promise.all([
        api.get(ENDPOINTS.users),
        api.get(ENDPOINTS.questions),
        api.get(ENDPOINTS.subjects),
        api.get(ENDPOINTS.contests),
      ]);

      setStats({
        total_users: usersRes.data.length,
        total_questions: questionsRes.data.length,
        total_subjects: subjectsRes.data.length,
        total_contests: contestsRes.data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const Header = () => (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Dashboard Administrativo
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
        Visão geral da plataforma
      </Typography>
    </Paper>
  );

  const StatCard = ({ config }) => {
    const { title, icon: Icon, color, bgColor } = config;
    const value = stats[`total_${config.key}`];

    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
        }}
      >
        <CardContent>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              mb: 2,
            }}
          >
            <Icon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {loading ? '…' : value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Header />
      <Grid container spacing={3}>
        {STAT_CONFIG.map((cfg) => (
          <Grid item xs={12} sm={6} md={3} key={cfg.key}>
            <StatCard config={cfg} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
