import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import { Container } from '../../common/Container';

export const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.lightGray};
  @media (min-width: ${theme.breakpoints.mobile}) {
    padding: 6rem 0;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 3rem;
  margin-top: 2rem;

  @media (min-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }
`;

export const FeaturesList = styled.ul`
  margin-top: 2rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  font-size: 1.125rem;
  color: ${theme.colors.text};
  
  svg {
    flex-shrink: 0;
    margin-right: 0.75rem;
    margin-top: 0.25rem;
    color: #22c55e; // green-500
  }
`;

export const ContainerFeature = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;