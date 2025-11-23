import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiGithub, 
  FiLinkedin,
  FiX, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiExternalLink,
  FiEdit,
  FiDownload,
  FiInfo,
  FiFileText
} from 'react-icons/fi';
import { Sparkles, CheckCircle, Pin, Lightbulb, AlertTriangle } from 'lucide-react';
import { HeaderHome } from '../../components/HeaderHome/HeaderHome';
import { useProfileScreen } from './useProfileScreen';
import { useResumeEditor } from '../../hooks/useResumeEditor';
import { ResumeForm } from '../../components/Resume/ResumeForm';
import { toast } from 'react-toastify';
import {
  PageWrapper,
  Container,
  Sidebar,
  ProfileCard,
  Avatar,
  UserName,
  UserEmail,
  MainContent,
  SectionTitle,
  Form,
  ButtonGroup,
  Button,
  Alert,
  SocialLinks,
  SocialLink,
  CenteredMessage,
  CloseButton,
  FirstAccessBanner,
  AnalysisInfoCard
} from './styles';

export const ProfileScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisInfo, setAnalysisInfo] = useState<{
    palavrasChave?: string[];
    sugestoes?: string[];
  } | null>(null);

  const {
    currentUser,
    profile,
    loading,
    saving,
    message,
    isFirstAccess,
    handleSubmitResumeData,
    dismissMessage,
    isEditing,
    handleEdit,
    handleCancelEdit,
  } = useProfileScreen();

  const {
    resumeData,
    setResumeData,
    downloadPDF,
    isGeneratingPDF,
  } = useResumeEditor({
    profile,
    userEmail: currentUser?.email || undefined,
  });

  useEffect(() => {
    const analysisData = location.state?.analysisData;
    if (analysisData) {
      setAnalysisInfo({
        palavrasChave: analysisData.palavrasChave,
        sugestoes: analysisData.sugestoes
      });
    }
  }, [location.state]);


  if (loading) {
    return (
      <>
        <HeaderHome />
        <PageWrapper>
          <CenteredMessage>
            Carregando perfil...
          </CenteredMessage>
        </PageWrapper>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <HeaderHome />
        <PageWrapper>
          <CenteredMessage>
            Você precisa estar logado para acessar esta página.
          </CenteredMessage>
        </PageWrapper>
      </>
    );
  }

  const getAvatarURL = () => {
    if (currentUser.photoURL) {
      return currentUser.photoURL;
    }
    const name = resumeData.name || currentUser.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=6366F1&color=fff&bold=true`;
  };

  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) {
      return;
    }

    if (!resumeData.name || !resumeData.title) {
      toast.error('Nome e Título Profissional são obrigatórios');
      return;
    }

    await handleSubmitResumeData(resumeData);
  };

  const handleDownloadPDFClick = async () => {
    try {
      await downloadPDF();
      toast.success('Currículo baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF');
    }
  };

  return (
    <>
      <HeaderHome />
      <PageWrapper>
        <Container>
          <Sidebar>
            <ProfileCard>
              <Avatar src={getAvatarURL()} alt={resumeData.name || 'User'} />
              <UserName>{resumeData.name || 'Sem nome'}</UserName>
              <UserEmail>{currentUser.email}</UserEmail>
              
              {(profile?.github || profile?.linkedin) && (
                <SocialLinks>
                  {profile?.github && (
                    <SocialLink href={profile.github} target="_blank" rel="noopener noreferrer">
                      <FiGithub /> GitHub
                      <FiExternalLink size={12} />
                    </SocialLink>
                  )}
                  {profile?.linkedin && (
                    <SocialLink href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      <FiLinkedin /> LinkedIn
                      <FiExternalLink size={12} />
                    </SocialLink>
                  )}
                </SocialLinks>
              )}
            </ProfileCard>
          </Sidebar>

          <MainContent>
            {isFirstAccess && (
              <FirstAccessBanner>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={24} /> Bem-vindo! Complete seu Currículo Profissional
                </h3>
                <p>
                  Para começar a usar a plataforma, precisamos que você preencha algumas informações importantes sobre sua carreira profissional.
                </p>
              </FirstAccessBanner>
            )}

            {message && (
              <Alert type={message.type}>
                {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                <div style={{ flex: 1 }}>
                  {message.text}
                  {message.text.includes('Recarregar do Perfil Atualizado') && (
                    <Button
                      type="button"
                      onClick={() => navigate('/home', { state: { fromProfile: true } })}
                      variant="secondary"
                      style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      Ir para Home e Analisar Novamente
                    </Button>
                  )}
                </div>
                <CloseButton onClick={dismissMessage}>
                  <FiX />
                </CloseButton>
              </Alert>
            )}

            {analysisInfo && (analysisInfo.palavrasChave || analysisInfo.sugestoes) && (
              <AnalysisInfoCard>
                <button 
                  className="close-btn" 
                  onClick={() => setAnalysisInfo(null)}
                  type="button"
                >
                  <FiX size={20} />
                </button>
                <h4>
                  <FiInfo /> Sugestões Aplicadas Automaticamente
                </h4>
                
                <div className="auto-applied" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={18} />
                    <strong>Campos atualizados automaticamente:</strong>
                  </div>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                    <li><strong>Resumo Profissional</strong> - substituído pela versão otimizada</li>
                    {analysisInfo.palavrasChave && analysisInfo.palavrasChave.length > 0 && (
                      <li><strong>Experiências</strong> - palavras-chave distribuídas nas descrições</li>
                    )}
                    <li><strong>Título/Localização/Formação/Idiomas</strong> - verificados e atualizados quando sugeridos</li>
                  </ul>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', opacity: 0.9, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                    <span><strong>Importante:</strong> Revise TODAS as seções antes de salvar. As sugestões foram aplicadas automaticamente mas você deve ajustar conforme necessário.</span>
                  </p>
                </div>
                
                {analysisInfo.palavrasChave && analysisInfo.palavrasChave.length > 0 && (
                  <div className="keywords">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Pin size={18} />
                      <strong>Palavras-chave incorporadas:</strong>
                    </div>
                    <div className="keyword-list">
                      {analysisInfo.palavrasChave.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysisInfo.sugestoes && analysisInfo.sugestoes.length > 0 && (
                  <div className="suggestions">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Lightbulb size={18} />
                      <strong>Outras sugestões para revisar:</strong>
                    </div>
                    <ul>
                      {analysisInfo.sugestoes.slice(0, 5).map((sugestao, index) => (
                        <li key={index}>{sugestao}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AnalysisInfoCard>
            )}

            <Form onSubmit={handleSaveResume}>
              <SectionTitle>
                <FiFileText /> Currículo Profissional
              </SectionTitle>
              
              <ResumeForm 
                data={resumeData}
                onChange={setResumeData}
                disabled={!isEditing}
              />

              <ButtonGroup>
                {isEditing ? (
                  <>
                    {!isFirstAccess && profile?.profileCompleted && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        disabled={saving}
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleDownloadPDFClick}
                      disabled={isGeneratingPDF || saving}
                      style={{ marginLeft: 'auto' }}
                    >
                      <FiDownload /> {isGeneratingPDF ? 'Gerando...' : 'Baixar PDF'}
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? 'Salvando...' : isFirstAccess ? 'Concluir Cadastro' : 'Salvar Currículo'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="primary" 
                      onClick={handleEdit}
                    >
                      <FiEdit /> Editar Currículo
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleDownloadPDFClick}
                      disabled={isGeneratingPDF}
                    >
                      <FiDownload /> {isGeneratingPDF ? 'Gerando PDF...' : 'Baixar PDF'}
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </Form>
          </MainContent>
        </Container>
      </PageWrapper>
    </>
  );
};
