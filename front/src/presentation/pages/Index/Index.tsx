import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Target, TrendingUp, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '../../../presentation/components/Button';
import { Card } from '../../../presentation/components/Card';
// import { Input } from '@/presentation/components/Input';
import { Textarea } from '../../../presentation/components/Textarea';
import { Label } from '../../../presentation/components/Label';
import { Container, Page } from '../../../presentation/components/Layout';
import { supabase } from '../../../infrastructure/supabase/client';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import type { UserProfile } from '../../../screens/ProfileScreen/types';

import * as S from './Index.styles';

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
  const { currentUser } = useAuth();
  const [curriculo, setCurriculo] = useState('');
  const [vaga, setVaga] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!currentUser || !db) {
        if (isMounted) {
          setCurriculo('');
          setVaga('');
          setFileName('');
          setLoadingProfile(false);
        }
        return;
      }

      if (isMounted) {
        setLoadingProfile(true);
      }

      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (isMounted) {
          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as UserProfile;
            
            if (profileData.profileCompleted) {
              const resumeText = formatProfileAsResume(profileData);
              setCurriculo(resumeText);
              toast.success('✨ Currículo preenchido automaticamente com base no seu perfil!');
            } else {
              setCurriculo('');
            }
          } else {
            setCurriculo('');
          }
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
      setCurriculo('');
      setVaga('');
      setFileName('');
    };
  }, [currentUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Formato não suportado. Por favor, envie um arquivo PDF, DOCX ou TXT.');
      return;
    }

    setFileName(file.name);
    setIsProcessingFile(true);

    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        setCurriculo(text);
        toast.success('Arquivo carregado com sucesso!');
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const binaryString = uint8Array.reduce(
            (acc, byte) => acc + String.fromCharCode(byte),
            ''
          );
          const base64 = btoa(binaryString);

          try {
            const { data, error } = await supabase.functions.invoke('parse-document', {
              body: { file: base64, filename: file.name },
            });

            if (error) throw error;

            if (data?.text) {
              setCurriculo(data.text);
              toast.success('Currículo extraído com sucesso!');
            } else {
              throw new Error('Não foi possível extrair o texto do arquivo');
            }
          } catch (err) {
            console.error('Erro ao processar arquivo:', err);
            toast.error('Erro ao processar arquivo. Tente colar o texto manualmente.');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Erro ao carregar arquivo:', error);
      toast.error('Erro ao carregar arquivo');
      setFileName('');
    } finally {
      setIsProcessingFile(false);
      e.target.value = '';
    }
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

      navigate('/resultados', { state: { analysis: data } });
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
                  1. Cole seu currículo ou faça upload do arquivo
                </Label>
                <S.FileUploadContainer>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={isProcessingFile}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    // disabled={isProcessingFile}
                    disabled={true}
                  >
                    {isProcessingFile ? (
                      <>
                        <S.LoadingIcon>
                          <Loader2 size={16} />
                        </S.LoadingIcon>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {fileName || 'Escolher Arquivo'}
                      </>
                    )}
                  </Button>
                </S.FileUploadContainer>
                <Textarea
                  id="curriculo"
                  placeholder={loadingProfile ? "Carregando seu perfil..." : "Cole todo o texto do seu currículo aqui... Ex: João Silva, Desenvolvedor Full Stack, contato@joao.com, EXPERIÊNCIA: Empresa X (2021-2023)..."}
                  value={curriculo}
                  onChange={(e) => setCurriculo(e.target.value)}
                  rows={10}
                  disabled={loadingProfile}
                />
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
              </S.FormGroup>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                fullWidth
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
            </Card>
          </S.FormContainer>
        </Container>
      </S.MainContent>
    </Page>
  );
};

