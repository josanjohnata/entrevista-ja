import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeaderHome } from '../../components/HeaderHome/HeaderHome';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro ao renderizar IndexPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Erro ao carregar componente de otimização de currículo</h2>
          <p>{this.state.error?.message || 'Erro desconhecido'}</p>
          <p>Verifique o console do navegador para mais detalhes.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

import { IndexPage } from '@josanjohnata/optimize-cv/src/presentation/pages/Index/Index';
import { theme } from '@josanjohnata/optimize-cv/src/styles/theme';
import { GlobalStyles } from '@josanjohnata/optimize-cv/src/styles/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const HomeScreen: React.FC = () => {
  return (
    <>
      <HeaderHome />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <ErrorBoundary>
            <div style={{ minHeight: '100vh', position: 'relative' }}>
              <IndexPage />
            </div>
          </ErrorBoundary>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};
