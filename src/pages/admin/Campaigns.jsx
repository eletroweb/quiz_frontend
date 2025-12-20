import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete, Upload, Image } from "@mui/icons-material";
import api from "../../services/api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner_url: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    active: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const response = await api.get("/campaigns");
      setCampaigns(response.data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  }

  function handleOpen(campaign = null) {
    if (campaign) {
      setCurrentCampaign(campaign);
      setFormData({
        title: campaign.title,
        description: campaign.description || "",
        banner_url: campaign.banner_url || "",
        discount_percentage: campaign.discount_percentage || "",
        start_date: campaign.start_date
          ? campaign.start_date.split("T")[0]
          : "",
        end_date: campaign.end_date ? campaign.end_date.split("T")[0] : "",
        active: campaign.active,
      });
    } else {
      setCurrentCampaign(null);
      setFormData({
        title: "",
        description: "",
        banner_url: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        active: true,
      });
    }
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setCurrentCampaign(null);
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // ⚠️ NOTA: Use o Cloudinary diretamente
      // Endpoint de upload não está configurado no backend
      alert(
        'ℹ️ Recomendado: Use o URL do Cloudinary diretamente.\n\n✅ Como fazer:\n1. Acesse https://cloudinary.com\n2. Faça upload da imagem\n3. Copie a URL\n4. Cole no campo "URL do Cloudinary" abaixo'
      );
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    try {
      if (currentCampaign) {
        await api.put(`/campaigns/${currentCampaign.id}`, formData);
      } else {
        await api.post("/campaigns", formData);
      }
      loadCampaigns();
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
      alert("Erro ao salvar campanha");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja remover esta campanha?")) {
      try {
        await api.delete(`/campaigns/${id}`);
        loadCampaigns();
      } catch (error) {
        console.error("Erro ao remover campanha:", error);
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Campanhas Promocionais</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Nova Campanha
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Banner</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Desconto (%)</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Fim</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  {campaign.banner_url ? (
                    <Avatar
                      src={campaign.banner_url}
                      variant="rounded"
                      sx={{ width: 60, height: 40 }}
                    >
                      <Image />
                    </Avatar>
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 60, height: 40 }}>
                      <Image />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{campaign.title}</TableCell>
                <TableCell>
                  {campaign.discount_percentage
                    ? `${campaign.discount_percentage}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  {new Date(campaign.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(campaign.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={campaign.active ? "Ativa" : "Inativa"}
                    color={campaign.active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpen(campaign)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(campaign.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCampaign ? "Editar Campanha" : "Nova Campanha"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Título da Campanha"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />

            {/* Upload de Banner */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Banner da Campanha
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  disabled={uploadingImage}
                  size="small"
                >
                  {uploadingImage ? "Enviando..." : "Upload Local"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  ou
                </Typography>
              </Box>
              <TextField
                label="URL do Cloudinary"
                placeholder="https://res.cloudinary.com/..."
                value={formData.banner_url}
                onChange={(e) =>
                  setFormData({ ...formData, banner_url: e.target.value })
                }
                fullWidth
                size="small"
                helperText="Cole o link completo da imagem do Cloudinary"
              />
              {formData.banner_url && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={formData.banner_url}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      console.error("Erro ao carregar imagem:", e);
                    }}
                  />
                </Box>
              )}
            </Box>

            <TextField
              label="Desconto (%)"
              type="number"
              value={formData.discount_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_percentage: e.target.value,
                })
              }
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Data de Início"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Data de Fim"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Campanha Ativa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
