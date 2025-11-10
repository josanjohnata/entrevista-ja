import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 500px;
  margin: 2rem auto;
`;

export const NotConfiguredContainer = styled(Container)`
  text-align: center;
`;

export const InfoSection = styled.div`
  margin-bottom: 1rem;
`;

export const ExpirationInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

export const SelectLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const RoleDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

interface MessageBoxProps {
  $isSuccess: boolean;
}

export const MessageBox = styled.div<MessageBoxProps>`
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: ${props => props.$isSuccess ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$isSuccess ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.$isSuccess ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 4px;
`;

interface UpdateButtonProps {
  disabled: boolean;
}

export const UpdateButton = styled.button<UpdateButtonProps>`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.disabled ? '#ccc' : '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#0056b3'};
  }
`;

export const HierarchySection = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #666;
`;

