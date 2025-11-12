import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import {
  Container,
  NotConfiguredContainer,
  InfoSection,
  ExpirationInfo,
  SelectLabel,
  Select,
  RoleDescription,
  MessageBox,
  UpdateButton,
  HierarchySection
} from './styles';

export const AdminPanel: React.FC = () => {
  const { userData, updateUserRole, firebaseConfigured } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.BASIC_PLAN);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRoleUpdate = async () => {
    if (!userData) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      let expirationDate: Date | undefined;
      
      if (selectedRole === UserRole.MONTHLY_PLAN) {
        expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else if (selectedRole === UserRole.ANNUAL_PLAN) {
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }
      
      await updateUserRole(selectedRole, expirationDate);
      setMessage('Role atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      setMessage('Erro ao atualizar role. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions = {
      [UserRole.RECRUITER]: 'Acesso completo a funcionalidades de recrutamento',
      [UserRole.ANNUAL_PLAN]: 'Acesso premium por 1 ano',
      [UserRole.MONTHLY_PLAN]: 'Acesso premium por 1 mês',
      [UserRole.BASIC_PLAN]: 'Acesso básico limitado',
    };
    return descriptions[role];
  };

  if (!firebaseConfigured) {
    return (
      <NotConfiguredContainer>
        <h2>Firebase não configurado</h2>
        <p>Para usar o painel administrativo, configure as variáveis de ambiente do Firebase.</p>
        <p>Consulte o arquivo <code>FIREBASE_AUTH_SETUP.md</code> para instruções detalhadas.</p>
      </NotConfiguredContainer>
    );
  }

  if (!userData) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <Container>
      <h2>Painel de Administração - Gerenciar Permissões</h2>
      
      <InfoSection>
        <strong>Usuário Atual:</strong> {userData.displayName || userData.email}
      </InfoSection>
      
      <InfoSection>
        <strong>Role Atual:</strong> {userData.role}
        {userData.planExpirationDate && (
          <ExpirationInfo>
            Expira em: {userData.planExpirationDate.toLocaleDateString('pt-BR')}
          </ExpirationInfo>
        )}
      </InfoSection>

      <InfoSection>
        <SelectLabel htmlFor="role-select">
          <strong>Alterar para:</strong>
        </SelectLabel>
        <Select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
        >
          <option value={UserRole.BASIC_PLAN}>Plano Básico</option>
          <option value={UserRole.MONTHLY_PLAN}>Plano Mensal</option>
          <option value={UserRole.ANNUAL_PLAN}>Plano Anual</option>
          <option value={UserRole.RECRUITER}>Recrutador/Parceiro</option>
        </Select>
        <RoleDescription>
          {getRoleDescription(selectedRole)}
        </RoleDescription>
      </InfoSection>

      {message && (
        <MessageBox $isSuccess={message.includes('sucesso')}>
          {message}
        </MessageBox>
      )}

      <UpdateButton
        onClick={handleRoleUpdate}
        disabled={loading || selectedRole === userData.role}
      >
        {loading ? 'Atualizando...' : 'Atualizar Role'}
      </UpdateButton>

      <HierarchySection>
        <h4>Hierarquia de Permissões:</h4>
        <ol>
          <li><strong>Recrutador/Parceiro:</strong> Nível máximo de acesso</li>
          <li><strong>Plano Anual:</strong> Acesso premium completo</li>
          <li><strong>Plano Mensal:</strong> Acesso premium limitado</li>
          <li><strong>Plano Básico:</strong> Acesso básico</li>
        </ol>
        <p><em>Usuários com roles superiores têm acesso a funcionalidades de roles inferiores.</em></p>
      </HierarchySection>
    </Container>
  );
}; 