"use client"
import { FormEvent } from "react";
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
  PlanTitle,
  PriceBox,
  SectionHeader,
  SubmitButton,
  SummaryCard,
  SummaryColumn,
  TermsLink,
  TermsLabel
} from "./styles";
import { FiCheck, FiUser } from "react-icons/fi";
import { auth, db } from "../../lib/firebase";
import { FeaturesList, FeatureItem } from "../../components/sections/Features/styles";
import { useSearchParams } from "react-router-dom";
import Checkout from "./Checkout";
import { addDoc, collection } from "firebase/firestore";


export const CheckoutScreen: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const isRegisterPlan = params.get("email");
  const userId = params.get("userid");

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

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const formData = Object.fromEntries(form.entries()) as Record<string, string>;

    const userCredential = await createUserWithEmailAndPassword(
      formData.email,
      formData.password
    );

    if (userCredential) {
      await addDoc(collection(db, "users"), {
        nome: formData.name,
        cpf: formData.doc || null,
        email: formData.email,
        criadoEm: new Date(),
        planId: null,
        userId: userCredential.user.uid,
      });

      setParams(`?email=${formData.email}&userid=${userCredential.user.uid}`);
    }
  }

  return (
    <>
      <PageWrapper>
        <MainContainer>
          <MainTitle>Assine o Plano</MainTitle>
          <CheckoutGrid>
            <FormColumn>
              {isRegisterPlan && userId ? <Checkout email={isRegisterPlan} userId={userId} /> :
                <form onSubmit={handleSignIn}>
                  <FormSection>
                    <SectionHeader><FiUser /> Dados</SectionHeader>
                    <InputGroup>
                      <label htmlFor="name">Nome Completo</label>
                      <Input id="name" type="text" placeholder="João da Silva" name="name" required />
                    </InputGroup>
                    <InputGroup>
                      <label htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="joao@email.com" name="email" required />
                    </InputGroup>
                    <InputGroup>
                      <label htmlFor="password">Senha</label>
                      <Input id="password" type="password" placeholder="********" name="password" required />
                    </InputGroup>
                    <InputGroup>
                      <label htmlFor="document">CPF (Opcional)</label>
                      <Input id="document" type="text" placeholder="123.456.789-00" name="doc" />
                    </InputGroup>
                  </FormSection>
                  <FormSection>
                    <InputGroup>
                      <TermsLabel>
                        <input type="checkbox" required />
                        Li e concordo com os <TermsLink>termos e política</TermsLink> de privacidade.
                      </TermsLabel>
                    </InputGroup>
                  </FormSection>
                  <SubmitButton type="submit" disabled={!!loading}>
                    {loading ? "..." : "Criar conta"}
                  </SubmitButton>
                </form>
              }
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
