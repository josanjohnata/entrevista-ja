import React from 'react';
import styled from 'styled-components';
import { theme } from '../GlobalStyles';

const LogoLink = styled.a`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

export const Logo: React.FC = () => {
  return <LogoLink href="/">Entrevista Já</LogoLink>;
};
