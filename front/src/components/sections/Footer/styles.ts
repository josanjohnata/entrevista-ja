import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';

export const FooterWrapper = styled.footer`
  border-top: 1px solid ${theme.colors.border.light};
  padding: 2rem 0;
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;  
  
  p {
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;
