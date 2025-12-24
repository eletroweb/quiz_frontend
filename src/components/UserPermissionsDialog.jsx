import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, Typography, Switch, FormControlLabel, TextField,
    Accordion, AccordionSummary, AccordionDetails, Chip, Alert,
    CircularProgress, Select, MenuItem
} from '@mui/material';
import { ExpandMore, Security, RestartAlt } from '@mui/icons-material';
import api from '../services/api';

const FEATURE_LABELS = {
    max_questions_per_day: 'Questões por dia',
    access_cursos: 'Acesso a Cursos',
    access_all_materias: 'Acesso a Todas Matérias',
    max_simulados_per_month: 'Simulados por mês',
    can_download_pdf: 'Download de PDFs',
    can_see_explanations: 'Ver Explicações',
    can_review_wrong_answers: 'Revisar Erros',
    access_estatisticas: 'Estatísticas Detalhadas',
    can_create_custom_simulado: 'Criar Simulado Customizado',
    priority_support: 'Suporte Prioritário',
    early_access_features: 'Acesso Antecipado'
};

export default function UserPermissionsDialog({ open, onClose, user, onUpdate }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userPlan, setUserPlan] = useState('trial');
    const [availablePlans, setAvailablePlans] = useState([]);
    const [planFeatures, setPlanFeatures] = useState([]);
    const [customPermissions, setCustomPermissions] = useState([]);
    const [message, setMessage] = useState('');

    /* =======================
       LOAD PLANS (ÚNICO)
    ======================= */
    const loadPlans = useCallback(async () => {
        try {
            const response = await api.get('/plans');
            setAvailablePlans(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
        }
    }, []);

    /* =======================
       LOAD PERMISSIONS (ÚNICO)
    ======================= */
    const loadPermissions = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await api.get(`/user-permissions/${user.id}`);
            setUserPlan(response.data.user_plan);
            setPlanFeatures(response.data.plan_features || []);
            setCustomPermissions(response.data.custom_permissions || []);
        } catch (error) {
            console.error('Erro ao carregar permissões:', error);
            setMessage('Erro ao carregar permissões do usuário');
        } finally {
            setLoading(false);
        }
    }, [user]);

    /* =======================
       EFFECT
    ======================= */
    useEffect(() => {
        if (open && user) {
            loadPermissions();
            loadPlans();
        }
    }, [open, user, loadPermissions, loadPlans]);

    /* =======================
       ACTIONS
    ======================= */
    async function handleSavePermission(permissionKey, value, override = true) {
        try {
            setSaving(true);
            await api.put(`/user-permissions/${user.id}/${permissionKey}`, {
                permission_value: value,
                override_plan: override
            });

            const existingIndex = customPermissions.findIndex(
                p => p.permission_key === permissionKey
            );

            if (existingIndex >= 0) {
                const updated = [...customPermissions];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    permission_value: value,
                    override_plan: override
                };
                setCustomPermissions(updated);
            } else {
                setCustomPermissions([
                    ...customPermissions,
                    { permission_key: permissionKey, permission_value: value, override_plan: override }
                ]);
            }

            setMessage('Permissão atualizada!');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setMessage('Erro ao salvar permissão');
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdatePlan(newPlan) {
        try {
            setSaving(true);
            await api.put(`/users/${user.id}/plan`, { plan: newPlan });
            setUserPlan(newPlan);
            await loadPermissions();
            if (onUpdate) onUpdate();
            setMessage('Plano atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar plano:', error);
            setMessage('Erro ao atualizar plano');
        } finally {
            setSaving(false);
        }
    }

    async function handleResetPermissions() {
        if (!window.confirm('Resetar todas as permissões customizadas deste usuário?')) return;

        try {
            setSaving(true);
            await api.post(`/user-permissions/${user.id}/reset`);
            setCustomPermissions([]);
            setMessage('Permissões resetadas!');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Erro ao resetar:', error);
            setMessage('Erro ao resetar permissões');
        } finally {
            setSaving(false);
        }
    }

    /* =======================
       HELPERS VISUAIS
    ======================= */
    function getPermissionValue(featureKey) {
        const custom = customPermissions.find(
            p => p.permission_key === featureKey && p.override_plan
        );
        if (custom) return custom.permission_value;

        const planFeature = planFeatures.find(f => f.feature_key === featureKey);
        return planFeature?.feature_value || '';
    }

    function hasCustomPermission(featureKey) {
        return customPermissions.some(
            p => p.permission_key === featureKey && p.override_plan
        );
    }

    function renderPermissionControl(featureKey) {
        const value = getPermissionValue(featureKey);
        const isCustom = hasCustomPermission(featureKey);
        const isBoolean = featureKey.startsWith('access_') || featureKey.startsWith('can_');

        return (
            <Box sx={{ mb: 2, p: 2, bgcolor: isCustom ? 'action.selected' : 'background.paper', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={isCustom ? 'bold' : 'normal'}>
                        {FEATURE_LABELS[featureKey] || featureKey}
                    </Typography>
                    {isCustom && <Chip label="Customizado" size="small" color="primary" />}
                </Box>

                {isBoolean ? (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value === 'true'}
                                onChange={(e) =>
                                    handleSavePermission(featureKey, e.target.checked ? 'true' : 'false')
                                }
                                disabled={saving}
                            />
                        }
                        label={value === 'true' ? 'Habilitado' : 'Desabilitado'}
                    />
                ) : (
                    <Box display="flex" gap={1} alignItems="center">
                        <TextField
                            size="small"
                            value={value === 'unlimited' ? '' : value}
                            onChange={(e) =>
                                handleSavePermission(featureKey, e.target.value || 'unlimited')
                            }
                            placeholder="unlimited"
                            type="number"
                            disabled={saving || value === 'unlimited'}
                            sx={{ width: 150 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={value === 'unlimited'}
                                    onChange={(e) =>
                                        handleSavePermission(featureKey, e.target.checked ? 'unlimited' : '0')
                                    }
                                    disabled={saving}
                                />
                            }
                            label="Ilimitado"
                        />
                    </Box>
                )}
            </Box>
        );
    }

    if (!user) return null;

    /* =======================
       RENDER
    ======================= */
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Security />
                    <Box>
                        <Typography variant="h6">Permissões de {user.name}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption">Plano Atual:</Typography>
                            <Select
                                value={userPlan}
                                onChange={(e) => handleUpdatePlan(e.target.value)}
                                size="small"
                                variant="standard"
                                disabled={saving}
                            >
                                <MenuItem value="trial">Trial</MenuItem>
                                {availablePlans.map(plan => (
                                    <MenuItem key={plan.id} value={plan.slug || plan.name.toLowerCase()}>
                                        {plan.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {message && (
                            <Alert severity={message.includes('Erro') ? 'error' : 'success'} sx={{ mb: 2 }}>
                                {message}
                            </Alert>
                        )}

                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Limites de Uso</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {renderPermissionControl('max_questions_per_day')}
                                {renderPermissionControl('max_simulados_per_month')}
                            </AccordionDetails>
                        </Accordion>

                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Controle de Acesso</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {renderPermissionControl('access_cursos')}
                                {renderPermissionControl('access_all_materias')}
                                {renderPermissionControl('access_estatisticas')}
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Funcionalidades</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {renderPermissionControl('can_download_pdf')}
                                {renderPermissionControl('can_see_explanations')}
                                {renderPermissionControl('can_review_wrong_answers')}
                                {renderPermissionControl('can_create_custom_simulado')}
                                {renderPermissionControl('priority_support')}
                                {renderPermissionControl('early_access_features')}
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    startIcon={<RestartAlt />}
                    onClick={handleResetPermissions}
                    disabled={saving || customPermissions.length === 0}
                    color="warning"
                >
                    Resetar Tudo
                </Button>
                <Box flexGrow={1} />
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
