import React from "react";
import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 560, textAlign: "center" }}>
        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Pagamento aprovado
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Seu acesso foi liberado. Você pode começar agora.
        </Typography>
        <Chip label="Status: APROVADO" color="success" sx={{ my: 2 }} />
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/dashboard")}>
            Ir para Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate("/estudar")}>
            Ir para Estudar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
