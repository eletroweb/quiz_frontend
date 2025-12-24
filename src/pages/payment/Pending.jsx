import React from "react";
import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import { Pending } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function PaymentPending() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 560, textAlign: "center" }}>
        <Pending color="warning" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Pagamento pendente
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Estamos aguardando a confirmação. Você será notificado assim que aprovado.
        </Typography>
        <Chip label="Status: PENDENTE" color="warning" sx={{ my: 2 }} />
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/dashboard")}>
            Ir para Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate("/planos")}>
            Ver Planos
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
