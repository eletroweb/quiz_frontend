import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./config/theme";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Questions from "./pages/admin/Questions";
import Materias from "./pages/admin/Materias";
import Concursos from "./pages/admin/Concursos";
import Conteudos from "./pages/admin/Conteudos";
import Plans from "./pages/admin/Plans";
import Campaigns from "./pages/admin/Campaigns";
import Payments from "./pages/admin/Payments";
import CursosAdmin from "./pages/admin/CursosAdmin";
import CursoEditor from "./pages/admin/CursoEditor";
import PlanosConfig from "./pages/admin/PlanosConfig";
import SiteConfig from "./pages/admin/SiteConfig";
import Banners from "./pages/admin/Banners";
import NewsAdmin from "./pages/admin/NewsAdmin";
import PagamentosHistorico from "./pages/admin/PagamentosHistorico";
import RolesConfig from "./pages/admin/RolesConfig";
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import Quiz from "./pages/user/Quiz";
import Study, {
  MaterialsPage,
  LiveClassesPage,
  MentoriasPage,
  FaqAlunoPage,
} from "./pages/user/Study";
import Simulados from "./pages/user/Simulados";
import Ranking from "./pages/user/Ranking";
import PlanosUser from "./pages/user/Planos";
import PlanosPublic from "./pages/PlanosPublic";
import Perfil from "./pages/user/Perfil";
import Curso from "./pages/user/Curso";
import PaymentSuccess from "./pages/payment/Success";
import PaymentFailure from "./pages/payment/Failure";
import PaymentPending from "./pages/payment/Pending";
import CartPage from "./pages/Cart";
import Sobre from "../public/Sobre";
import Contato from "../public/Contato";
import ComoFunciona from "../public/ComoFunciona";
import Planos from "../public/Planos";
import Blog from "../public/Blog";
import Faq from "../public/Faq"; 
import Suporte from "../public/Suporte";
import Termos from "../public/Termos";
import Politica from "../public/Politica";


function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin, userProfile } = useAuth();

  // Se tem usuário mas não tem perfil ainda, está carregando
  if (currentUser && !userProfile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Carregando...
      </div>
    );
  }

  return currentUser && isAdmin ? children : <Navigate to="/login" />;
}

function CuratorOrAdminRoute({ children }) {
  const { currentUser, isAdmin, userProfile } = useAuth();

  if (currentUser && !userProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  const isCurator = userProfile && userProfile.role === 'curator';

  return currentUser && (isAdmin || isCurator) ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Pagamento - páginas públicas */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />
      <Route path="/payment/pending" element={<PaymentPending />} />

      {/* Rotas Admin */}
      <Route
        path="/admin"
        element={
          <CuratorOrAdminRoute>
            <AdminLayout />
          </CuratorOrAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route
          path="usuarios"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route path="questoes" element={<Questions />} />
        <Route path="materias" element={<Materias />} />
        <Route path="concursos" element={<Concursos />} />
        <Route path="conteudos" element={<Conteudos />} />
        <Route path="cursos" element={<CursosAdmin />} />
        <Route path="cursos/:id/editar" element={<CursoEditor />} />
        <Route
          path="planos"
          element={
            <AdminRoute>
              <Plans />
            </AdminRoute>
          }
        />
        <Route
          path="planos-config"
          element={
            <AdminRoute>
              <PlanosConfig />
            </AdminRoute>
          }
        />
        <Route
          path="site-config"
          element={
            <AdminRoute>
              <SiteConfig />
            </AdminRoute>
          }
        />
        <Route
          path="campanhas"
          element={
            <AdminRoute>
              <Campaigns />
            </AdminRoute>
          }
        />
        <Route
          path="pagamentos"
          element={
            <AdminRoute>
              <Payments />
            </AdminRoute>
          }
        />
        <Route
          path="pagamentos-historico"
          element={
            <AdminRoute>
              <PagamentosHistorico />
            </AdminRoute>
          }
        />
        <Route
          path="roles"
          element={
            <AdminRoute>
              <RolesConfig />
            </AdminRoute>
          }
        />
        <Route
          path="banners"
          element={
            <AdminRoute>
              <Banners />
            </AdminRoute>
          }
        />
        <Route
          path="noticias"
          element={
            <AdminRoute>
              <NewsAdmin />
            </AdminRoute>
          }
        />
      </Route>

      {/* Rotas públicas */}
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/politica" element={<Politica />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/como-funciona" element={<ComoFunciona />} />
      <Route path="/suporte" element={<Suporte />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/central-de-ajuda" element={<Suporte />} />

      {/* Rotas do Usuário */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="planos" element={<PlanosUser />} />
      </Route>

      <Route
        path="/quiz"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Quiz />} />
      </Route>

      <Route
        path="/estudar"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Study />} />
      </Route>

      <Route
        path="/apostilas"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<MaterialsPage />} />
      </Route>

      <Route
        path="/aulas-ao-vivo"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<LiveClassesPage />} />
      </Route>

      <Route
        path="/mentorias"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<MentoriasPage />} />
      </Route>

      <Route
        path="/duvidas-frequentes"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<FaqAlunoPage />} />
      </Route>

      <Route
        path="/simulados"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Simulados />} />
      </Route>

      <Route
        path="/ranking"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Ranking />} />
      </Route>

      <Route path="/planos" element={<PlanosPublic />} />

      <Route path="/cart" element={<CartPage />} />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Perfil />} />
      </Route>

      <Route
        path="/curso/:id"
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Curso />} />
      </Route>

      {/* Rota padrão */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

import TrialExpiredDialog from "./components/TrialExpiredDialog";
import CheckoutDialog from "./components/CheckoutDialog";
import api from "./services/api";

function App() {
  const [trialExpired, setTrialExpired] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);

  React.useEffect(() => {
    const handleTrialExpired = async () => {
      try {
        const response = await api.get("/plans");
        setPlans(response.data.filter((p) => p.active));
        setTrialExpired(true);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
      }
    };

    window.addEventListener("trial_expired", handleTrialExpired);
    return () =>
      window.removeEventListener("trial_expired", handleTrialExpired);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
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
