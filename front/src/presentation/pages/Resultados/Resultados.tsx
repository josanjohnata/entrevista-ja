import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Lightbulb, FileText, Home, User, CheckCircle, Award, Sparkles, BarChart3, Target } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

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

interface UserProfile {
  displayName?: string;
  professionalTitle?: string;
  about?: string;
  experiences?: Array<{
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    description?: string;
  }>;
}

export const ResultadosPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const analysis = location.state?.analysis as AnalysisResult;
  const improvementData = location.state?.improvementData as ImprovementData | undefined;
  const currentResume = location.state?.currentResume as string | undefined;
  const showOptimizedView = improvementData && improvementData.currentScore >= 75;
  const isLowCompatibility = analysis?.placar < 40;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!analysis) {
      navigate('/');
    }
  }, [analysis, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser || !db) return;
      
      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };
    
    loadProfile();
  }, [currentUser]);

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

  const extractCurrentSummary = (): string => {
    if (!currentResume) return 'Nenhum resumo cadastrado ainda.';
    
    const resumoMatch = currentResume.match(/RESUMO PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|\n\nEXPERIÊNCIA|$)/i);
    return resumoMatch ? resumoMatch[1].trim() : 'Nenhum resumo cadastrado ainda.';
  };

  const extractCurrentExperiences = (): Array<{ company: string; position: string; description: string }> => {
    if (!currentResume) return [];
    
    const expSection = currentResume.match(/EXPERIÊNCIA PROFISSIONAL\s*\n([\s\S]*?)(?=\n\n[A-Z]|$)/i);
    if (!expSection) return [];
    
    const experiences: Array<{ company: string; position: string; description: string }> = [];
    const expBlocks = expSection[1].split(/\n\n(?=[A-Z])/);
    
    for (const block of expBlocks.slice(0, 2)) {
      const lines = block.trim().split('\n');
      if (lines.length >= 2) {
        const firstLine = lines[0];
        const companyPosition = firstLine.split(' - ');
        
        if (companyPosition.length >= 2) {
          const company = companyPosition[0].trim();
          const position = companyPosition[1].trim();
          const description = lines.slice(2).join('\n').trim();
          
          experiences.push({ company, position, description });
        }
      }
    }
    
    return experiences;
  };

  const generateOptimizedResume = (): string => {
    if (!userProfile) {
      return '';
    }

    let resume = `${userProfile.displayName || 'Nome'}\n`;
    resume += `${userProfile.professionalTitle || 'Título Profissional'}\n\n`;
    
    resume += `RESUMO PROFISSIONAL\n`;
    resume += `${analysis.resumoOtimizado}\n\n`;
    
    if (userProfile.experiences && userProfile.experiences.length > 0) {
      resume += `EXPERIÊNCIA PROFISSIONAL\n\n`;
      userProfile.experiences.forEach((exp) => {
        resume += `${exp.company} - ${exp.position}\n`;
        resume += `${exp.startDate} - ${exp.isCurrent ? 'Atual' : exp.endDate || ''}\n`;
        
        let description = exp.description || '';
        if (keywords.length > 0 && description) {
          const keywordsToAdd = keywords.filter(kw => 
            !description.toLowerCase().includes(kw.toLowerCase())
          ).slice(0, 3);
          
          if (keywordsToAdd.length > 0) {
            description += `\n\nPalavras-chave relevantes: ${keywordsToAdd.join(', ')}`;
          }
        }
        resume += `${description}\n\n`;
      });
    }
    
    if (userProfile.education && userProfile.education.length > 0) {
      resume += `FORMAÇÃO ACADÊMICA\n\n`;
      userProfile.education.forEach((edu) => {
        resume += `${edu.institution}\n`;
        resume += `${edu.degree}${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}\n`;
        if (edu.description) {
          resume += `${edu.description}\n`;
        }
        resume += `\n`;
      });
    }
    
    return resume;
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
                        <strong>Análise #{improvementData.analysisCount}</strong> - Seu perfil já está otimizado para esta vaga específica!
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <BarChart3 size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>Evolução:</strong> {improvementData.previousScore}% → {improvementData.currentScore}% (+{improvementData.improvement} pontos)
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        Com {improvementData.currentScore}% de compatibilidade, seu currículo tem grandes chances de passar pela triagem automática desta vaga.
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Target size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <div>
                        <strong>Próximos passos:</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                          <li>Revise seu perfil para garantir que tudo está atualizado</li>
                          <li>Use o resumo otimizado ao aplicar para esta vaga</li>
                          <li>Para melhorar ainda mais, adicione novas experiências ou certificações relevantes ao seu perfil</li>
                        </ul>
                      </div>
                    </div>
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
                        Compare seu perfil atual com as melhorias sugeridas
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
                              <S.ComparisonTitle>{exp.company} - {exp.position}</S.ComparisonTitle>
                              <S.ComparisonContent>
                                {exp.description || 'Sem descrição'}
                              </S.ComparisonContent>
                            </S.ComparisonCard>
                            <S.ComparisonCard variant="after">
                              <S.ComparisonTitle>{exp.company} - {exp.position}</S.ComparisonTitle>
                              <S.ComparisonContent>
                                {exp.description ? `${exp.description}\n\n✨ Palavras-chave sugeridas para incorporar: ${keywords.slice(0, 3).join(', ')}` : `Adicione as palavras-chave relevantes na descrição: ${keywords.slice(0, 3).join(', ')}`}
                              </S.ComparisonContent>
                            </S.ComparisonCard>
                          </S.ComparisonContainer>
                        ))}
                      </div>
                      )}
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

