import styled from 'styled-components';
import { theme } from '../../GlobalStyles';
import BackgroundImage from '../../assets/background.png';

export const Hero = styled.header`
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${theme.colors.text};
  padding: 4rem 0;
  text-align: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 0;
  }
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (min-width: ${theme.breakpoints.mobile}) {
    font-size: 3.75rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const MainContent = styled.div`
  padding: 4rem 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 0;
  }
`;

export const FormHeader = styled.div`
  margin-bottom: 1rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${theme.colors.white};
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

