import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Section,
    Container,
    SectionTitle,
    SectionSubtitle,
    StepItemContainer,
    StepHeader,
    StepNumber,
    StepTitle,
    StepArrow,
    StepDetails,
    CarouselContainer,
    Carousel,
    TestimonialCard,
    PrevButton,
    NextButton,
    HeroSection,
    Title,
    Subtitle,
    IconWrapper,
    Icon,
    CtaButton,
    Grid,
    Card,
    ChallengeCardContent,
    IconPlaceholder,
    CardTextWrapper,
    GridChallenge,
    IconChallenge,
    SolutionSection,
    SolutionCard,
    ResourcesSection,
    FeatureCard,
    GridResources,
    GridDifferentiator,
    DifferentiatorCardTextWrapper,
    DifferentiatorCardContent,
    DifferentiatorIconPlaceholder,
    SectionSuccessStories,
    FutureSection,
    FutureGrid,
    FutureCard,
    JoinUsCtaSection,
    JoinUsTitle,
    JoinUsSubtitle,
    JoinUsCtaButton,
    JoinUsSocials
} from './styles';
import { challenges, differentiators, featuresData, futurePlans, solutions, stepsData, testimonials } from './data';
import { Header } from '../../components/Header/Header';

const StepItem: React.FC<{ step: typeof stepsData[0], isOpen: boolean, onClick: () => void }> = ({ step, isOpen, onClick }) => (
  <StepItemContainer onClick={onClick}>
    <StepHeader>
      <StepNumber>{step.id}</StepNumber>
      <StepTitle>{step.title}</StepTitle>
      <StepArrow isOpen={isOpen}>▼</StepArrow>
    </StepHeader>
    <StepDetails isOpen={isOpen}><p>{step.details}</p></StepDetails>
  </StepItemContainer>
);

export const LandingPageScreen: React.FC = () => {
  const [openStepId, setOpenStepId] = useState<number | null>(1);
  const handleStepClick = (id: number) => {
    setOpenStepId(openStepId === id ? null : id);
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.5;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
        <Header />

        <HeroSection id="hero">
          <Container>
            <Title>Entrevista Já</Title>
            <Subtitle>Conectando Talentos Juniores às Melhores Oportunidades em Tecnologia</Subtitle>
            <IconWrapper>
              <Icon role="img" aria-label="lupa de busca">🔍</Icon>
            </IconWrapper>
            <CtaButton as={Link} to="/planos">Encontre sua Vaga Agora!</CtaButton>
          </Container>
        </HeroSection>
        
        <Section id="desafio">
          <Container>
            <SectionTitle>O Desafio dos Juniores</SectionTitle>
            <SectionSubtitle>Entendemos os obstáculos que você enfrenta ao iniciar na área de tecnologia.</SectionSubtitle>
            <Grid>
              {challenges.map((item, index) => (
                <Card key={index}>
                  <ChallengeCardContent>
                    <IconPlaceholder><span>{item.icon}</span></IconPlaceholder>
                    <CardTextWrapper>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </CardTextWrapper>
                  </ChallengeCardContent>
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>

        <SolutionSection id="solution">
          <Container>
            <SectionTitle>Nossa Solução: Entrevista Já</SectionTitle>
            <SectionSubtitle>Uma plataforma dedicada a acelerar a sua carreira em tecnologia.</SectionSubtitle>
            <GridChallenge>
              {solutions.map((item, index) => (
                <SolutionCard key={index}>
                  <IconChallenge>{item.icon}</IconChallenge>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </SolutionCard>
              ))}
            </GridChallenge>
          </Container>
        </SolutionSection>
        
        <Section id="como-funciona">
          <Container>
            <SectionTitle>Como Funciona?</SectionTitle>
            <SectionSubtitle>Simples, eficiente e focado em você.</SectionSubtitle>
            <div>
              {stepsData.map(step => <StepItem key={step.id} step={step} isOpen={openStepId === step.id} onClick={() => handleStepClick(step.id)} />)}
            </div>
          </Container>
        </Section>

        <ResourcesSection id="resources">
          <Container>
            <SectionTitle>Recursos e Benefícios</SectionTitle>
            <SectionSubtitle>Descubra tudo o que o Entrevista Já oferece para impulsionar sua jornada profissional.</SectionSubtitle>
            <GridResources>
              {featuresData.map((feature, index) => (
                <FeatureCard key={index}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </FeatureCard>
              ))}
            </GridResources>
          </Container>
        </ResourcesSection>

        <Section id="differentiator">
          <Container>
            <SectionTitle>Nosso Diferencial</SectionTitle>
            <SectionSubtitle>Entenda o que nos torna únicos no apoio à sua carreira júnior.</SectionSubtitle>
            <GridDifferentiator>
              {differentiators.map((item, index) => (
                <Card key={index}>
                  <DifferentiatorCardContent>
                    <DifferentiatorIconPlaceholder><span>{item.icon}</span></DifferentiatorIconPlaceholder>
                    <DifferentiatorCardTextWrapper>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </DifferentiatorCardTextWrapper>
                  </DifferentiatorCardContent>
                </Card>
              ))}
            </GridDifferentiator>
          </Container>
        </Section>

        <SectionSuccessStories id="success-stories">
          <Container>
            <SectionTitle>Casos de Sucesso</SectionTitle>
            <SectionSubtitle>Histórias reais e inspiradoras de talentos como você.</SectionSubtitle>
            <CarouselContainer>
                <Carousel ref={carouselRef}>
                {testimonials.map((t, i) => (
                    <TestimonialCard key={i}>
                    <p className="text">{t.text}</p>
                    <p className="name">{t.name}</p>
                    </TestimonialCard>
                ))}
                </Carousel>
                <PrevButton onClick={() => scroll('left')}>&lt;</PrevButton>
                <NextButton onClick={() => scroll('right')}>&gt;</NextButton>
            </CarouselContainer>
          </Container>
        </SectionSuccessStories>

        <FutureSection id="future">
          <Container>
            <SectionTitle>O Que Esperar do Futuro?</SectionTitle>
            <SectionSubtitle>Estamos sempre evoluindo para oferecer o melhor suporte à sua carreira.</SectionSubtitle>
            <FutureGrid>
              {futurePlans.map((item, index) => (
                <FutureCard key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </FutureCard>
              ))}
            </FutureGrid>
          </Container>
        </FutureSection>

        <JoinUsCtaSection id="join-us">
          <Container>
            <JoinUsTitle>Junte-se à Nossa Comunidade!</JoinUsTitle>
            <JoinUsSubtitle>Seu Caminho para o Sucesso em Tecnologia Começa Aqui.</JoinUsSubtitle>
            <JoinUsCtaButton as={Link} to="/planos">Encontre sua Vaga Agora!</JoinUsCtaButton>
            <JoinUsSocials>Siga-nos nas redes sociais: @Entrevista Já</JoinUsSocials>
          </Container>
        </JoinUsCtaSection>
    </>
  );
};