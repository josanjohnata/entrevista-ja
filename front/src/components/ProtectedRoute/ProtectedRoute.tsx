import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingContainer, AccessDeniedContainer } from './styles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  skipProfileCheck?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireAuth = true,
  skipProfileCheck = false
}) => {
  const { isAuthenticated, userData, loading, currentUser } = useAuth();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(!skipProfileCheck);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (skipProfileCheck || !currentUser || !db) {
        setCheckingProfile(false);
        return;
      }

      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          setProfileCompleted(false);
        } else {
          const profileData = profileSnap.data();
          setProfileCompleted(profileData.profileCompleted === true);
        }
      } catch (error) {
        console.warn('Erro ao verificar perfil:', error);
        setProfileCompleted(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    if (isAuthenticated && !loading && !skipProfileCheck) {
      checkProfile();
    } else if (skipProfileCheck) {
      setCheckingProfile(false);
    }
  }, [isAuthenticated, currentUser, loading, skipProfileCheck]);

  if (loading || checkingProfile) {
    return (
      <LoadingContainer>
        Carregando...
      </LoadingContainer>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!skipProfileCheck && isAuthenticated && !profileCompleted && location.pathname !== '/profile') {
    return <Navigate to="/profile" state={{ isFirstAccess: true }} replace />;
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