import React from 'react';
import styled from 'styled-components';
import { theme } from '../GlobalStyles';
import { Link } from 'react-router-dom';

const LogoLink = styled.a`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

export const Logo: React.FC = () => {
  return <LogoLink as={Link} to="/home">Entrevista Já</LogoLink>;
};
