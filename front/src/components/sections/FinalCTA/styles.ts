import styled from 'styled-components';
import { Button } from '../../common/Button';
import { theme } from '../../../GlobalStyles';

export const CTASection = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary};
  
  @media (min-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 0;
  }
  
  h1 {
    color: ${theme.colors.primary};
    font-size: 1.75rem;
    letter-spacing: -0.02em;
    @media (min-width: ${theme.breakpoints.mobile}) {
      font-size: 2.75rem;
    }
  }
`;

export const CTAButton = styled(Button)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  
  &:hover {
    background-color: ${theme.colors.primary};
    opacity: 1;
  }
`;
