import { createTheme } from '@mui/material/styles';

// Color palette for EVOX wheelchair store
// Using accessibility-friendly colors that convey trust and professionalism
const colors = {
  primary: {
    main: '#0056b3',
    light: '#4286c5',
    dark: '#003c80',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#e63946',  // For call-to-actions and highlights
    light: '#ff6b6b',
    dark: '#c1121f',
    contrastText: '#ffffff',
  },
  neutral: {
    main: '#f8f9fa',
    light: '#ffffff',
    dark: '#e9ecef',
    darker: '#dee2e6',
    text: '#212529',
    textLight: '#6c757d',
  },
  success: {
    main: '#2e7d32',
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ed6c02',
  },
  info: {
    main: '#0288d1',
  },
};

const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.neutral.light,
      paper: colors.neutral.main,
    },
    text: {
      primary: colors.neutral.text,
      secondary: colors.neutral.textLight,
    },
    success: {
      main: colors.success.main,
    },
    error: {
      main: colors.error.main,
    },
    warning: {
      main: colors.warning.main,
    },
    info: {
      main: colors.info.main,
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
