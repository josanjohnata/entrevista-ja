/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const UserRole = {
  RECRUITER: 'recruiter',
  BASIC_PLAN: 'basic_plan',
  MONTHLY_PLAN: 'monthly_plan',
  ANNUAL_PLAN: 'annual_plan'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  planExpirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole, planExpirationDate?: Date) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
  isAuthenticated: boolean;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const isFirebaseConfigured = () => {
  try {
    return true;
  } catch (error) {
    console.warn('Firebase não está disponível:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfigured] = useState(isFirebaseConfigured());

  const login = async (email: string, password: string) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      let userData = await fetchUserData(result.user);
      
      if (!userData) {
        await saveUserData(result.user, UserRole.BASIC_PLAN);
        userData = await fetchUserData(result.user);
      }
      
      setUserData(userData);
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string, role: UserRole) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, { displayName });
      
      await saveUserData(result.user, role);
      
      const userData = await fetchUserData(result.user);
      setUserData(userData);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole, planExpirationDate?: Date) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente para usar autenticação.');
    }
    if (!currentUser) {
      throw new Error('Usuário não está logado');
    }

    try {
      await saveUserData(currentUser, role, planExpirationDate);
      const updatedUserData = await fetchUserData(currentUser);
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error);
      throw error;
    }
  };

  const fetchUserData = async (user: User): Promise<UserData | null> => {
    if (!firebaseConfigured) return null;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          role: data.role as UserRole,
          planExpirationDate: data.planExpirationDate ? data.planExpirationDate.toDate() : undefined,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  const saveUserData = async (user: User, role: UserRole, planExpirationDate?: Date) => {
    if (!firebaseConfigured) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userData: Partial<UserData> = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined,
        role,
        planExpirationDate,
        updatedAt: new Date(),
      };

      const existingDoc = await getDoc(userDocRef);
      if (!existingDoc.exists()) {
        userData.createdAt = new Date();
      }

      await setDoc(userDocRef, userData, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!userData) return false;

    if (userData.planExpirationDate && userData.planExpirationDate < new Date()) {
      return false;
    }

    const roleHierarchy = {
      [UserRole.RECRUITER]: 4,
      [UserRole.ANNUAL_PLAN]: 3,
      [UserRole.MONTHLY_PLAN]: 2,
      [UserRole.BASIC_PLAN]: 1,
    };

    return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
  };

  useEffect(() => {
    if (!firebaseConfigured) {
      console.warn('Firebase não está configurado. Funcionalidades de autenticação não estão disponíveis.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      try {
        if (user) {
          setCurrentUser(user);
          const userData = await fetchUserData(user);
          setUserData(userData);
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.warn('Erro ao processar dados do usuário:', error);
      }
      setLoading(false);
    });
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchUserData, firebaseConfigured]);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUserRole,
    hasPermission,
    isAuthenticated: !!currentUser,
    firebaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 