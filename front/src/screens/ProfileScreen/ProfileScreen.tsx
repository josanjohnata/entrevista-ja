import React, { useRef, useState } from 'react';
import { FiUser, FiGithub, FiLinkedin, FiFileText, FiUpload, FiX, FiMail, FiCheckCircle, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
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
  FileUploadArea,
  FileInput,
  FileUploadIcon,
  FileUploadText,
  CurrentFile,
  FileName,
  RemoveButton,
  ButtonGroup,
  Button,
  Alert,
  SocialLinks,
  SocialLink,
  HelpText,
  CenteredMessage,
  CloseButton,
  SmallFileText,
  NewBadge,
  ResumeActions,
  ResumeLink
} from './styles';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    profile,
    loading,
    saving,
    uploadingFile,
    message,
    displayName,
    setDisplayName,
    about,
    setAbout,
    github,
    setGithub,
    linkedin,
    setLinkedin,
    resumeFile,
    handleFileChange,
    handleSubmit,
    handleRemoveResume,
    dismissMessage,
  } = useProfileScreen();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

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
            <SectionTitle>
              <FiUser /> Informações do Perfil
            </SectionTitle>

            {message && (
              <Alert type={message.type}>
                {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                {message.text}
                <CloseButton onClick={dismissMessage}>
                  <FiX />
                </CloseButton>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="displayName">
                  <FiUser /> Nome
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </FormGroup>

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

              <FormGroup>
                <Label htmlFor="about">
                  Sobre você
                </Label>
                <TextArea
                  id="about"
                  placeholder="Conte um pouco sobre você, suas experiências e objetivos profissionais..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="github">
                  <FiGithub /> GitHub
                </Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/seu-usuario"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </FormGroup>

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
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="resume">
                  <FiFileText /> Currículo
                </Label>
                
                {!profile?.resumeURL && !resumeFile ? (
                  <FileUploadArea
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={isDragging ? 'dragging' : ''}
                  >
                    <FileUploadIcon>
                      <FiUpload />
                    </FileUploadIcon>
                    <FileUploadText>
                      <strong>Clique para fazer upload</strong> ou arraste seu currículo aqui
                    </FileUploadText>
                    <SmallFileText>
                      PDF, DOC ou DOCX (máx. 5MB)
                    </SmallFileText>
                  </FileUploadArea>
                ) : (
                  <CurrentFile>
                    <FileName>
                      <FiFileText />
                      {resumeFile ? resumeFile.name : profile?.resumeName}
                      {resumeFile && <NewBadge>• Novo</NewBadge>}
                    </FileName>
                    <ResumeActions>
                      {profile?.resumeURL && !resumeFile && (
                        <ResumeLink
                          href={profile.resumeURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FiExternalLink />
                        </ResumeLink>
                      )}
                      <RemoveButton
                        type="button"
                        onClick={() => {
                          if (resumeFile) {
                            handleFileChange(null);
                          } else {
                            handleRemoveResume();
                          }
                        }}
                      >
                        <FiX />
                      </RemoveButton>
                    </ResumeActions>
                  </CurrentFile>
                )}
                
                <FileInput
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInputChange}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={saving || uploadingFile}>
                  {uploadingFile ? 'Enviando arquivo...' : saving ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </ButtonGroup>
            </Form>
          </MainContent>
        </Container>
      </PageWrapper>
    </>
  );
};
