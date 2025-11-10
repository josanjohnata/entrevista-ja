import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const Section = styled.section`
  padding: 4rem 0;
  @media (min-width: 768px) {
    padding: 5rem 0;
  }
`;

export const SectionTitle = styled.h2`
color: ${colors.textDark};
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-top: 1rem;
  text-align: center;
`;

export const ContactSection = styled(Section)`
  background-color: ${colors.background};
  color: ${colors.textDark};
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 4rem;
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
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.primary};
  display: inline-block;
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  color: ${colors.textMedium};
  margin-bottom: -1rem;
`;

export const Input = styled.input`
  width: 100%;
  background-color: ${colors.backgroundLight};
  border: 1px solid #444;
  color: ${colors.textDark};
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  background-color: ${colors.backgroundLight};
  border: 1px solid #444;
  color: ${colors.textDark};
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const SubmitButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-start;

  &:hover {
    background-color: ${colors.primaryDark};
  }
`;

export const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

export const ContactInfoItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.backgroundLight};
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #444;
  
  svg {
    color: ${colors.textMedium};
    margin-right: 1rem;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;

export const FaqTitle = styled(SectionTitle)`
  margin-top: 4rem;
  color: ${colors.textDark};
`;

export const FaqWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FaqItem = styled.div`
  background-color: ${colors.backgroundLight};
  border-radius: 6px;
  border: 1px solid #444;
  overflow: hidden;
`;

export const QuestionButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.25rem;
  background: none;
  border: none;
  color: ${colors.textDark};
  font-size: 1.125rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
`;

export const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 1.5rem;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;

export const AnswerWrapper = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
  color: ${colors.textMedium};
  
  p {
    padding: 0 1.25rem 1.25rem 1.25rem;
    line-height: 1.6;
    margin: 0;
  }
`;
