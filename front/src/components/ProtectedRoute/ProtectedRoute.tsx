import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { LoadingContainer, AccessDeniedContainer } from './styles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireAuth = true 
}) => {
  const { isAuthenticated, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        Carregando...
      </LoadingContainer>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userData) {
    const hasPermission = checkPermission(userData.role, requiredRole);
    
    if (!hasPermission) {
      return (
        <AccessDeniedContainer>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Seu plano atual: <strong>{getRoleDisplayName(userData.role)}</strong></p>
          <p>Plano necessário: <strong>{getRoleDisplayName(requiredRole)}</strong></p>
        </AccessDeniedContainer>
      );
    }
  }

  return <>{children}</>;
};

const checkPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    [UserRole.RECRUITER]: 4,
    [UserRole.ANNUAL_PLAN]: 3,
    [UserRole.MONTHLY_PLAN]: 2,
    [UserRole.BASIC_PLAN]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.RECRUITER]: 'Recrutador/Parceiro',
    [UserRole.ANNUAL_PLAN]: 'Plano Anual',
    [UserRole.MONTHLY_PLAN]: 'Plano Mensal',
    [UserRole.BASIC_PLAN]: 'Plano Básico',
  };

  return roleNames[role] || 'Desconhecido';
}; 