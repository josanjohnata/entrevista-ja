import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Lightbulb, FileText, Home, User, CheckCircle, Award } from 'lucide-react';

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

interface ImprovementData {
  previousScore: number;
  currentScore: number;
  improvement: number;
  analysisCount: number;
}

export const ResultadosPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis as AnalysisResult;
  const improvementData = location.state?.improvementData as ImprovementData | undefined;
  const showOptimizedView = improvementData && improvementData.currentScore >= 75;

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
                  <S.ScoreTitle>
                    {showOptimizedView ? '🎉 Compatibilidade Otimizada!' : 'Sua Compatibilidade com a Vaga'}
                  </S.ScoreTitle>
                  <S.ScoreDescription>
                    {showOptimizedView 
                      ? `Parabéns! Você melhorou de ${improvementData.previousScore}% para ${improvementData.currentScore}% (+${improvementData.improvement} pontos)`
                      : getScoreMessage(analysis.placar)
                    }
                  </S.ScoreDescription>
                </S.ScoreInfo>
                <S.ScoreDisplay>
                  <S.ScoreValue>{analysis.placar}%</S.ScoreValue>
                  <S.ScoreIcon>
                    {showOptimizedView ? <Award /> : <TrendingUp />}
                  </S.ScoreIcon>
                </S.ScoreDisplay>
              </S.ScoreContent>
            </S.ScoreCard>

            {showOptimizedView && (
              <S.ContentCard>
                <S.CardHeader>
                  <S.CardIcon style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                    <CheckCircle />
                  </S.CardIcon>
                  <S.CardHeaderContent>
                    <S.CardTitle>Perfil Otimizado para Esta Vaga</S.CardTitle>
                    <S.CardSubtitle>
                      Este é o melhor score possível com base no seu perfil atual
                    </S.CardSubtitle>
                  </S.CardHeaderContent>
                </S.CardHeader>
                <S.CardContent>
                  <S.SummaryText style={{ background: '#10b98110', borderColor: '#10b981' }}>
                    ✅ <strong>Análise #{improvementData.analysisCount}</strong> - Seu perfil já está otimizado para esta vaga específica!
                    <br /><br />
                    📊 <strong>Evolução:</strong> {improvementData.previousScore}% → {improvementData.currentScore}% (+{improvementData.improvement} pontos)
                    <br /><br />
                    💡 Com {analysis.placar}% de compatibilidade, seu currículo tem grandes chances de passar pela triagem automática desta vaga.
                    <br /><br />
                    🎯 <strong>Próximos passos:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      <li>Revise seu perfil para garantir que tudo está atualizado</li>
                      <li>Use o resumo otimizado ao aplicar para esta vaga</li>
                      <li>Para melhorar ainda mais, adicione novas experiências ou certificações relevantes ao seu perfil</li>
                    </ul>
                  </S.SummaryText>
                </S.CardContent>
              </S.ContentCard>
            )}

            {!showOptimizedView && (
              <>
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
              </>
            )}

            <S.ActionContainer>
              <Button onClick={() => navigate('/home')} size="lg" variant={showOptimizedView ? "primary" : "outline"}>
                <Home size={20} />
                {showOptimizedView ? 'Analisar Nova Vaga' : 'Analisar Outra Vaga'}
              </Button>
              {!showOptimizedView && (
                <Button 
                  onClick={() => navigate('/profile', { 
                    state: { 
                      analysisData: {
                        resumoOtimizado: analysis.resumoOtimizado,
                        palavrasChave: keywords,
                        sugestoes: suggestions,
                        sugestoesMelhoriaTexto: analysis.sugestoesMelhoria,
                        placar: analysis.placar
                      }
                    } 
                  })} 
                  size="lg" 
                  variant="primary"
                >
                  <User size={20} />
                  Atualizar Perfil com Sugestões
                </Button>
              )}
            </S.ActionContainer>
          </S.ResultsContainer>
        </Container>
      </S.MainContent>
    </Page>
  );
};

