import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.neutral[100]};
  color: ${colors.text};
  padding: 2rem;
`;

export const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: ${colors.primary};
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 900px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Subheading = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background-color: ${colors.primary};
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: ${colors.text};
`;

export const Input = styled.input`
  background-color: ${colors.neutral[100]};
  border: 1px solid #444;
  color: ${colors.text};
  padding: 0.875rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

export const ForgotPasswordLink = styled.a`
  color: ${colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: ${colors.primary};
  }
`;

export const ActionButton = styled.button`
  background-color: ${colors.primary.main};
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: ${colors.primary};
  }
`;

export const DescriptionText = styled.p`
  color: ${colors.text};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
`;

export const WarningBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 0.9rem;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

export const Divider = styled.div`
  margin: 1rem 0;
  text-align: center;
`;

export const DividerText = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

export const GoogleButton = styled(ActionButton)`
  background-color: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
