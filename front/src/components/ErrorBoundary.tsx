import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#fff',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#e74c3c' }}>⚠️ Algo deu errado!</h1>
          <details style={{
            whiteSpace: 'pre-wrap',
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px solid #dee2e6'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              Ver detalhes do erro
            </summary>
            <h3>Erro:</h3>
            <p style={{ color: '#e74c3c' }}>{this.state.error && this.state.error.toString()}</p>
            <h3>Stack:</h3>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>
              {this.state.error && this.state.error.stack}
            </p>
            {this.state.errorInfo && (
              <>
                <h3>Component Stack:</h3>
                <p style={{ fontSize: '12px', color: '#6c757d' }}>
                  {this.state.errorInfo.componentStack}
                </p>
              </>
            )}
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
