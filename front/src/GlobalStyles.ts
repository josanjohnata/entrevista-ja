import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#0a0a0a',
    white: '#ffffff',
    text: '#525252',
    lightGray: '#f5f5f5',
    border: '#e5e5e5',
    textInverted: '#fafafa',
  },
  fonts: {
    primary: 'sans-serif',
  },
  breakpoints: {
    mobile: '768px',
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
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.white};
    color: ${theme.colors.text};
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
    color: ${theme.colors.primary};
    font-weight: 700;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
