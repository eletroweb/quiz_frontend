import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function SiteConfig() {
    const [config, setConfig] = useState({
        description: '',
        footerLinks: {
            Plataforma: [],
            Recursos: [],
            Suporte: []
        },
        socialLinks: []
    });

    useEffect(() => {
        // Tenta carregar do backend (usa VITE_API_URL se definido), cai para localStorage se falhar
        let canceled = false;
        const getBase = () => {
            const env = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : '';
            if (!env) return '';
            return env.replace(/\/$/,'');
        };
        const load = async () => {
            const base = getBase();
            const url = base ? `${base}/site-config` : '/api/site-config';
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error('no-backend');
                const json = await res.json();
                if (!canceled && json && Object.keys(json).length) setConfig(json);
                else if (!canceled) {
                    const raw = localStorage.getItem('site_config');
                    if (raw) setConfig(JSON.parse(raw));
                }
            } catch (err) {
                try {
                    const raw = localStorage.getItem('site_config');
                    if (raw && !canceled) setConfig(JSON.parse(raw));
                } catch (err) { /* ignore */ }
            }
        };
        load();
        return () => { canceled = true; };
    }, []);

    const save = () => {
        // Tenta salvar no backend (usa VITE_API_URL se disponível), se falhar salva no localStorage como fallback
        const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL.replace(/\/$/,'') : '';
        const url = base ? `${base}/site-config` : '/api/site-config';

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        }).then(async (res) => {
            if (res.ok) {
                alert('Configurações salvas no servidor.');
            } else {
                // fallback
                localStorage.setItem('site_config', JSON.stringify(config));
                alert('Não foi possível salvar no servidor. Salvo localmente.');
            }
        }).catch(() => {
            localStorage.setItem('site_config', JSON.stringify(config));
            alert('Erro de rede. Salvo localmente.');
        });
    };

    const updateLink = (section, idx, key, value) => {
        setConfig(prev => {
            const copy = { ...prev, footerLinks: { ...prev.footerLinks } };
            copy.footerLinks[section] = copy.footerLinks[section].map((l, i) => i === idx ? { ...l, [key]: value } : l);
            return copy;
        });
    };

    const addLink = (section) => {
        setConfig(prev => ({ ...prev, footerLinks: { ...prev.footerLinks, [section]: [...(prev.footerLinks[section] || []), { label: 'Novo', href: '/' }] } }));
    };

    const removeLink = (section, idx) => {
        setConfig(prev => {
            const copy = { ...prev, footerLinks: { ...prev.footerLinks } };
            copy.footerLinks[section] = copy.footerLinks[section].filter((_, i) => i !== idx);
            return copy;
        });
    };

    const addSocial = (name) => {
        setConfig(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || []), { icon: name, href: '' }] }));
    };

    const updateSocial = (idx, key, value) => {
        setConfig(prev => ({ ...prev, socialLinks: prev.socialLinks.map((s, i) => i === idx ? { ...s, [key]: value } : s) }));
    };

    const removeSocial = (idx) => setConfig(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== idx) }));

    const SocialPreview = ({ name }) => {
        if (name === 'facebook') return <FacebookIcon />;
        if (name === 'instagram') return <InstagramIcon />;
        if (name === 'twitter') return <TwitterIcon />;
        if (name === 'youtube') return <YouTubeIcon />;
        return <FacebookIcon />;
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Configuração do Site</Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Descrição</Typography>
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    sx={{ mt: 1 }}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Links do Rodapé</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {Object.keys(config.footerLinks).map((section) => (
                        <Grid item xs={12} md={4} key={section}>
                            <Typography fontWeight="bold">{section}</Typography>
                            {(config.footerLinks[section] || []).map((link, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <TextField size="small" label="Label" value={link.label} onChange={(e) => updateLink(section, idx, 'label', e.target.value)} />
                                    <TextField size="small" label="Href" value={link.href} onChange={(e) => updateLink(section, idx, 'href', e.target.value)} />
                                    <Button color="error" onClick={() => removeLink(section, idx)}>Remover</Button>
                                </Box>
                            ))}
                            <Button sx={{ mt: 1 }} onClick={() => addLink(section)}>Adicionar link</Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Redes Sociais</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button onClick={() => addSocial('facebook')}>Adicionar Facebook</Button>
                    <Button onClick={() => addSocial('instagram')}>Adicionar Instagram</Button>
                    <Button onClick={() => addSocial('twitter')}>Adicionar Twitter</Button>
                    <Button onClick={() => addSocial('youtube')}>Adicionar YouTube</Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {(config.socialLinks || []).map((s, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                            <IconButton><SocialPreview name={s.icon} /></IconButton>
                            <TextField size="small" label="Href" value={s.href} onChange={(e) => updateSocial(idx, 'href', e.target.value)} />
                            <Button color="error" onClick={() => removeSocial(idx)}>Remover</Button>
                        </Box>
                    ))}
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={save}>Salvar</Button>
                <Button variant="outlined" onClick={() => { localStorage.removeItem('site_config'); alert('Configurações resetadas.'); window.location.reload(); }}>Resetar</Button>
            </Box>
        </Box>
    );
}
