import React from 'react';
import { Container } from '../../common/Container';
import { CTASection, CTAButton } from './styles';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <CTASection id="cta-final">
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1>Pronto Para Parar de Enviar Currículos em Vão?</h1>
        <p style={{ maxWidth: '600px', marginTop: '1rem', fontSize: '1.125rem' }}>
          Deixe nossa tecnologia fazer o trabalho pesado de análise e otimização. Foque no que realmente importa: se preparar para as entrevistas que você <strong>vai</strong> conseguir.
        </p>
        <CTAButton as={Link} to="/planos" style={{ marginTop: '2.5rem' }}>
          Assine Agora
        </CTAButton>
      </Container>
    </CTASection>
  );
};
