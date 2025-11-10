import React from 'react';
import { Container } from '../../common/Container';
import { Logo } from '../../Logo';
import { FooterWrapper, FooterContent } from './styles';

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <Logo />
          <p>© {new Date().getFullYear()} entrevistaja.com.br. Todos os direitos reservados.</p>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
};
