import styled from 'styled-components';

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const ErrorCode = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 8rem;
  }
`;

export const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

export const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
`;

export const ButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

