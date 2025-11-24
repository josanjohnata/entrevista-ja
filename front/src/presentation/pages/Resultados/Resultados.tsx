import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  FileText,
  Home,
  User,
  CheckCircle,
  Award,
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';

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
  const currentResume = location.state?.currentResume as string | undefined;
  const showOptimizedView = improvementData && improvementData.currentScore >= 75;
  const isLowCompatibility = analysis?.placar < 40;

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

  // const extractCurrentSummary = (): string => {
  //   if (!currentResume) return 'Nenhum resumo cadastrado ainda.';
    
  //   let resumoMatch = currentResume.match(/RESUMO PROFISSIONAL[:\s]*\n([\s\S]*?)(?=\n\n[A-Z\s]{10,}|EXPERIÊNCIA|FORMAÇÃO|$)/i);
    
  //   if (!resumoMatch) {
  //     resumoMatch = currentResume.match(/RESUMO PROFISSIONAL[:\s]*\n(.*?)(?=\nEXPERIÊNCIA|$)/is);
  //   }
    
  //   return resumoMatch ? resumoMatch[1].trim() : currentResume.split('\n\n')[2] || 'Nenhum resumo cadastrado ainda.';
  // };

  // const extractCurrentExperiences = (): Array<{ company: string; position: string; description: string }> => {
  //   if (!currentResume) return [];
    
  //   const expSection = currentResume.match(/EXPERIÊNCIA PROFISSIONAL[:\s]*\n([\s\S]*?)(?=\n\n[A-Z\s]{10,}|FORMAÇÃO|HABILIDADES|IDIOMAS|$)/i);
    
  //   if (!expSection) return [];
    
  //   const experiences: Array<{ company: string; position: string; description: string }> = [];
  //   const expText = expSection[1].trim();
    
  //   const lines = expText.split('\n');
  //   let currentExp: { position: string; company: string; description: string } | null = null;
    
  //   for (let i = 0; i < lines.length; i++) {
  //     const line = lines[i].trim();
  //     if (!line) continue;
      
  //     const titleMatch = line.match(/^([^-\d]+?)\s*-\s*([^-]+)$/);
      
  //     if (titleMatch && !line.match(/\d{2}\/\d{4}/)) {
  //       if (currentExp && experiences.length < 2) {
  //         experiences.push(currentExp);
  //       }
        
  //       currentExp = {
  //         position: titleMatch[1].trim(),
  //         company: titleMatch[2].trim(),
  //         description: ''
  //       };
  //     } else if (currentExp) {
  //       if (!line.match(/\d{2}\/\d{4}/) && !line.match(/^[A-Z][a-z]+,?\s*[A-Z]/)) {
  //         if (currentExp.description) {
  //           currentExp.description += '\n' + line;
  //         } else {
  //           currentExp.description = line;
  //         }
  //       }
  //     }
  //   }
    
  //   if (currentExp && experiences.length < 2) {
  //     experiences.push(currentExp);
  //   }
    
  //   return experiences;
  // };

  const generateOptimizedResume = (): string => {
    if (!currentResume) {
      return '';
    }

    let optimizedResume = currentResume.replace(
      /RESUMO PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|\n\nEXPERIÊNCIA|$)/i,
      `RESUMO PROFISSIONAL\n${analysis.resumoOtimizado}`
    );
    
    if (keywords.length > 0) {
      const expSection = optimizedResume.match(/EXPERIÊNCIA PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|$)/i);
      if (expSection) {
        let updatedExpSection = expSection[0];

        const missingKeywords = keywords.filter(kw => 
          !updatedExpSection.toLowerCase().includes(kw.toLowerCase())
        ).slice(0, 5);
        
        if (missingKeywords.length > 0) {
          const expBlocks = updatedExpSection.split(/\n\n(?=[A-Z])/);
          if (expBlocks.length > 1) {
            expBlocks[1] += `\n\n✨ Habilidades relevantes demonstradas: ${missingKeywords.join(', ')}`;
            updatedExpSection = expBlocks.join('\n\n');
          }
        }
        
        optimizedResume = optimizedResume.replace(
          /EXPERIÊNCIA PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|$)/i,
          updatedExpSection
        );
      }
    }
    
    return optimizedResume;
  };

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
                    {showOptimizedView ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={24} /> Compatibilidade Otimizada!
                      </span>
                    ) : (
                      'Sua Compatibilidade com a Vaga'
                    )}
                  </S.ScoreTitle>
                  <S.ScoreDescription>
                    {showOptimizedView 
                      ? `Parabéns! Você melhorou de ${improvementData.previousScore}% para ${improvementData.currentScore}% (+${improvementData.improvement} pontos)`
                      : getScoreMessage(analysis.placar)
                    }
                  </S.ScoreDescription>
                </S.ScoreInfo>
                <S.ScoreDisplay>
                  <S.ScoreValue>{showOptimizedView ? improvementData.currentScore : analysis.placar}%</S.ScoreValue>
                  <S.ScoreIcon>
                    {showOptimizedView ? <Award /> : <TrendingUp />}
                  </S.ScoreIcon>
                </S.ScoreDisplay>
              </S.ScoreContent>
            </S.ScoreCard>

            {isLowCompatibility && (
              <S.ContentCard>
                <S.CardHeader>
                  <S.CardIcon style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
                    <AlertCircle />
                  </S.CardIcon>
                  <S.CardHeaderContent>
                    <S.CardTitle>Baixa Compatibilidade com a Vaga</S.CardTitle>
                    <S.CardSubtitle>
                      Esta vaga não está alinhada com sua experiência profissional atual
                    </S.CardSubtitle>
                  </S.CardHeaderContent>
                </S.CardHeader>
                <S.CardContent>
                  <S.SummaryText style={{ background: '#ef444410', borderColor: '#ef4444' }}>
                    <p style={{ marginBottom: '1rem' }}>
                      ⚠️ <strong>Não recomendamos aplicar para esta vaga.</strong>
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      Com apenas {analysis.placar}% de compatibilidade, seu currículo pode não passar pelos sistemas ATS (Applicant Tracking Systems) que filtram candidatos automaticamente.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      <strong>Sugestões:</strong>
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
                      <li>Busque vagas mais alinhadas com suas experiências em: {keywords.slice(0, 3).join(', ')}</li>
                      <li>Desenvolva as habilidades requeridas antes de aplicar</li>
                      <li>Considere posições de nível mais adequado ao seu perfil</li>
                    </ul>
                  </S.SummaryText>
                </S.CardContent>
              </S.ContentCard>
            )}

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
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>Perfil Otimizado!</strong> {improvementData.analysisCount === 2 ? 'Seu perfil evoluiu após aplicar as sugestões.' : 'Seu perfil já está otimizado para esta vaga.'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <BarChart3 size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>Evolução do Score:</strong> {improvementData.previousScore}% → {improvementData.currentScore}% ({improvementData.improvement > 0 ? '+' : ''}{improvementData.improvement} pontos)
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        {improvementData.currentScore >= 70 
                          ? `Com ${improvementData.currentScore}% de compatibilidade, seu currículo tem excelentes chances de passar pela triagem automática desta vaga!`
                          : `Você melhorou ${improvementData.improvement} pontos! Continue otimizando seu perfil para aumentar ainda mais suas chances.`
                        }
                      </div>
                    </div>
                    
                    {improvementData.analysisCount >= 3 && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                        <div>
                          <strong>Análise #{improvementData.analysisCount}:</strong> Seu perfil já está no melhor formato possível para esta vaga. Continue aplicando!
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Target size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>Próximos passos:</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                          <li>Baixe seu currículo otimizado usando o botão abaixo</li>
                          <li>Use-o ao aplicar para esta vaga</li>
                          <li>Continue aprimorando seu perfil com novas experiências e certificações</li>
                        </ul>
                      </div>
                    </div>
                  </S.SummaryText>
                </S.CardContent>
              </S.ContentCard>
            )}

            {!showOptimizedView && !isLowCompatibility && (
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

                {analysis.sugestoesMelhoria && (
                  <S.ContentCard>
                    <S.CardHeader>
                      <S.CardIcon style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
                        <Lightbulb />
                      </S.CardIcon>
                      <S.CardHeaderContent>
                        <S.CardTitle>Comparação Detalhada</S.CardTitle>
                        <S.CardSubtitle>
                          Como reescrever seu currículo para esta vaga específica
                        </S.CardSubtitle>
                      </S.CardHeaderContent>
                    </S.CardHeader>
                    <S.CardContent>
                      <S.SummaryText style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                        {analysis.sugestoesMelhoria}
                      </S.SummaryText>
                    </S.CardContent>
                  </S.ContentCard>
                )}

                {/* <S.ContentCard>
                  <S.CardHeader>
                    <S.CardIcon>
                      <Lightbulb />
                    </S.CardIcon>
                    <S.CardHeaderContent>
                      <S.CardTitle>Comparação Detalhada</S.CardTitle>
                      <S.CardSubtitle>
                        Veja como seu perfil atual se compara com o otimizado
                      </S.CardSubtitle>
                    </S.CardHeaderContent>
                  </S.CardHeader>
                  <S.CardContent>
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} />
                        Resumo Profissional
                      </h3>
                      <S.ComparisonContainer>
                        <S.ComparisonCard variant="before">
                          <S.ComparisonTitle>Versão Atual</S.ComparisonTitle>
                          <S.ComparisonContent>
                            {extractCurrentSummary()}
                          </S.ComparisonContent>
                        </S.ComparisonCard>
                        <S.ComparisonCard variant="after">
                          <S.ComparisonTitle>Versão Otimizada</S.ComparisonTitle>
                          <S.ComparisonContent>
                            {analysis.resumoOtimizado}
                          </S.ComparisonContent>
                        </S.ComparisonCard>
                      </S.ComparisonContainer>
                    </div>

                    {extractCurrentExperiences().length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={20} />
                          Experiências Profissionais (Primeiras 2)
                        </h3>
                        {extractCurrentExperiences().map((exp, index) => (
                          <S.ComparisonContainer key={index} style={{ marginBottom: '1rem' }}>
                            <S.ComparisonCard variant="before">
                              <S.ComparisonTitle>{exp.position} - {exp.company}</S.ComparisonTitle>
                              <S.ComparisonContent>
                                {exp.description || 'Sem descrição'}
                              </S.ComparisonContent>
                            </S.ComparisonCard>
                            <S.ComparisonCard variant="after">
                              <S.ComparisonTitle>{exp.position} - {exp.company}</S.ComparisonTitle>
                              <S.ComparisonContent>
                                {exp.description ? `${exp.description}\n\n✨ Palavras-chave sugeridas para incorporar: ${keywords.slice(0, 3).join(', ')}` : `Adicione as palavras-chave relevantes na descrição: ${keywords.slice(0, 3).join(', ')}`}
                              </S.ComparisonContent>
                            </S.ComparisonCard>
                          </S.ComparisonContainer>
                        ))}
                      </div>
                      )}
                  </S.CardContent>
                </S.ContentCard> */}
              </>
            )}

            <S.ActionContainer>
              <Button 
                onClick={() => navigate('/home', { 
                  state: isLowCompatibility ? { clearJobDescription: true } : undefined 
                })} 
                size="lg" 
                variant={showOptimizedView || isLowCompatibility ? "primary" : "outline"}
              >
                <Home size={20} />
                {showOptimizedView || isLowCompatibility ? 'Analisar Nova Vaga' : 'Analisar Outra Vaga'}
              </Button>
              {!showOptimizedView && !isLowCompatibility && (
                <Button 
                  onClick={() => {
                    const optimizedResume = generateOptimizedResume();
                    navigate('/home', { 
                      state: { 
                        optimizedResume,
                        fromResults: true
                      } 
                    });
                  }} 
                  size="lg" 
                  variant="primary"
                >
                  <FileText size={20} />
                  Aplicar Sugestões no Currículo
                </Button>
              )}
            </S.ActionContainer>
          </S.ResultsContainer>
        </Container>
      </S.MainContent>
    </Page>
  );
};

