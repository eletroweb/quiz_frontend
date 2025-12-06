import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none', // Botões sem ALL CAPS
        },
    },
    palette: {
        primary: {
            main: '#4F46E5', // Indigo vibrante
            light: '#818CF8',
            dark: '#3730A3',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F97316', // Laranja vibrante (CTA)
            light: '#FB923C',
            dark: '#EA580C',
            contrastText: '#fff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1E293B', // Slate 800
            secondary: '#64748B', // Slate 500
        },
    },
    shape: {
        borderRadius: 12, // Bordas mais arredondadas globalmente
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Botões arredondados por padrão
                    padding: '10px 24px',
                },
                containedPrimary: {
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(79, 70, 229, 0.05)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove overlay padrão do dark mode se ativar
                },
            },
        },
    },
});

export default theme;
