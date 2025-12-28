import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Pagination,
} from "@mui/material";
import { Download, Search, Visibility, DeleteForever } from "@mui/icons-material";
import api from "../../services/api";

export default function AdminPagamentosHistorico() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    user_id: "",
    status: "approved",
  });
  const [relatorio, setRelatorio] = useState(null);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [detalhesSelecionado, setDetalhesSelecionado] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

    const carregarPagamentos = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;

      const response = await api.get("/pagamentos/historico", {
        params: {
          limit,
          offset,
          ...filters,
        },
      });

      setPagamentos(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      alert("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);


  const carregarRelatorio = useCallback(async () => {
  try {
    const response = await api.get("/pagamentos/relatorio");
    setRelatorio(response.data);
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
  }
  }, []);

  
  useEffect(() => {
  carregarPagamentos();
  carregarRelatorio();
}, [carregarPagamentos, carregarRelatorio, page, filters]);



  const exportarCSV = () => {
    const headers = [
      "ID",
      "Email",
      "Nome",
      "Produto",
      "Valor",
      "Status",
      "Data Pagamento",
    ];
    const rows = pagamentos.map((p) => [
      p.id,
      p.email,
      p.display_name,
      p.produto,
      `R$ ${(parseFloat(p.valor) || 0).toFixed(2)}`,
      p.status,
      new Date(p.paid_at).toLocaleDateString("pt-BR"),
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pagamentos-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await api.delete("/pagamentos/historico/clear");
      alert("Histórico zerado com sucesso!");
      setConfirmClearOpen(false);
      carregarPagamentos();
      carregarRelatorio();
    } catch (error) {
      console.error("Erro ao zerar histórico:", error);
      alert("Erro ao zerar histórico: " + (error.response?.data?.error || error.message));
    } finally {
      setClearing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "success",
      pending: "warning",
      rejected: "error",
      cancelled: "default",
      refunded: "info",
    };
    return colors[status] || "default";
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        📊 Histórico de Pagamentos
      </Typography>

      {/* RELATÓRIO RÁPIDO */}
      {relatorio && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Typography variant="caption">Total de Vendas</Typography>
            <Typography variant="h6">{relatorio.total_vendas || 0}</Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Typography variant="caption">Valor Total</Typography>
            <Typography variant="h6">
              R$ {(parseFloat(relatorio.valor_total) || 0).toFixed(2)}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Typography variant="caption">Clientes Únicos</Typography>
            <Typography variant="h6">
              {relatorio.clientes_unicos || 0}
            </Typography>
          </Paper>
          {/* MODAL DE CONFIRMAÇÃO PARA LIMPAR TUDO */}
      <Dialog
        open={confirmClearOpen}
        onClose={() => !clearing && setConfirmClearOpen(false)}
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
          ⚠️ ATENÇÃO: Ação Irreversível
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a <strong>ZERAR TODO O HISTÓRICO</strong> de pagamentos.
            Esta ação removerá todos os registros de vendas, estatísticas e logs de pagamento do banco de dados.
            <br /><br />
            Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmClearOpen(false)}
            disabled={clearing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClearHistory}
            variant="contained"
            color="error"
            autoFocus
            disabled={clearing}
            startIcon={clearing ? <CircularProgress size={20} color="inherit" /> : <DeleteForever />}
          >
            {clearing ? "Limpando..." : "Sim, Zerar Histórico"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
      )}

      {/* FILTROS */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="ID do Usuário"
            type="number"
            size="small"
            value={filters.user_id}
            onChange={(e) => {
              setFilters({ ...filters, user_id: e.target.value });
              setPage(1);
            }}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(1);
            }}
          >
            <MenuItem value="approved">Aprovado</MenuItem>
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="rejected">Rejeitado</MenuItem>
            <MenuItem value="cancelled">Cancelado</MenuItem>
            <MenuItem value="refunded">Reembolsado</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={exportarCSV}
          >
            Exportar CSV
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => setConfirmClearOpen(true)}
            sx={{ ml: "auto" }}
          >
            Zerar Histórico
          </Button>
        </Box>
      </Paper>

      {/* TABELA */}
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
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nome
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Produto
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Valor
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Data
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
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pagamentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  Nenhum pagamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              pagamentos.map((pag) => (
                <TableRow key={pag.id} hover>
                  <TableCell>#{pag.id}</TableCell>
                  <TableCell>{pag.email}</TableCell>
                  <TableCell fontWeight="bold">{pag.display_name}</TableCell>
                  <TableCell>
                    <Chip label={pag.produto} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right" fontWeight="bold">
                    R$ {(parseFloat(pag.valor) || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pag.status}
                      color={getStatusColor(pag.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(pag.paid_at || pag.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setDetalhesSelecionado(pag);
                        setDetalhesOpen(true);
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINAÇÃO */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      {/* MODAL DE DETALHES */}
      <Dialog
        open={detalhesOpen}
        onClose={() => setDetalhesOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalhes do Pagamento</DialogTitle>
        <DialogContent>
          {detalhesSelecionado && (
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID
                </Typography>
                <Typography>{detalhesSelecionado.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cliente
                </Typography>
                <Typography>
                  {detalhesSelecionado.display_name} (
                  {detalhesSelecionado.email})
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Produto
                </Typography>
                <Typography>{detalhesSelecionado.produto}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Valor
                </Typography>
                <Typography fontWeight="bold">
                  R$ {(parseFloat(detalhesSelecionado.valor) || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={detalhesSelecionado.status}
                  color={getStatusColor(detalhesSelecionado.status)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Data do Pagamento
                </Typography>
                <Typography>
                  {new Date(detalhesSelecionado.paid_at).toLocaleString(
                    "pt-BR"
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Criado em
                </Typography>
                <Typography variant="caption">
                  {new Date(detalhesSelecionado.created_at).toLocaleString(
                    "pt-BR"
                  )}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
