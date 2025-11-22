import { useState, type FC, type FormEvent, useEffect } from "react";
import {
  ActionButton,
  CheckboxWrapper,
  Column,
  ContentGrid,
  DescriptionText,
  ForgotPasswordLink,
  Input,
  InputGroup,
  Label,
  LoginForm,
  MainTitle,
  OptionsRow,
  PageWrapper,
  Subheading,
  LoadingContainer,
  WarningBox,
  ErrorMessage,
  FieldErrorMessage,
  Divider,
  DividerText,
  GoogleButton,
  PasswordInputWrapper,
  TogglePasswordButton
} from "./styles";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, handleGoogleLogin } = useAuthForm();
  const { firebaseConfigured, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [
    signInWithEmailAndPassword,
    ,
    signInLoading,
    signInError,
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (signInError) {
      setEmailError('');
      setPasswordError('');
      setGeneralError('');

      const errorCode = signInError.code;
      
      switch (errorCode) {
        case 'auth/invalid-email':
          setEmailError('E-mail inválido');
          break;
        case 'auth/user-disabled':
          setGeneralError('Esta conta foi desabilitada. Entre em contato com o suporte.');
          break;
        case 'auth/user-not-found':
          setEmailError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setPasswordError('Senha incorreta');
          break;
        case 'auth/invalid-credential':
          setGeneralError('E-mail ou senha incorretos');
          setEmailError('Verifique seu e-mail');
          setPasswordError('Verifique sua senha');
          break;
        case 'auth/too-many-requests':
          setGeneralError('Muitas tentativas de login. Tente novamente mais tarde.');
          break;
        case 'auth/network-request-failed':
          setGeneralError('Erro de conexão. Verifique sua internet.');
          break;
        default:
          setGeneralError('Erro ao fazer login. Tente novamente.');
          break;
      }
    }
  }, [signInError]);

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('E-mail é obrigatório');
      return;
    }

    if (!password) {
      setPasswordError('Senha é obrigatória');
      return;
    }

    await signInWithEmailAndPassword(email, password);
  };

  if (authLoading) {
    return (
      <>
        <PageWrapper>
          <LoadingContainer>
            Verificando autenticação...
          </LoadingContainer>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <PageWrapper>
        <MainTitle>Login / Registro</MainTitle>

        <ContentGrid>
          <Column>
            <Subheading>Entrar</Subheading>
            {!firebaseConfigured && (
              <WarningBox>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                  <div>
                    <strong>Firebase não configurado:</strong> Para usar o login, configure as variáveis de ambiente do Firebase.
                    Consulte o arquivo <code>FIREBASE_AUTH_SETUP.md</code> para instruções.
                  </div>
                </div>
              </WarningBox>
            )}
            <LoginForm onSubmit={handleLoginSubmit}>
              <InputGroup>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="maria-antonia@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setGeneralError('');
                  }}
                  hasError={!!emailError}
                  required
                />
                {emailError && <FieldErrorMessage>{emailError}</FieldErrorMessage>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">Senha</Label>
                <PasswordInputWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                      setGeneralError('');
                    }}
                    hasError={!!passwordError}
                    required
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </TogglePasswordButton>
                </PasswordInputWrapper>
                {passwordError && <FieldErrorMessage>{passwordError}</FieldErrorMessage>}
              </InputGroup>

              <OptionsRow>
                <CheckboxWrapper onClick={() => setRememberMe(!rememberMe)}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    readOnly
                  />
                  <label htmlFor="remember-me">Lembre-me</label>
                </CheckboxWrapper>
                <ForgotPasswordLink href="#">Perdeu sua senha?</ForgotPasswordLink>
              </OptionsRow>

              {generalError && (
                <ErrorMessage>
                  {generalError}
                </ErrorMessage>
              )}

              {error && (
                <ErrorMessage>
                  {error}
                </ErrorMessage>
              )}

              <ActionButton type="submit" disabled={loading || signInLoading}>
                {(loading || signInLoading) ? 'Entrando...' : 'Acessar Conta'}
              </ActionButton>
            </LoginForm>

            <Divider>
              <DividerText>ou</DividerText>
            </Divider>

            <GoogleButton
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || signInLoading || !firebaseConfigured}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {(loading || signInLoading) ? 'Conectando...' : 'Continuar com Google'}
            </GoogleButton>
          </Column>

          <Column>
            <Subheading>Registre-se</Subheading>
            <DescriptionText>
              Se você ainda não possui uma conta, escolha um plano e preencha o cadastro para ter acesso a todas as funcionalidades.
            </DescriptionText>
            <ActionButton as={Link} to="/planos">
              Criar a sua conta
            </ActionButton>
          </Column>
        </ContentGrid>
      </PageWrapper>
    </>
  );
};