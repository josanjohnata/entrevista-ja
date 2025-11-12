import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { FeaturesSection, FeaturesGrid, ImageContainer, FeaturesList, FeatureItem, ContainerFeature } from './styles';
import HeroImg from '../../../assets/hero.png';

const features = [
  'Filtro Inteligente com o LinkedIn',
  'Análise Instantânea de Currículo',
  'Veja sua compatibilidade com a vaga',
  'Identifique termos essenciais que faltam',
  'Ajustes Precisos para a Entrevista',
  'Acesso a Consultoria de Carreira',
];

export const Features: React.FC = () => {
  return (
    <FeaturesSection id="funcionamento">
      <ContainerFeature>
        <h1>Como Funciona?</h1>
        <FeaturesGrid>
          <ImageContainer>
            <img
              src={HeroImg}
              alt="Ilustração de uma pessoa organizando livros"
            />
          </ImageContainer>
          
          <div>
            <FeaturesList>
              {features.map((feature) => (
                <FeatureItem key={feature}>
                  <FiCheck size={24} />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeaturesList>
          </div>
        </FeaturesGrid>
      </ContainerFeature>
    </FeaturesSection>
  );
};
