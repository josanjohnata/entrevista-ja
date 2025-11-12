import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: {
      main: '#0a0a0a',
      light: '#404040',
      dark: '#000000',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#525252',
      light: '#737373',
      dark: '#262626',
      contrast: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrast: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrast: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrast: '#ffffff',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f5f5f5',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#525252',
      tertiary: '#a3a3a3',
      inverse: '#fafafa',
    },
    border: {
      light: '#e5e5e5',
      main: '#d4d4d4',
      dark: '#a3a3a3',
    },
  },

  gradients: {
    hero: 'linear-gradient(135deg, #0a0a0a 0%, #404040 100%)',
    card: 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
    button: 'linear-gradient(135deg, #0a0a0a 0%, #262626 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    card: '0 4px 16px rgba(0, 0, 0, 0.08)',
    button: '0 4px 14px rgba(10, 10, 10, 0.4)',
  },

  typography: {
    fontFamily: {
      primary: 'sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.secondary};
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
    max-width: 100vw;
  }

  /* Scrollbar invisível com animação suave */
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Firefox */
  * {
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
  }

  /* IE e Edge */
  body {
    -ms-overflow-style: none;
  }

  h1, h2, h3 {
    color: ${theme.colors.primary.main};
    font-weight: 700;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
