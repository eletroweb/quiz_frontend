import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CampaignIcon from "@mui/icons-material/Campaign";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import HistoryIcon from "@mui/icons-material/History";
import SecurityIcon from "@mui/icons-material/Security";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, userProfile } = useAuth();

  const isCurator = userProfile && userProfile.role === "curator";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Questões",
      icon: <QuestionAnswerIcon />,
      path: "/admin/questoes",
      visible: isAdmin || isCurator,
    },
    {
      text: "Matérias",
      icon: <SchoolIcon />,
      path: "/admin/materias",
      visible: isAdmin || isCurator,
    },
    {
      text: "Concursos",
      icon: <SchoolIcon />,
      path: "/admin/concursos",
      visible: isAdmin || isCurator,
    },
    {
      text: "Conteúdos",
      icon: <SchoolIcon />,
      path: "/admin/conteudos",
      visible: isAdmin || isCurator,
    },
    {
      text: "Cursos",
      icon: <MenuBookIcon />,
      path: "/admin/cursos",
      visible: isAdmin || isCurator,
    },
    {
      text: "Usuários",
      icon: <PeopleIcon />,
      path: "/admin/usuarios",
      visible: isAdmin,
    },
    {
      text: "Planos",
      icon: <CardMembershipIcon />,
      path: "/admin/planos",
      visible: isAdmin,
    },
    {
      text: "Configuração de Planos",
      icon: <SettingsIcon />,
      path: "/admin/planos-config",
      visible: isAdmin,
    },
    {
      text: "Campanhas",
      icon: <CampaignIcon />,
      path: "/admin/campanhas",
      visible: isAdmin,
    },
    {
      text: "Banners",
      icon: <ImageIcon />,
      path: "/admin/banners",
      visible: isAdmin,
    },
    {
      text: "Site Config",
      icon: <SettingsIcon />,
      path: "/admin/site-config",
      visible: isAdmin,
    },
    {
      text: "Notícias",
      icon: <ArticleIcon />,
      path: "/admin/noticias",
      visible: isAdmin,
    },
    {
      text: "Pagamentos",
      icon: <PaymentIcon />,
      path: "/admin/pagamentos",
      visible: isAdmin,
    },
    {
      text: "📊 Histórico de Pagamentos",
      icon: <HistoryIcon />,
      path: "/admin/pagamentos-historico",
      visible: isAdmin,
    },
    {
      text: "👥 Permissões de Usuários",
      icon: <SecurityIcon />,
      path: "/admin/roles",
      visible: isAdmin,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.visible === undefined || item.visible
  );

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Quiz Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => auth.signOut()}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Painel Administrativo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
