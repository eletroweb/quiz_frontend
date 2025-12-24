import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Tabs, Tab, Switch, TextField,
    FormControlLabel, Grid, Divider, Alert, CircularProgress,
    Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';
import api from '../../services/api';

const PLAN_LABELS = {
    trial: 'Trial (Gratuito)',
    monthly: 'Mensal',
    annual: 'Anual',
    lifetime: 'Vitalício'
};

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

export default function PlanosConfig() {
    const [currentTab, setCurrentTab] = useState(0);
    const [features, setFeatures] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const planTypes = ['trial', 'monthly', 'annual', 'lifetime'];
    const currentPlan = planTypes[currentTab];

    // ===============================
    // LOAD FEATURES
    // ===============================
    const loadFeatures = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/plan-features');
            setFeatures(response.data);
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            setMessage('Erro ao carregar recursos dos planos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFeatures();
    }, [loadFeatures]);

    // ===============================
    // SAVE FEATURE
    // ===============================
    const handleSaveFeature = useCallback(
        async (featureKey, value) => {
            try {
                setSaving(true);

                await api.put(`/plan-features/${currentPlan}/${featureKey}`, {
                    feature_value: value,
                    description: FEATURE_LABELS[featureKey] || featureKey
                });

                setFeatures(prev => ({
                    ...prev,
                    [currentPlan]: prev[currentPlan].map(f =>
                        f.feature_key === featureKey
                            ? { ...f, feature_value: value }
                            : f
                    )
                }));

                setMessage('Recurso atualizado com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Erro ao salvar:', error);
                setMessage('Erro ao salvar recurso');
            } finally {
                setSaving(false);
            }
        },
        [currentPlan]
    );

    // ===============================
    // HELPERS
    // ===============================
    const getFeatureValue = (featureKey) => {
        const planFeatures = features[currentPlan] || [];
        const feature = planFeatures.find(f => f.feature_key === featureKey);
        return feature?.feature_value || '';
    };

    const renderFeatureControl = (featureKey) => {
        const value = getFeatureValue(featureKey);
        const isBooleanFeature =
            featureKey.startsWith('access_') || featureKey.startsWith('can_');

        if (isBooleanFeature) {
            return (
                <FormControlLabel
                    control={
                        <Switch
                            checked={value === 'true'}
                            onChange={(e) =>
                                handleSaveFeature(
                                    featureKey,
                                    e.target.checked ? 'true' : 'false'
                                )
                            }
                            disabled={saving}
                        />
                    }
                    label={FEATURE_LABELS[featureKey] || featureKey}
                />
            );
        }

        return (
            <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {FEATURE_LABELS[featureKey] || featureKey}
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                    <TextField
                        size="small"
                        value={value === 'unlimited' ? '' : value}
                        onChange={(e) =>
                            handleSaveFeature(
                                featureKey,
                                e.target.value || 'unlimited'
                            )
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
                                    handleSaveFeature(
                                        featureKey,
                                        e.target.checked ? 'unlimited' : '0'
                                    )
                                }
                                disabled={saving}
                            />
                        }
                        label="Ilimitado"
                    />
                </Box>
            </Box>
        );
    };

    // ===============================
    // LOADING
    // ===============================
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // ===============================
    // RENDER
    // ===============================
    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <Settings sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold">
                    Configuração de Planos
                </Typography>
            </Box>

            {message && (
                <Alert severity={message.includes('Erro') ? 'error' : 'success'} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <Paper sx={{ mb: 3 }}>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
                    {planTypes.map(plan => (
                        <Tab key={plan} label={PLAN_LABELS[plan]} />
                    ))}
                </Tabs>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recursos do Plano {PLAN_LABELS[currentPlan]}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Limites de Uso</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('max_questions_per_day')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('max_simulados_per_month')}
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Controle de Acesso</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('access_cursos')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('access_all_materias')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('access_estatisticas')}
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid item xs={12}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="bold">Funcionalidades</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('can_download_pdf')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('can_see_explanations')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('can_review_wrong_answers')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('can_create_custom_simulado')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('priority_support')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {renderFeatureControl('early_access_features')}
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        As alterações são salvas automaticamente
                    </Typography>
                    <Chip
                        label={`${(features[currentPlan] || []).length} recursos configurados`}
                        color="primary"
                        size="small"
                    />
                </Box>
            </Paper>
        </Box>
    );
}
