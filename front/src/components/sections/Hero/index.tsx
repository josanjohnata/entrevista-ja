import React from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Container } from '../../common/Container';
import { HeroSection, HeroContent, Title, Subtitle, FormContainer, FinePrint } from './styles';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <HeroSection id="hero">
      <Container>
        <HeroContent>
          <Title>Consiga sua Entrevista, Mais Rápido.</Title>
          <Subtitle>
            Nossa plataforma filtra as vagas ideais do LinkedIn e analisa seu currículo com IA, mostrando exatamente o que ajustar para triplicar suas chances de ser chamado.
          </Subtitle>
          <FormContainer>
            <Input type="email" placeholder="Endereço de e-mail" style={{ flex: 1 }} />
            <Button type="submit" as={Link} to="/planos">Assine Agora</Button>
          </FormContainer>
          <FinePrint>
            Comece seu teste agora. Cancele quando quiser.
          </FinePrint>
        </HeroContent>
      </Container>
    </HeroSection>
  );
};
