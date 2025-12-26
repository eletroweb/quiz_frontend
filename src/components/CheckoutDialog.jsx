import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  QrCode,
  ContentCopy,
  CheckCircle,
  Timer,
  Close,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

export default function CheckoutDialog({
  open,
  onClose,
  plan,
  course,
}) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [paymentStatus] = useState("pending");
  const [timeLeft, setTimeLeft] = useState(360);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const item = plan || course;
  const type = course ? "course" : "plan";
  const itemName = item?.nome || item?.name;
  const itemPrice =
    parseFloat(
      course
        ? item?.promotional_price || item?.preco || 0
        : item?.price || item?.preco || 0
    ) || 0;

  const navigate = useNavigate();

  const generatePixPayment = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!item?.id) {
        setError("Item ID não disponível");
        return;
      }

      const payload =
        type === "course" ? { cursoId: item.id } : { planId: item.id };

      // Try to add item to user's cart (if authenticated) so purchases are tracked
      try {
        await api.post('/cart/items', {
          product_type: type === 'course' ? 'course' : 'plan',
          product_id: item.id,
          price: itemPrice,
        });
      } catch (cartErr) {
        // ignore cart errors (user may be not authenticated) and continue
        console.debug('Could not add to cart:', cartErr?.message || cartErr);
      }

      const response = await api.post("/payments/pix", payload);
      setPixData(response.data);
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);

      if (err.response?.status === 401) {
        setError("Sessão expirada. Por favor, faça login novamente.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.details ||
          err.message ||
          "Erro desconhecido";
        setError(`Erro ao gerar PIX: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  }, [item, type]);

  useEffect(() => {
    // Não gerar PIX automaticamente ao abrir o diálogo;
    // o usuário deve clicar em "Gerar PIX" para evitar registros indesejados.
  }, [open, tab, pixData, generatePixPayment]);

  useEffect(() => {
    if (tab !== 0) return;
    if (!pixData) return;
    const expires = Number(pixData.expiresIn || 360);
    setTimeLeft(expires);
  }, [pixData, tab]);

  useEffect(() => {
    if (tab !== 0) return;
    if (!pixData) return;
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [tab, pixData, timeLeft]);

  const handleMercadoPago = async () => {
    setLoading(true);
    setError("");

    try {
      if (!item?.id) {
        setError("Item ID não disponível");
        return;
      }

      const payload =
        type === "course" ? { cursoId: item.id } : { planId: item.id };
      // Try to add to cart first so we have a server-side record (if user is logged)
      try {
        await api.post('/cart/items', {
          product_type: type === 'course' ? 'course' : 'plan',
          product_id: item.id,
          price: itemPrice,
        });
      } catch (cartErr) {
        console.debug('Could not add to cart before preference:', cartErr?.message || cartErr);
      }

      const response = await api.post("/payments/preference", payload);
      window.location.href = response.data.initPoint;
    } catch (err) {
      console.error("Erro ao criar preferência:", err);

      if (err.response?.status === 401) {
        setError("Sessão expirada. Por favor, faça login novamente.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.details ||
          err.message ||
          "Erro desconhecido";
        setError(`Erro ao gerar checkout: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    const text = pixData?.pixCode;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn("Falha ao copiar PIX", err);
    }
  };

  const formatTime = (seconds) => {
    const s = Math.max(0, Number(seconds) || 0);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Finalizar {type === "course" ? "Compra" : "Assinatura"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Informações do Item */}
        {itemPrice <= 0 ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Erro: Este produto não possui preço configurado
            </Typography>
            <Typography variant="caption">
              Entre em contato com o suporte para mais informações
            </Typography>
          </Alert>
        ) : (
          <>
            <Box
              sx={{ mb: 3, p: 2, bgcolor: "primary.light", borderRadius: 2 }}
            >
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                {itemName}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                R$ {itemPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {type === "course"
                  ? "Acesso vitalício ao conteúdo"
                  : `${item.duration_days} dias de acesso`}
              </Typography>
            </Box>

            {/* Tabs de Pagamento */}
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab icon={<QrCode />} label="PIX" />
              <Tab
                icon={
                  <img
                    src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__large_plus.png"
                    alt="MP"
                    style={{ height: 20 }}
                  />
                }
                label="Mercado Pago"
              />
            </Tabs>
          </>
        )}

        {/* Conteúdo PIX */}
        {itemPrice > 0 && tab === 0 && (
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {error}
                </Typography>
              </Alert>
            )}
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : !pixData ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Button variant="contained" onClick={generatePixPayment} disabled={loading} sx={{ mb: 2 }}>
                  {loading ? 'Gerando...' : 'Gerar PIX'}
                </Button>
                <Typography variant="caption" color="text.secondary" display="block">
                  Clique em "Gerar PIX" para criar o código de pagamento.
                </Typography>
              </Box>
            ) : paymentStatus === "approved" ? (
              <Alert severity="success" icon={<CheckCircle />}>
                <Typography variant="h6">Pagamento Confirmado!</Typography>
                <Typography variant="body2">
                  Seu plano foi ativado com sucesso.
                </Typography>
              </Alert>
            ) : timeLeft === 0 ? (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "warning.main",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="warning.main" gutterBottom>
                  ⏱️ Código PIX Expirado
                </Typography>
                <Typography variant="body2" color="text.primary" paragraph>
                  O código PIX expirou. Se você já realizou o pagamento, aguarde
                  a confirmação ou entre em contato com o suporte.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Caso contrário, feche esta janela e gere um novo código.
                </Typography>
              </Box>
            ) : pixData ? (
              <>
                {/* Timer */}
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <Chip
                    icon={<Timer />}
                    label={`Expira em ${formatTime(timeLeft)}`}
                    color={timeLeft < 120 ? "error" : "primary"}
                    sx={{ fontSize: "1rem", py: 2 }}
                  />
                </Box>

                {/* Código PIX Copia e Cola - DESTAQUE */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    mb={1}
                    textAlign="center"
                  >
                    Código PIX Copia e Cola
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      p: 2,
                      bgcolor: "grey.100",
                      borderRadius: 2,
                      border: "2px dashed",
                      borderColor: "primary.main",
                    }}
                  >
                    <TextField
                      fullWidth
                      value={pixData.pixCode}
                      InputProps={{
                        readOnly: true,
                        sx: {
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          bgcolor: "white",
                        },
                      }}
                      size="small"
                      multiline
                      rows={3}
                    />
                    <Tooltip title={copied ? "Copiado!" : "Copiar código"}>
                      <IconButton
                        onClick={copyPixCode}
                        color="primary"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          height: "fit-content",
                        }}
                      >
                        {copied ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    textAlign="center"
                    mt={1}
                  >
                    Copie o código acima e cole no app do seu banco na opção PIX
                    Copia e Cola
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }}>ou escaneie o QR Code</Divider>

                {/* QR Code */}
                {pixData.qrCode ? (
                  <>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "white",
                          borderRadius: 2,
                          boxShadow: 2,
                        }}
                      >
                        <QRCodeSVG value={pixData.pixCode} size={200} />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      textAlign="center"
                      color="text.secondary"
                      mb={2}
                    >
                      Escaneie o QR Code com o app do seu banco
                    </Typography>
                  </>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    QR Code não disponível. Use o código Copia e Cola acima.
                  </Alert>
                )}

                <Alert severity="info">
                  <Typography variant="body2" fontWeight="bold">
                    Aguardando confirmação do pagamento...
                  </Typography>
                  <Typography variant="caption">
                    Após realizar o pagamento, a confirmação será automática em
                    alguns segundos.
                  </Typography>
                </Alert>
              </>
            ) : (
              <Alert severity="error">
                {error ||
                  "Erro ao gerar código PIX. Tente novamente ou entre em contato com o suporte."}
              </Alert>
            )}
          </Box>
        )}

        {/* Conteúdo Mercado Pago */}
        {itemPrice > 0 && tab === 1 && (
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {error}
                </Typography>
              </Alert>
            )}
            <Typography variant="body1" mb={2}>
              Você será redirecionado para o checkout seguro do Mercado Pago.
            </Typography>
            <Alert severity="info">
              Aceita cartão de crédito, débito e outros métodos de pagamento.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        {itemPrice > 0 && tab === 1 && (
          <Button
            variant="contained"
            onClick={handleMercadoPago}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {loading ? "Processando..." : "Ir para Mercado Pago"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
