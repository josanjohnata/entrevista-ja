import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { GlobalStyle } from './GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;