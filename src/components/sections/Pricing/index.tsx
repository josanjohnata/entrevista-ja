import React from 'react';
import { Button } from '../../common/Button';
import { FiCheck } from 'react-icons/fi';
import { Container } from '../../common/Container';
import { PricingSection, PricingContent, PricingCard, PriceText } from './styles';
import { FeaturesList, FeatureItem } from '../Features/styles';

const planFeatures = [
  'Acesso a templates de currículo',
  'Filtro Inteligente com o LinkedIn',
  'Análise Instantânea de Currículo',
  'Veja sua compatibilidade com a vaga',
  'Identifique termos essenciais que faltam',
  'Ajustes Precisos para a Entrevista',
  'Acesso a Consultoria de Carreira',
  'Cancele quando quiser',
];

export const Pricing: React.FC = () => {
  return (
    <PricingSection id="preco">
      <Container>
        <PricingContent>
          <h1>Um Preço Simples Para um Retorno Imenso</h1>
          <p style={{ maxWidth: '600px', marginTop: '1rem', fontSize: '1.125rem' }}>
            Chega de enviar centenas de currículos sem resposta. Nosso plano é focado em uma única métrica: o seu "sim" para a entrevista.
          </p>

          <PricingCard>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#a1a1a1' }}>
              Plano Pro Entrevista
            </h3>
            <PriceText>
              R$ 49,00<span>/mês</span>
            </PriceText>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Menos do que um café por dia para destravar sua próxima oportunidade.
            </p>
            <FeaturesList style={{ marginTop: '2rem', textAlign: 'left', gap: '0.75rem' }}>
              {planFeatures.map((feature) => (
                <FeatureItem key={feature} style={{ fontSize: '1rem' }}>
                  <FiCheck size={20} />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeaturesList>
            <Button as="a" href="/checkout" style={{ width: '100%', marginTop: '2rem' }}>
              Assinar Agora e Ser Chamado
            </Button>
          </PricingCard>
        </PricingContent>
      </Container>
    </PricingSection>
  );
};
