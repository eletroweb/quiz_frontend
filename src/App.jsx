import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './config/theme';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Questions from './pages/admin/Questions';
import Materias from './pages/admin/Materias';
import Concursos from './pages/admin/Concursos';
import Conteudos from './pages/admin/Conteudos';
import Plans from './pages/admin/Plans';
import Campaigns from './pages/admin/Campaigns';
import Payments from './pages/admin/Payments';
import CursosAdmin from './pages/admin/CursosAdmin';
import CursoEditor from './pages/admin/CursoEditor';
import PlanosConfig from './pages/admin/PlanosConfig';
import Banners from './pages/admin/Banners';
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import Quiz from './pages/user/Quiz';
import Study from './pages/user/Study';
import Simulados from './pages/user/Simulados';
import Ranking from './pages/user/Ranking';
import Planos from './pages/user/Planos';
import Perfil from './pages/user/Perfil';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin, userProfile } = useAuth();

  // Se tem usuário mas não tem perfil ainda, está carregando
  if (currentUser && !userProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  return currentUser && isAdmin ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas Admin */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<Users />} />
        <Route path="questoes" element={<Questions />} />
        <Route path="materias" element={<Materias />} />
        <Route path="concursos" element={<Concursos />} />
        <Route path="conteudos" element={<Conteudos />} />
        <Route path="cursos" element={<CursosAdmin />} />
        <Route path="cursos/:id/editar" element={<CursoEditor />} />
        <Route path="planos" element={<Plans />} />
        <Route path="planos-config" element={<PlanosConfig />} />
        <Route path="campanhas" element={<Campaigns />} />
        <Route path="pagamentos" element={<Payments />} />
        <Route path="banners" element={<Banners />} />
      </Route>

      {/* Rotas do Usuário */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<UserDashboard />} />
      </Route>

      <Route path="/quiz" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Quiz />} />
      </Route>

      <Route path="/estudar" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Study />} />
      </Route>

      <Route path="/simulados" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Simulados />} />
      </Route>

      <Route path="/ranking" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Ranking />} />
      </Route>

      <Route path="/planos" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Planos />} />
      </Route>

      <Route path="/perfil" element={
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      }>
        <Route index element={<Perfil />} />
      </Route>


      {/* Rota padrão */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

import TrialExpiredDialog from './components/TrialExpiredDialog';
import CheckoutDialog from './components/CheckoutDialog';
import api from './services/api';

function App() {
  const [trialExpired, setTrialExpired] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);

  React.useEffect(() => {
    const handleTrialExpired = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data.filter(p => p.active));
        setTrialExpired(true);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      }
    };

    window.addEventListener('trial_expired', handleTrialExpired);
    return () => window.removeEventListener('trial_expired', handleTrialExpired);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />

          <TrialExpiredDialog
            open={trialExpired}
            plans={plans}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setOpenCheckout(true);
            }}
          />

          <CheckoutDialog
            open={openCheckout}
            onClose={() => setOpenCheckout(false)}
            plan={selectedPlan}
            onSuccess={() => {
              setOpenCheckout(false);
              setTrialExpired(false);
              window.location.reload();
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
