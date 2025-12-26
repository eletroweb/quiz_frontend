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

const drawerWidth = 240;

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Questões", icon: <QuestionAnswerIcon />, path: "/admin/questoes" },
    { text: "Matérias", icon: <SchoolIcon />, path: "/admin/materias" },
    { text: "Concursos", icon: <SchoolIcon />, path: "/admin/concursos" },
    { text: "Conteúdos", icon: <SchoolIcon />, path: "/admin/conteudos" },
    { text: "Cursos", icon: <MenuBookIcon />, path: "/admin/cursos" },
    { text: "Usuários", icon: <PeopleIcon />, path: "/admin/usuarios" },
    { text: "Planos", icon: <CardMembershipIcon />, path: "/admin/planos" },
    {
      text: "Configuração de Planos",
      icon: <SettingsIcon />,
      path: "/admin/planos-config",
    },
    { text: "Campanhas", icon: <CampaignIcon />, path: "/admin/campanhas" },
    { text: "Banners", icon: <ImageIcon />, path: "/admin/banners" },
    { text: "Site Config", icon: <SettingsIcon />, path: "/admin/site-config" },
    { text: "Notícias", icon: <ArticleIcon />, path: "/admin/noticias" },
    { text: "Pagamentos", icon: <PaymentIcon />, path: "/admin/pagamentos" },
    {
      text: "📊 Histórico de Pagamentos",
      icon: <HistoryIcon />,
      path: "/admin/pagamentos-historico",
    },
    {
      text: "👥 Permissões de Usuários",
      icon: <SecurityIcon />,
      path: "/admin/roles",
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Quiz Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
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
