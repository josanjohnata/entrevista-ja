import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Sparkles, Target, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { pdf, Document, Page as PDFPage, Text, View, StyleSheet } from '@react-pdf/renderer';

import { Button } from '../../../presentation/components/Button';
import { Card } from '../../../presentation/components/Card';
import { Textarea } from '../../../presentation/components/Textarea';
import { Label } from '../../../presentation/components/Label';
import { Container, Page } from '../../../presentation/components/Layout';
import { supabase } from '../../../infrastructure/supabase/client';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import type { UserProfile } from '../../../screens/ProfileScreen/types';

import * as S from './Index.styles';
import { FiDownload } from 'react-icons/fi';

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #0A66C2',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginTop: 15,
    marginBottom: 8,
    borderBottom: '1 solid #E0E0E0',
    paddingBottom: 3,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 5,
    textAlign: 'justify',
  },
  bold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  item: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  contactInfo: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
  },
});

const ResumePDFDocument = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const sections: Array<{ title?: string; content: string[] }> = [];
  let currentSection: { title?: string; content: string[] } = { content: [] };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
        currentSection = { content: [] };
      }
      return;
    }

    const isTitle = trimmed === trimmed.toUpperCase() && 
                    trimmed.length < 50 && 
                    trimmed.length > 2 &&
                    !trimmed.match(/^\d/) &&
                    currentSection.content.length === 0;

    if (isTitle) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmed, content: [] };
    } else {
      currentSection.content.push(line);
    }
  });

  if (currentSection.content.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  return (
    <Document>
      <PDFPage size="A4" style={pdfStyles.page}>
        {sections.map((section, sectionIndex) => {
          const isHeader = sectionIndex === 0 && !section.title;
          
          if (isHeader) {
            return (
              <View key={sectionIndex} style={pdfStyles.header}>
                {section.content.slice(0, 3).map((line, i) => (
                  <Text key={i} style={i === 0 ? pdfStyles.name : pdfStyles.subtitle}>
                    {line}
                  </Text>
                ))}
                {section.content.slice(3).map((line, i) => (
                  <Text key={`contact-${i}`} style={pdfStyles.contactInfo}>
                    {line}
                  </Text>
                ))}
              </View>
            );
          }

          return (
            <View key={sectionIndex} style={{ marginBottom: 12 }}>
              {section.title && (
                <Text style={pdfStyles.sectionTitle}>{section.title}</Text>
              )}
              {section.content.map((line, lineIndex) => {
                const isBold = line.match(/^[A-Z][^-•\n]{10,60}$/) || 
                              line.includes(' - ') && !line.startsWith('-') && !line.startsWith('•');
                
                return (
                  <Text 
                    key={lineIndex} 
                    style={isBold ? pdfStyles.bold : pdfStyles.text}
                  >
                    {line}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </PDFPage>
    </Document>
  );
};

const formatProfileAsResume = (profile: UserProfile): string => {
  let resume = '';

  resume += `${profile.displayName}\n`;
  if (profile.professionalTitle) {
    resume += `${profile.professionalTitle}\n`;
  }
  resume += `${profile.email}\n`;
  if (profile.phone) {
    resume += `${profile.phone}\n`;
  }
  if (profile.location) {
    resume += `${profile.location}\n`;
  }
  if (profile.linkedin) {
    resume += `LinkedIn: ${profile.linkedin}\n`;
  }
  if (profile.github) {
    resume += `GitHub: ${profile.github}\n`;
  }
  resume += '\n';

  if (profile.about) {
    resume += `RESUMO PROFISSIONAL:\n${profile.about}\n\n`;
  }

  if (profile.experiences && profile.experiences.length > 0) {
    resume += `EXPERIÊNCIA PROFISSIONAL:\n\n`;
    profile.experiences.forEach((exp) => {
      resume += `${exp.position} - ${exp.company}\n`;
      if (exp.location) {
        resume += `${exp.location}\n`;
      }
      const endDate = exp.isCurrent ? 'Atual' : (exp.endDate || '');
      resume += `${exp.startDate} - ${endDate}\n`;
      if (exp.description) {
        resume += `${exp.description}\n`;
      }
      resume += '\n';
    });
  }

  if (profile.education && profile.education.length > 0) {
    resume += `FORMAÇÃO ACADÊMICA:\n\n`;
    profile.education.forEach((edu) => {
      resume += `${edu.institution}\n`;
      if (edu.degree) {
        resume += `${edu.degree}`;
        if (edu.fieldOfStudy) {
          resume += ` em ${edu.fieldOfStudy}`;
        }
        resume += '\n';
      }
      if (edu.startDate || edu.endDate) {
        resume += `${edu.startDate || ''} - ${edu.endDate || ''}\n`;
      }
      resume += '\n';
    });
  }

  if (profile.languages && profile.languages.length > 0) {
    resume += `IDIOMAS:\n`;
    const proficiencyMap: Record<string, string> = {
      basic: 'Básico',
      intermediate: 'Intermediário',
      professional: 'Profissional',
      native: 'Nativo',
    };
    profile.languages.forEach((lang) => {
      const proficiency = proficiencyMap[lang.proficiency] || lang.proficiency;
      resume += `- ${lang.language}: ${proficiency}\n`;
    });
  }

  return resume.trim();
};

export const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [curriculo, setCurriculo] = useState('');
  const [vaga, setVaga] = useState(() => {
    const savedVaga = localStorage.getItem('lastJobDescription');
    return savedVaga || '';
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const isFirstLoad = useRef(true);

  const loadProfile = useCallback(async (showToast = true) => {
    if (!currentUser || !db) {
      setCurriculo('');
      setVaga('');
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    setIsReloading(true);

    try {
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const profileData = profileSnap.data() as UserProfile;
        
        if (profileData.profileCompleted) {
          const resumeText = formatProfileAsResume(profileData);
          setCurriculo(resumeText);
          if (showToast) {
            toast.success('Currículo atualizado com base no seu perfil!');
          }
        } else {
          setCurriculo('');
        }
      } else {
        setCurriculo('');
      }
    } finally {
      setLoadingProfile(false);
      setIsReloading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      if (!currentUser || !db) {
        if (isMounted) {
          setCurriculo('');
          setVaga('');
          setLoadingProfile(false);
        }
        return;
      }

      await loadProfile(false);
      isFirstLoad.current = false;
    };

    initialLoad();

    return () => {
      isMounted = false;
      setCurriculo('');
      setVaga('');
    };
  }, [currentUser, loadProfile]);

  useEffect(() => {
    const fromProfile = location.state?.fromProfile;
    if (fromProfile && currentUser && db && !isFirstLoad.current) {
      loadProfile(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, currentUser, loadProfile]);

  useEffect(() => {
    const state = location.state as { optimizedResume?: string; fromResults?: boolean } | null;
    
    if (state?.fromResults && state?.optimizedResume) {
      console.log('Aplicando currículo otimizado:', state.optimizedResume.substring(0, 100));
      setCurriculo(state.optimizedResume);
      toast.success('✨ Currículo atualizado com as sugestões!');
      
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (vaga.trim()) {
      localStorage.setItem('lastJobDescription', vaga);
    }
  }, [vaga]);

  const generateJobHash = (jobDescription: string): string => {
    const normalized = jobDescription.trim().toLowerCase().replace(/\s+/g, ' ').substring(0, 200);
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  };

  const handleDownloadResume = async () => {
    if (!curriculo.trim()) {
      toast.error('Não há currículo para baixar');
      return;
    }

    try {
      const blob = await pdf(<ResumePDFDocument content={curriculo} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `curriculo_atualizado_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Currículo PDF baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar currículo:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleClearVaga = () => {
    setVaga('');
    localStorage.removeItem('lastJobDescription');
    toast.success('Descrição da vaga limpa!');
  };

  const handleAnalyze = async () => {
    if (!curriculo.trim() || !vaga.trim()) {
      toast.error('Por favor, preencha ambos os campos: currículo e descrição da vaga.');
      return;
    }

    const curriculoNormalizado = curriculo.trim().toLowerCase().replace(/\s+/g, ' ');
    const vagaNormalizada = vaga.trim().toLowerCase().replace(/\s+/g, ' ');

    if (curriculoNormalizado === vagaNormalizada) {
      toast.error('O currículo e a descrição da vaga não podem ser iguais. Por favor, cole a descrição real da vaga.');
      return;
    }

    const similarity = curriculoNormalizado.length > 0 
      ? (vagaNormalizada.includes(curriculoNormalizado.substring(0, Math.floor(curriculoNormalizado.length * 0.8))) ? 1 : 0)
      : 0;

    if (similarity > 0 || curriculoNormalizado.includes(vagaNormalizada.substring(0, Math.floor(vagaNormalizada.length * 0.8)))) {
      toast.error('Os campos parecem conter o mesmo conteúdo. Por favor, cole sua descrição de vaga real.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analisar-curriculo', {
        body: { curriculo, vaga },
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Limite de requisições atingido. Por favor, tente novamente em alguns instantes.');
        } else if (error.message?.includes('402')) {
          toast.error('Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage.');
        } else {
          throw error;
        }
        return;
      }

      const jobHash = generateJobHash(vaga);
      
      const analysisHistory = localStorage.getItem('analysisHistory');
      const history = analysisHistory ? JSON.parse(analysisHistory) : {};
      
      const previousAnalysis = history[jobHash];
      const currentScore = data.placar;
      
      let improvementData = null;
      
      if (previousAnalysis) {
        const analysisCount = (previousAnalysis.analysisCount || 1) + 1;
        
        if (analysisCount >= 2 && currentScore >= 75) {
          const optimizedScore = currentScore < 99 ? 99 : currentScore;
          const scoreImprovement = optimizedScore - previousAnalysis.score;
          
          improvementData = {
            previousScore: previousAnalysis.score,
            currentScore: optimizedScore,
            improvement: scoreImprovement,
            analysisCount: analysisCount
          };
        }
      }
      
      history[jobHash] = {
        score: currentScore,
        date: new Date().toISOString(),
        analysisCount: previousAnalysis ? (previousAnalysis.analysisCount || 1) + 1 : 1
      };
      localStorage.setItem('analysisHistory', JSON.stringify(history));

      navigate('/resultados', { 
        state: { 
          analysis: data,
          jobHash: jobHash,
          improvementData: improvementData
        } 
      });
    } catch (error) {
      console.error('Erro ao analisar currículo:', error);
        toast.error('Ocorreu um erro ao processar sua análise. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Page>
      <S.Hero>
        <Container>
          <S.HeroTitle>Currículo Turbo</S.HeroTitle>
          <S.HeroSubtitle>Passe na triagem. Consiga a entrevista.</S.HeroSubtitle>
        </Container>
      </S.Hero>

      <S.FeaturesSection>
        <Container>
          <S.FeaturesGrid>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Target />
              </S.FeatureIcon>
              <S.FeatureTitle>Score de Match</S.FeatureTitle>
              <S.FeatureDescription>
                Veja sua compatibilidade com a vaga em %
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <Sparkles />
              </S.FeatureIcon>
              <S.FeatureTitle>Palavras-Chave</S.FeatureTitle>
              <S.FeatureDescription>
                Identifique termos essenciais que faltam
              </S.FeatureDescription>
            </S.FeatureCard>
            <S.FeatureCard>
              <S.FeatureIcon>
                <TrendingUp />
              </S.FeatureIcon>
              <S.FeatureTitle>Sugestões IA</S.FeatureTitle>
              <S.FeatureDescription>
                Receba dicas personalizadas de melhoria
              </S.FeatureDescription>
            </S.FeatureCard>
          </S.FeaturesGrid>
        </Container>
      </S.FeaturesSection>

      <S.MainContent>
        <Container>
          <S.FormContainer>
            <Card>
              <S.FormGroup>
                <Label htmlFor="curriculo">
                  1. Cole seu currículo
                </Label>
                <Textarea
                  id="curriculo"
                  placeholder={loadingProfile ? "Carregando seu perfil..." : "Cole todo o texto do seu currículo aqui... Ex: João Silva, Desenvolvedor Full Stack, contato@joao.com, EXPERIÊNCIA: Empresa X (2021-2023)..."}
                  value={curriculo}
                  onChange={(e) => setCurriculo(e.target.value)}
                  rows={10}
                  disabled={loadingProfile}
                />
                {currentUser && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadProfile(true)}
                      disabled={isReloading || loadingProfile}
                    >
                      {isReloading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Recarregando...
                        </>
                      ) : (
                        <>
                          <Loader2 size={16} />
                          Recarregar do Perfil
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDownloadResume}
                      disabled={!curriculo.trim()}
                    >
                      <FiDownload size={16} />
                      Baixar Currículo (PDF)
                    </Button>
                  </div>
                )}
              </S.FormGroup>

              <S.FormGroup>
                <Label htmlFor="vaga">2. Cole a descrição da vaga aqui</Label>
                <Textarea
                  id="vaga"
                  placeholder="Cole a descrição completa da vaga para a qual você quer aplicar...
                    Exemplo:
                    Desenvolvedor Full Stack Sênior

                    Requisitos:
                    - 5+ anos de experiência com React e Node.js
                    - Experiência com TypeScript
                    - Conhecimento em AWS..."
                  value={vaga}
                  onChange={(e) => setVaga(e.target.value)}
                  rows={10}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    size="lg"
                    variant="primary"
                    style={{ flex: 1 }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={20} className="spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Analisar e Otimizar Agora
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClearVaga}
                    disabled={!vaga.trim()}
                    size="lg"
                    variant="outline"
                  >
                    Limpar Vaga
                  </Button>
                </div>
              </S.FormGroup>
            </Card>
          </S.FormContainer>
        </Container>
      </S.MainContent>
    </Page>
  );
};

