"use client"
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
import { auth, /*db*/ } from "../../lib/firebase";
import { FeaturesList, FeatureItem } from "../../components/sections/Features/styles";
import { useSearchParams } from "react-router-dom";
import Checkout from "./Checkout";
// import { doc, setDoc } from "firebase/firestore";
import type { FormEvent } from 'react';


export const CheckoutScreen: React.FC = () => {
  const [createUserWithEmailAndPassword, loading] = useCreateUserWithEmailAndPassword(auth);
  const [params, setParams] = useSearchParams();
  const isRegisterPlan = params.get("email");

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
    event.preventDefault(); // Sempre primeiro para evitar o recarregamento da página

    const form = new FormData(event.currentTarget);
    const formData = Object.fromEntries(form.entries()) as Record<string, string>;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );

      // O código aqui só será executado se o createUserWithEmailAndPassword for bem-sucedido.
      // Não precisa de setTimeout!
      if (userCredential && userCredential.user) { // userCredential.user será sempre definido aqui
        // await setDoc(doc(db, "infosUsers", userCredential.user.uid), {
        //   cpf: formData.doc || "", // 'doc' pode ser uma referência a um documento de identificação, certo?
        //   nome: formData.name,
        //   planId: "", // Informação inicial do plano
        // });

        // Finalmente, atualize os parâmetros ou o estado da UI.
        setParams(`?email=${formData.email}`);
        // console.log("Usuário criado e informações salvas no Firestore!", userCredential.user.uid);
      }
    } catch (e) { // Capture o erro como 'any' para acessar propriedades como 'code' e 'message'
      console.log("Erro ao criar usuário ou salvar dados:", e);
      // Aqui você pode adicionar lógica para mostrar mensagens de erro ao usuário:
      // if (e.code === 'auth/email-already-in-use') {
      //   alert('Este email já está em uso.');
      // } else if (e.code === 'auth/weak-password') {
      //   alert('A senha é muito fraca.');
      // } else {
      //   alert('Ocorreu um erro ao criar a conta: ' + e.message);
      // }
    }
  };

  return (
    <>
      <PageWrapper>
        <MainContainer>
          <MainTitle>Assine o Plano</MainTitle>
          <CheckoutGrid>
            <FormColumn>
              {isRegisterPlan ? <Checkout email={isRegisterPlan} /> :
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
