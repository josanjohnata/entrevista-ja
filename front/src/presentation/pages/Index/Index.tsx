import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Target, TrendingUp, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

import { Button } from '../../../presentation/components/Button';
import { Card } from '../../../presentation/components/Card';
// import { Input } from '../../../presentation/components/Input';
import { Textarea } from '../../../presentation/components/Textarea';
import { Label } from '../../../presentation/components/Label';
import { Container, Page } from '../../../presentation/components/Layout';
import { supabase } from '../../../infrastructure/supabase/client';

import * as S from './Index.styles';

export const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [curriculo, setCurriculo] = useState('');
  const [vaga, setVaga] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                  placeholder="Cole todo o texto do seu currículo aqui... 
                    Exemplo:
                    João Silva
                    Desenvolvedor Full Stack
                    contato@joao.com

                    EXPERIÊNCIA:
                    - Empresa X (2021-2023): Desenvolvedor Sênior..."
                  value={curriculo}
                  onChange={(e) => setCurriculo(e.target.value)}
                  rows={10}
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

