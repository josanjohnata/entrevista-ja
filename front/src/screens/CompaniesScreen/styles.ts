import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const PageWrapper = styled.main`
  background-color: ${colors.neutral[100]};
  padding: 3rem 2rem;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Hero = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: ${colors.primary};
  }
  p {
    font-size: 1.125rem;
    color: ${colors.text};
    margin-top: 0.5rem;
  }
`;

export const CompaniesSection = styled.section`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

export const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const CompanyCard = styled.div`
  background-color: white;
  border: 1px solid #DBDBD4;
  padding: 2rem 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

export const CompanyLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: contain;
  border: 1px solid #eee;
`;

export const CompanyName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.primary};
`;

export const CompanyStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.text};
`;

export const LoadingState = styled.p`
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

export const PageButton = styled.button`
  background-color: white;
  color: ${colors.primary.main};
  border: 1px solid ${colors.primary.main};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${colors.primary.light};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

