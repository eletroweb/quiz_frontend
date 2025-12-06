import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Chip, TextField,
    InputAdornment
} from '@mui/material';
import { Search, Block, CheckCircle, Visibility, Security } from '@mui/icons-material';
import api from '../../services/api';
import UserPermissionsDialog from '../../components/UserPermissionsDialog';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(userId, currentStatus) {
        // Implementar lógica de banir/ativar
        // Por enquanto apenas log
        console.log('Toggle status:', userId, currentStatus);
        alert('Funcionalidade de banir/ativar será implementada no backend');
    }

    function handleOpenPermissions(user) {
        setSelectedUser(user);
        setPermissionsDialogOpen(true);
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4">Gerenciamento de Usuários</Typography>
                <TextField
                    placeholder="Buscar usuários..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Plano</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Cadastro</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.display_name || 'Sem nome'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.plan || 'Free'}
                                        color={user.plan === 'premium' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.is_admin ? 'Admin' : 'Ativo'}
                                        color={user.is_admin ? 'secondary' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        title="Permissões"
                                        onClick={() => handleOpenPermissions(user)}
                                    >
                                        <Security />
                                    </IconButton>
                                    <IconButton color="primary" title="Ver Detalhes">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        title="Banir Usuário"
                                        onClick={() => handleToggleStatus(user.id, true)}
                                    >
                                        <Block />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <UserPermissionsDialog
                open={permissionsDialogOpen}
                onClose={() => setPermissionsDialogOpen(false)}
                user={selectedUser}
                onUpdate={loadUsers}
            />
        </Box>
    );
}
