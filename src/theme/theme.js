import { createTheme } from '@mui/material/styles';

// Color palette for EVOX wheelchair store
// Using accessibility-friendly colors that convey trust and professionalism
const colors = {
  primary: {
    main: '#3563E9',      // Updated to a more vibrant blue
    light: '#5B81F0',
    dark: '#1D4ED8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FF4D4F',      // Bright red for CTAs
    light: '#FF7A7C',
    dark: '#D42C2E',
    contrastText: '#ffffff',
  },
  neutral: {
    main: '#f8f9fa',
    light: '#ffffff',
    dark: '#e9ecef',
    darker: '#dee2e6',
    text: '#1A1A1A',      // Darker text for better readability
    textLight: '#646464', // Gray text for secondary information
  },
  success: {
    main: '#10B981',     // Updated green
  },
  error: {
    main: '#EF4444',     // Updated red
  },
  warning: {
    main: '#F59E0B',     // Updated orange/amber
  },
  info: {
    main: '#3B82F6',     // Updated blue
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
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: '1440px !important', // Make containers wider
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
