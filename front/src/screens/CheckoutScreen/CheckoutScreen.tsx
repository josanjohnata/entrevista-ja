import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {
  CheckoutGrid,
  FormColumn,
  FormSection,
  Input,
  InputGroup,
  MainContainer,
  MainTitle,
  PageWrapper,
  PaymentOptions,
  PlanTitle,
  PriceBox,
  RadioWrapper,
  SectionHeader,
  SubmitButton,
  SummaryCard,
  SummaryColumn,
  TermsLink,
  TermsLabel
} from "./styles";
import { FiBarChart, FiCheck, FiCreditCard, FiUser } from "react-icons/fi";
import { FaPix, FaStripe } from "react-icons/fa6";
import { auth } from "../../lib/firebase";
import { FeaturesList, FeatureItem } from "../../components/sections/Features/styles";

export const CheckoutScreen: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [
    createUserWithEmailAndPassword,
    loading,
  ] = useCreateUserWithEmailAndPassword(auth);
  
  const planFeatures = [
    'Acesso a templates de currículo',
    'Filtro Inteligente com o LinkedIn',
    'Análise Instantânea de Currículo',
    'Veja sua compatibilidade com a vaga',
    'Identifique termos essenciais que faltam',
    'Ajustes Precisos para a Entrevista',
    'Acesso a Consultoria de Carreira',
    'Cancele quando quiser',
  ];

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(email, password);
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <PageWrapper>
        <MainContainer>
          <MainTitle>Assine o Plano</MainTitle>
          <CheckoutGrid>
            <FormColumn>
              <form onSubmit={handleSignIn}>
                <FormSection>
                  <SectionHeader><FiUser /> Dados</SectionHeader>
                  <InputGroup>
                    <label htmlFor="name">Nome Completo</label>
                    <Input id="name" type="text" placeholder="João da Silva" required />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="email">Email</label>
                    <Input id="email" type="email" placeholder="joao@email.com" onChange={(e) => setEmail(e.target.value)} required />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="password">Senha</label>
                    <Input id="password" type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} required />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="document">CPF (Opcional)</label>
                    <Input id="document" type="text" placeholder="123.456.789-00" />
                  </InputGroup>
                </FormSection>

                <FormSection>
                  <SectionHeader><FiCreditCard /> Pagamento</SectionHeader>
                  <PaymentOptions>
                    <RadioWrapper 
                      className={`${paymentMethod === 'pix' ? 'selected' : ''}`} 
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="pix" 
                        checked={paymentMethod === 'pix'} 
                        readOnly
                      />
                      <span>Pix</span>
                      <span className="icon"><FaPix /></span>
                    </RadioWrapper>
                    <RadioWrapper 
                      className={`${paymentMethod === 'credit_card' ? 'selected' : ''}`} 
                      onClick={() => setPaymentMethod('credit_card')}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="credit_card" 
                        checked={paymentMethod === 'credit_card'} 
                        readOnly
                      />
                      <span>Cartão de Crédito</span>
                      <span className="icon"><FiCreditCard /></span>
                    </RadioWrapper>
                    <RadioWrapper 
                      className={`${paymentMethod === 'boleto' ? 'selected' : ''}`} 
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="boleto" 
                        checked={paymentMethod === 'boleto'} 
                        readOnly
                      />
                      <span>Boleto Bancário</span>
                      <span className="icon"><FiBarChart /></span>
                    </RadioWrapper>
                    <RadioWrapper 
                      className={`${paymentMethod === 'stripe' ? 'selected' : ''}`} 
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="stripe" 
                        checked={paymentMethod === 'stripe'} 
                        readOnly
                      />
                      <span>Stripe</span>
                      <span className="icon"><FaStripe /></span>
                    </RadioWrapper>
                  </PaymentOptions>
                </FormSection>
                
                <FormSection>
                  <InputGroup>
                    <TermsLabel>
                      <input type="checkbox" required />
                      Li e concordo com os <TermsLink>termos e política</TermsLink> de privacidade.
                    </TermsLabel>
                  </InputGroup>
                </FormSection>
                
                <SubmitButton type="submit">Criar conta</SubmitButton>
              </form>
            </FormColumn>

            <SummaryColumn>
              <SummaryCard>
                <SectionHeader>Plano Escolhido</SectionHeader>
                <PlanTitle>Plano Pro Entrevista</PlanTitle>
                <FeaturesList>
                {planFeatures.map((feature) => (
                  <FeatureItem key={feature} style={{ fontSize: '1rem' }}>
                    <FiCheck size={20} />
                    <span> {feature}</span>
                  </FeatureItem>
                ))}
                </FeaturesList>
              </SummaryCard>
              <PriceBox>
                <div className="installments">
                  <span>R$ 49,00</span>
                </div>
                <div className="full-price">à vista R$ 49,00</div>
              </PriceBox>
            </SummaryColumn>
          </CheckoutGrid>
        </MainContainer>
      </PageWrapper>
    </>
  );
};
