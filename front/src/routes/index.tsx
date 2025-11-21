import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PaymentPlans } from '../screens/PaymentPlans/PaymentPlans';
import { LoginScreen } from '../screens/Login/Login';
import { CheckoutScreen } from '../screens/CheckoutScreen/CheckoutScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import { UserRole, useAuth } from '../contexts/AuthContext';
import { AdminPanel } from '../components/AdminPanel/AdminPanel';
import { LinkedInSearchScreen } from '../screens/LinkedInSearch/LinkedInSearch';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import LandingPage from '../screens/landing/App';

import { ResultadosPage } from '../presentation/pages/Resultados/Resultados';
import { theme } from '../styles/theme';
import { GlobalStyles } from '../styles/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotFoundPage } from '../presentation/pages/NotFound/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ResultadosPageWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ResultadosPage />
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
  );
};

export const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();
  const userKey = currentUser?.uid || 'no-user';

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/planos" element={<PaymentPlans />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route path="/resultados" element={<ResultadosPageWrapper />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`home-${userKey}`}>
            <HomeScreen key={userKey} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth={true} key={`admin-${userKey}`}>
            <AdminPanel key={userKey} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/linkedin-search"
        element={<LinkedInSearchScreen key={userKey} />}
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true} skipProfileCheck={true} key={`profile-${userKey}`}>
            <ProfileScreen key={userKey} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};