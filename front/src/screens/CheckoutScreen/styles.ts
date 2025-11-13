import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const PageWrapper = styled.div`
  background-color: ${colors.background.primary};
  color: ${colors.text.secondary};
  padding: 3rem 2rem;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`;

export const MainContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const MainTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: ${colors.primary.main};
  }
`;

export const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const FormColumn = styled.div`
  background-color: ${colors.neutral[100]};
  color: ${colors.text.secondary};
  padding: 2rem;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const SummaryColumn = styled.div``;

export const FormSection = styled.div`
  margin-bottom: 2.5rem;
`;

export const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  background-color: ${colors.background.primary};
  border: 1px solid #ccc;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  &:focus { outline-color: ${colors.primary.main}; }
`;

export const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  background-color: ${colors.background.primary};
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid #eee;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: fit-content;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.875rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  &.selected {
    border-color: ${colors.primary.main};
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
    
    input[type="radio"] {
      cursor: not-allowed;
    }
    
    span, .details, .icon {
      color: #999 !important;
    }
  }

  input[type="radio"] {
    margin-right: 1rem;
    flex-shrink: 0;
    
    @media (max-width: 480px) {
      margin-right: 0.5rem;
    }
  }

  span:first-of-type {
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
  }

  .details {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 0.875rem;
    color: ${colors.text.secondary};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      white-space: normal;
      word-break: break-word;
    }
  }

  .icon {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.2rem;
    color: #888;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
  }
`;

export const SummaryCard = styled.div`
  background-color: ${colors.neutral[100]};
  padding: 2rem;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const PlanTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const FeatureItem = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    color: ${colors.primary.main};
    font-weight: 600;
  }

  .details {
    color: #aaa;
    margin-top: 0.5rem;
    padding-right: 2rem;
    line-height: 1.5;
  }
`;

export const PriceBox = styled.div`
  background-color: ${colors.neutral[100]};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 2rem;
  
  .installments {
    font-size: 1.5rem;
    span { font-weight: bold; font-size: 2rem; color: ${colors.primary.main}; }
  }

  .full-price {
    font-size: 0.875rem;
    color: ${colors.text.secondary};
    margin-top: 0.5rem;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 1.5rem;
  background-color: ${colors.primary.main};
  color: white;
  transition: background-color 0.3s;
  &:hover { background-color: ${colors.primary.main}; }
`;

export const TermsLink = styled.span`
  color: ${colors.primary.main};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

export const FreeNotice = styled.p`
  color: #6b7280;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
`;

export const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4F4F4F;
`;
