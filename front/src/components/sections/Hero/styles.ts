import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import BackgroundImage from '../../../assets/Background.png';

export const HeroSection = styled.section`
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 5rem 0;
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 8rem 0;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 2rem;
  letter-spacing: -0.02em;
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

export const Subtitle = styled.p`
  margin-top: 1.5rem;
  max-width: 800px;
  font-size: 1.125rem;
  color: ${theme.colors.text.secondary};
`;

export const FormContainer = styled.div`
  margin-top: 2.5rem;
  display: flex;
  width: 100%;
  max-width: 550px;
  gap: 0.5rem;
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export const FinePrint = styled.p`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: ${theme.colors.text.secondary};
`;
