import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiGithub, 
  FiLinkedin,
  FiX, 
  FiMail, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiExternalLink,
  FiBriefcase,
  FiBookOpen,
  FiGlobe,
  FiPlus,
  FiPhone,
  FiMapPin,
  FiEdit,
  FiDownload,
  FiInfo
} from 'react-icons/fi';
import { Sparkles, CheckCircle, Pin, Lightbulb, AlertTriangle } from 'lucide-react';
import { HeaderHome } from '../../components/HeaderHome/HeaderHome';
import { useProfileScreen } from './useProfileScreen';
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
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  Alert,
  SocialLinks,
  SocialLink,
  HelpText,
  CenteredMessage,
  CloseButton,
  Section,
  SectionHeader,
  SectionSubtitle,
  AddButton,
  RepeatableItem,
  RepeatableItemHeader,
  RepeatableItemTitle,
  RemoveItemButton,
  FormRow,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox,
  Select,
  EmptyState,
  RequiredBadge,
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
    uploadingFile,
    message,
    isFirstAccess,
    
    displayName,
    setDisplayName,
    professionalTitle,
    setProfessionalTitle,
    phone,
    setPhone,
    location: userLocation,
    setLocation,
    linkedin,
    setLinkedin,
    github,
    setGithub,
    
    about,
    setAbout,
    
    experiences,
    addExperience,
    updateExperience,
    removeExperience,
    
    education,
    addEducation,
    updateEducation,
    removeEducation,
    
    languages,
    addLanguage,
    updateLanguage,
    removeLanguage,
    
    handleSubmit,
    dismissMessage,
    
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDownloadResume,
  } = useProfileScreen();

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
    const name = displayName || currentUser.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=6366F1&color=fff&bold=true`;
  };

  return (
    <>
      <HeaderHome />
      <PageWrapper>
        <Container>
          <Sidebar>
            <ProfileCard>
              <Avatar src={getAvatarURL()} alt={displayName || 'User'} />
              <UserName>{displayName || 'Sem nome'}</UserName>
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
                  <Sparkles size={24} /> Bem-vindo! Complete seu perfil
                </h3>
                <p>
                  Para começar a usar a plataforma, precisamos que você preencha algumas informações importantes sobre sua carreira profissional.
                  Os campos marcados com <RequiredBadge>*</RequiredBadge> são obrigatórios.
                </p>
              </FirstAccessBanner>
            )}

            <SectionTitle>
              <FiUser /> Informações do Perfil
            </SectionTitle>

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

            <Form onSubmit={handleSubmit}>
              <fieldset disabled={!isEditing} style={{ border: 'none', padding: 0, margin: 0 }}>
              <Section>
                <SectionSubtitle>
                  <FiUser /> Dados Pessoais
                </SectionSubtitle>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="displayName">
                      Nome Completo {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={isFirstAccess}
                      disabled={!isEditing}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="professionalTitle">
                      Título Profissional
                    </Label>
                    <Input
                      id="professionalTitle"
                      type="text"
                      placeholder="Ex: Software Engineer, Designer"
                      value={professionalTitle}
                      onChange={(e) => setProfessionalTitle(e.target.value)}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="email">
                    <FiMail /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser.email || ''}
                    disabled
                    readOnly
                  />
                  <HelpText>O email não pode ser alterado</HelpText>
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="phone">
                      <FiPhone /> Telefone/Celular
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+55 11 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="location">
                      <FiMapPin /> Localização
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Ex: São Paulo, Brasil"
                      value={userLocation}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="linkedin">
                      <FiLinkedin /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/seu-perfil"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      disabled={!isEditing}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="github">
                      <FiGithub /> GitHub (opcional)
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/seu-usuario"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                </FormRow>
              </Section>

              <Section>
                <SectionSubtitle>Resumo Profissional</SectionSubtitle>
                
                <FormGroup>
                  <Label htmlFor="about">
                    Sobre você {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                  </Label>
                  <TextArea
                    id="about"
                    placeholder="Conte um pouco sobre você, suas experiências, habilidades e objetivos profissionais..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    required={isFirstAccess}
                    disabled={!isEditing}
                    style={{ minHeight: '150px' }}
                  />
                  <HelpText>
                    Descreva sua trajetória profissional, principais competências e o que você busca na carreira.
                  </HelpText>
                </FormGroup>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionSubtitle>
                    <FiBriefcase /> Experiência Profissional {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                  </SectionSubtitle>
                  {isEditing && (
                    <AddButton type="button" onClick={addExperience}>
                      <FiPlus /> Adicionar Experiência
                    </AddButton>
                  )}
                </SectionHeader>

                {experiences.length === 0 ? (
                  <EmptyState>
                    Nenhuma experiência adicionada. Clique em "Adicionar Experiência" para começar.
                  </EmptyState>
                ) : (
                  experiences.map((exp, index) => (
                    <RepeatableItem key={exp.id}>
                      <RepeatableItemHeader>
                        <RepeatableItemTitle>Experiência #{index + 1}</RepeatableItemTitle>
                        {isEditing && (
                          <RemoveItemButton type="button" onClick={() => removeExperience(exp.id)}>
                            <FiX /> Remover
                          </RemoveItemButton>
                        )}
                      </RepeatableItemHeader>

                      <FormRow>
                        <FormGroup>
                          <Label>
                            Empresa {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                          </Label>
                          <Input
                            type="text"
                            placeholder="Nome da empresa"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            required={isFirstAccess}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>
                            Cargo {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                          </Label>
                          <Input
                            type="text"
                            placeholder="Seu cargo"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            required={isFirstAccess}
                          />
                        </FormGroup>
                      </FormRow>

                      <FormGroup>
                        <Label>Localização da Empresa</Label>
                        <Input
                          type="text"
                          placeholder="Ex: Toronto, Ontario, Canada"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        />
                      </FormGroup>

                      <FormRow>
                        <FormGroup>
                          <Label>
                            Data de Início {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                          </Label>
                          <Input
                            type="text"
                            placeholder="MM/AAAA"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            required={isFirstAccess}
                            maxLength={7}
                          />
                          <HelpText>Formato: MM/AAAA (ex: 01/2020)</HelpText>
                        </FormGroup>

                        {!exp.isCurrent && (
                          <FormGroup>
                            <Label>Data de Término</Label>
                            <Input
                              type="text"
                              placeholder="MM/AAAA"
                              value={exp.endDate || ''}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              maxLength={7}
                            />
                            <HelpText>Formato: MM/AAAA (ex: 12/2023)</HelpText>
                          </FormGroup>
                        )}
                      </FormRow>

                      <CheckboxGroup>
                        <Checkbox
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.isCurrent}
                          onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                        />
                        <CheckboxLabel htmlFor={`current-${exp.id}`}>
                          Trabalho aqui atualmente
                        </CheckboxLabel>
                      </CheckboxGroup>

                      <FormGroup>
                        <Label>Descrição das Atividades</Label>
                        <TextArea
                          placeholder="Descreva suas responsabilidades, conquistas e projetos relevantes..."
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        />
                      </FormGroup>
                    </RepeatableItem>
                  ))
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <SectionSubtitle>
                    <FiBookOpen /> Formação Acadêmica {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                  </SectionSubtitle>
                  {isEditing && (
                    <AddButton type="button" onClick={addEducation}>
                      <FiPlus /> Adicionar Formação
                    </AddButton>
                  )}
                </SectionHeader>

                {education.length === 0 ? (
                  <EmptyState>
                    Nenhuma formação adicionada. Clique em "Adicionar Formação" para começar.
                  </EmptyState>
                ) : (
                  education.map((edu, index) => (
                    <RepeatableItem key={edu.id}>
                      <RepeatableItemHeader>
                        <RepeatableItemTitle>Formação #{index + 1}</RepeatableItemTitle>
                        {isEditing && (
                          <RemoveItemButton type="button" onClick={() => removeEducation(edu.id)}>
                            <FiX /> Remover
                          </RemoveItemButton>
                        )}
                      </RepeatableItemHeader>

                      <FormGroup>
                        <Label>
                          Instituição de Ensino {isFirstAccess && <RequiredBadge>*</RequiredBadge>}
                        </Label>
                        <Input
                          type="text"
                          placeholder="Nome da instituição"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          required={isFirstAccess}
                        />
                      </FormGroup>

                      <FormRow>
                        <FormGroup>
                          <Label>Grau / Tipo de Diploma</Label>
                          <Input
                            type="text"
                            placeholder="Ex: Bacharelado, Pós-graduação, Técnico"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Área de Estudo / Curso</Label>
                          <Input
                            type="text"
                            placeholder="Ex: Ciência da Computação, Engenharia"
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                          />
                        </FormGroup>
                      </FormRow>

                      <FormRow>
                        <FormGroup>
                          <Label>Data de Início</Label>
                          <Input
                            type="text"
                            placeholder="MM/AAAA"
                            value={edu.startDate || ''}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            maxLength={7}
                          />
                          <HelpText>Formato: MM/AAAA (ex: 01/2016)</HelpText>
                        </FormGroup>

                        <FormGroup>
                          <Label>Data de Conclusão</Label>
                          <Input
                            type="text"
                            placeholder="MM/AAAA"
                            value={edu.endDate || ''}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            maxLength={7}
                          />
                          <HelpText>Formato: MM/AAAA (ex: 12/2020)</HelpText>
                        </FormGroup>
                      </FormRow>
                    </RepeatableItem>
                  ))
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <SectionSubtitle>
                    <FiGlobe /> Idiomas (Opcional)
                  </SectionSubtitle>
                  {isEditing && (
                    <AddButton type="button" onClick={addLanguage}>
                      <FiPlus /> Adicionar Idioma
                    </AddButton>
                  )}
                </SectionHeader>

                {languages.length === 0 ? (
                  <EmptyState>
                    Nenhum idioma adicionado. Clique em "Adicionar Idioma" para começar.
                  </EmptyState>
                ) : (
                  languages.map((lang, index) => (
                    <RepeatableItem key={lang.id}>
                      <RepeatableItemHeader>
                        <RepeatableItemTitle>Idioma #{index + 1}</RepeatableItemTitle>
                        {isEditing && (
                          <RemoveItemButton type="button" onClick={() => removeLanguage(lang.id)}>
                            <FiX /> Remover
                          </RemoveItemButton>
                        )}
                      </RepeatableItemHeader>

                      <FormRow>
                        <FormGroup>
                          <Label>
                            Idioma
                          </Label>
                          <Input
                            type="text"
                            placeholder="Ex: Inglês, Português, Espanhol"
                            value={lang.language}
                            onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Nível de Proficiência</Label>
                          <Select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                          >
                            <option value="basic">Básico</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="professional">Profissional</option>
                            <option value="native">Nativo</option>
                          </Select>
                        </FormGroup>
                      </FormRow>
                    </RepeatableItem>
                  ))
                )}
              </Section>
              </fieldset>

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
                    <Button type="submit" variant="primary" disabled={saving || uploadingFile}>
                      {uploadingFile ? 'Enviando arquivo...' : saving ? 'Salvando...' : isFirstAccess ? 'Concluir Cadastro' : 'Salvar Perfil'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="primary" 
                      onClick={handleEdit}
                    >
                      <FiEdit /> Editar Perfil
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleDownloadResume}
                    >
                      <FiDownload /> Baixar Currículo
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
