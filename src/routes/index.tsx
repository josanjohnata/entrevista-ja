import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PaymentPlans } from '../screens/PaymentPlans/PaymentPlans';
import { ContactScreen } from '../screens/Contact/Contact';
import { LoginScreen } from '../screens/Login/Login';
import { CheckoutScreen } from '../screens/CheckoutScreen/CheckoutScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import { UserRole } from '../contexts/AuthContext';
import { AdminPanel } from '../components/AdminPanel/AdminPanel';
import { LinkedInSearchScreen } from '../screens/LinkedInSearch/LinkedInSearch';
import { CompaniesScreen } from '../screens/CompaniesScreen/CompaniesScreen';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import LandingPage from '../screens/landing/App';

import { ResultadosPage } from '@josanjohnata/optimize-cv/src/presentation/pages/Resultados/Resultados';
import { theme } from '@josanjohnata/optimize-cv/src/styles/theme';
import { GlobalStyles } from '@josanjohnata/optimize-cv/src/styles/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/planos" element={<PaymentPlans />} />
      <Route path="/contato" element={<ContactScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute requiredRole={UserRole.BASIC_PLAN}>
            <HomeScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAuth={true}>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/linkedin-search" 
        element={<LinkedInSearchScreen />} 
      />
      <Route 
        path="/empresas" 
        element={<CompaniesScreen />} 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireAuth={true}>
            <ProfileScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resultados" 
        element={
          <ProtectedRoute requireAuth={true}>
            <ResultadosPageWrapper />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};