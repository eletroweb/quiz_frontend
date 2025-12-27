import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import api from "../../services/api";

export default function AdminRolesConfig() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [role, setRole] = useState("user");
  const [permissions, setPermissions] = useState({
    can_create_courses: false,
    can_edit_courses: false,
    can_create_questions: false,
    can_edit_questions: false,
    can_create_materias: false,
    can_edit_materias: false,
    can_create_concursos: false,
    can_edit_concursos: false,
    can_create_conteudos: false,
    can_access_payments: false,
    can_access_users: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user-roles");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarUsuario = async (usuario) => {
    try {
      const response = await api.get(`/user-roles/${usuario.id}`);
      setUsuarioSelecionado(usuario);
      setRole(response.data.role);
      setPermissions(response.data.permissions);
      setOpenDialog(true);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  };

  const handleSalvarPermissoes = async () => {
    // Validar: Curator não pode ter acesso a pagamentos
    if (role === "curator" && permissions.can_access_payments) {
      alert("❌ Curator não pode ter acesso a Pagamentos!");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/user-roles/${usuarioSelecionado.id}`, {
        role,
        permissions,
      });
      alert("✅ Permissões atualizadas com sucesso!");
      carregarUsuarios();
      setOpenDialog(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro ao salvar permissões");
    } finally {
      setSaving(false);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      user: "Usuário comum - Apenas estudar",
      curator: "Curador - Criar/editar conteúdo (sem financeiro)",
      admin: "Administrador - Acesso total",
    };
    return descriptions[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      user: "default",
      curator: "info",
      admin: "error",
    };
    return colors[role] || "default";
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        👥 Gerenciar Permissões de Usuários
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        📌 <strong>Roles Disponíveis:</strong> Usuário (padrão) | Curator (criar
        conteúdo) | Admin (tudo)
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<Add />} variant="outlined" onClick={() => setOpenSearchDialog(true)}>Adicionar usuário</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nome
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Permissões
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : usuarios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  Nenhum usuário com permissões especiais
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id} hover>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell fontWeight="bold">
                    {usuario.display_name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={usuario.role.toUpperCase()}
                      color={getRoleBadgeColor(usuario.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {usuario.role === "curator" && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {usuario.can_create_courses && (
                          <Chip
                            label="Criar Cursos"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {usuario.can_edit_courses && (
                          <Chip
                            label="Editar Cursos"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {usuario.can_create_questions && (
                          <Chip
                            label="Criar Questões"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {usuario.can_create_materias && (
                          <Chip
                            label="Criar Matérias"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                    {usuario.role === "admin" && (
                      <Chip label="Tudo" size="small" color="error" />
                    )}
                    {usuario.role === "user" && (
                      <Chip label="Padrão" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditarUsuario(usuario)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG DE EDIÇÃO */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Permissões</DialogTitle>
        <DialogContent>
          {usuarioSelecionado && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  Usuário
                </Typography>
                <Typography>
                  {usuarioSelecionado.display_name} ({usuarioSelecionado.email})
                </Typography>
              </Box>

              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
              >
                <MenuItem value="user">👤 Usuário (Padrão)</MenuItem>
                <MenuItem value="curator">📝 Curator (Criar Conteúdo)</MenuItem>
                <MenuItem value="admin">🔑 Administrador (Tudo)</MenuItem>
              </TextField>

              <Typography variant="subtitle2" fontWeight="bold">
                Descrição: {getRoleDescription(role)}
              </Typography>

              {role === "curator" && (
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    display="block"
                    mb={1}
                  >
                    ✅ Permissões do Curator (Criador de Conteúdo):
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_create_courses}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_create_courses: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Criar Cursos"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_edit_courses}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_edit_courses: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Editar Cursos"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_create_questions}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_create_questions: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Criar Questões"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_edit_questions}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_edit_questions: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Editar Questões"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_create_materias}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_create_materias: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Criar Matérias"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_edit_materias}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_edit_materias: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Editar Matérias"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_create_concursos}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_create_concursos: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Criar Concursos"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_edit_concursos}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_edit_concursos: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Editar Concursos"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permissions.can_create_conteudos}
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              can_create_conteudos: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Criar Conteúdos"
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 2, color: "error.main" }}
                  >
                    ❌ BLOQUEADO: Acesso a Pagamentos (apenas Admin)
                  </Typography>
                </Box>
              )}

              {role === "admin" && (
                <Box sx={{ bgcolor: "#fff3cd", p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight="bold">
                    🔑 Admin tem acesso TOTAL a todas as áreas, incluindo
                    financeiro
                  </Typography>
                </Box>
              )}

              {role === "user" && (
                <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight="bold">
                    👤 Usuário padrão - apenas acesso ao conteúdo de estudo
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSalvarPermissoes}
            variant="contained"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* DIALOG DE BUSCA/ADICIONAR USUÁRIO */}
      <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar usuário</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              placeholder="Buscar por email ou nome"
              fullWidth
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
            <Button onClick={async () => {
              try {
                setLoading(true);
                const resp = await api.get('/users');
                setAllUsers(resp.data || []);
              } catch (err) {
                console.error('Erro ao buscar usuários:', err);
                setAllUsers([]);
              } finally {
                setLoading(false);
              }
            }}>Buscar</Button>
          </Box>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Plano</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(allUsers || []).filter(u => {
                  if (!userSearchTerm) return true;
                  const t = userSearchTerm.toLowerCase();
                  return (u.email || '').toLowerCase().includes(t) || (u.display_name || '').toLowerCase().includes(t);
                }).map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.display_name || 'Sem nome'}</TableCell>
                    <TableCell>{u.plan || 'Free'}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={async () => {
                        try {
                          setLoading(true);
                          const resp = await api.get(`/user-roles/${u.id}`);
                          setUsuarioSelecionado(u);
                          setRole(resp.data.role || 'user');
                          setPermissions(resp.data.permissions || {});
                          setOpenDialog(true);
                          setOpenSearchDialog(false);
                        } catch (err) {
                          console.error('Erro ao carregar permissões:', err);
                          setUsuarioSelecionado(u);
                          setRole('user');
                          setPermissions({
                            can_create_courses: false,
                            can_edit_courses: false,
                            can_create_questions: false,
                            can_edit_questions: false,
                            can_create_materias: false,
                            can_edit_materias: false,
                            can_create_concursos: false,
                            can_edit_concursos: false,
                            can_create_conteudos: false,
                            can_access_payments: false,
                            can_access_users: false,
                          });
                          setOpenDialog(true);
                          setOpenSearchDialog(false);
                        } finally {
                          setLoading(false);
                        }
                      }}>Selecionar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
