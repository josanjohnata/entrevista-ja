import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertCircle, Lightbulb, FileText } from 'lucide-react';

import { Button } from '../../../presentation/components/Button';
import { Badge } from '../../../presentation/components/Badge';
import { Container, Page } from '../../../presentation/components/Layout';

import * as S from './Resultados.styles';

interface AnalysisResult {
  placar: number;
  palavrasChaveFaltando: string;
  resumoOtimizado: string;
  sugestoesMelhoria: string;
}

export const ResultadosPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis as AnalysisResult;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!analysis) {
      navigate('/');
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excelente! Seu currículo está muito alinhado com a vaga.';
    if (score >= 60) return 'Bom, mas ainda há espaço para melhorias.';
    return 'Você pode melhorar significativamente o match com a vaga.';
  };

  const keywords = analysis.palavrasChaveFaltando
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const suggestions = analysis.sugestoesMelhoria
    .split('\n')
    .map((suggestion) => suggestion.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);

  return (
    <Page>
      <S.Hero>
        <Container>
          <S.HeroTitle>Resultados da Otimização</S.HeroTitle>
        </Container>
      </S.Hero>

      <S.MainContent>
        <Container>
          <S.ResultsContainer>
            <S.ScoreCard $score={analysis.placar}>
              <S.ScoreContent>
                <S.ScoreInfo>
                  <S.ScoreTitle>Sua Compatibilidade com a Vaga</S.ScoreTitle>
                  <S.ScoreDescription>{getScoreMessage(analysis.placar)}</S.ScoreDescription>
                </S.ScoreInfo>
                <S.ScoreDisplay>
                  <S.ScoreValue>{analysis.placar}%</S.ScoreValue>
                  <S.ScoreIcon>
                    <TrendingUp />
                  </S.ScoreIcon>
                </S.ScoreDisplay>
              </S.ScoreContent>
            </S.ScoreCard>

            <S.ContentCard>
              <S.CardHeader>
                <S.CardIcon>
                  <FileText />
                </S.CardIcon>
                <S.CardHeaderContent>
                  <S.CardTitle>Resumo Profissional Otimizado</S.CardTitle>
                  <S.CardSubtitle>Use este resumo no topo do seu currículo</S.CardSubtitle>
                </S.CardHeaderContent>
              </S.CardHeader>
              <S.CardContent>
                <S.SummaryText>{analysis.resumoOtimizado}</S.SummaryText>
              </S.CardContent>
            </S.ContentCard>

            <S.ContentCard>
              <S.CardHeader>
                <S.CardIcon style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                  <AlertCircle />
                </S.CardIcon>
                <S.CardHeaderContent>
                  <S.CardTitle>Palavras-Chave Faltando</S.CardTitle>
                  <S.CardSubtitle>Incorpore estas palavras-chave no seu currículo</S.CardSubtitle>
                </S.CardHeaderContent>
              </S.CardHeader>
              <S.CardContent>
                <S.BadgeContainer>
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="warning">
                      {keyword}
                    </Badge>
                  ))}
                </S.BadgeContainer>
              </S.CardContent>
            </S.ContentCard>

            <S.ContentCard>
              <S.CardHeader>
                <S.CardIcon>
                  <Lightbulb />
                </S.CardIcon>
                <S.CardHeaderContent>
                  <S.CardTitle>Sugestões de Melhoria</S.CardTitle>
                  <S.CardSubtitle>
                    Como reformular suas experiências para dar match com a vaga
                  </S.CardSubtitle>
                </S.CardHeaderContent>
              </S.CardHeader>
              <S.CardContent>
                <S.SuggestionsList>
                  {suggestions.map((suggestion, index) => (
                    <S.SuggestionItem key={index}>
                      <S.SuggestionNumber>{index + 1}</S.SuggestionNumber>
                      <S.SuggestionText>{suggestion}</S.SuggestionText>
                    </S.SuggestionItem>
                  ))}
                </S.SuggestionsList>
              </S.CardContent>
            </S.ContentCard>

            <S.ActionContainer>
              <Button onClick={() => navigate(-1)} size="lg" variant="outline">
                <ArrowLeft size={20} />
                Otimizar Outro Currículo
              </Button>
            </S.ActionContainer>
          </S.ResultsContainer>
        </Container>
      </S.MainContent>
    </Page>
  );
};

