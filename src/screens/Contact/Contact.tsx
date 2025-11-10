import { useState } from "react";
import { Header } from "../../components/Header/Header";
import { contactLinks, faqData } from "./data";
import {
  AnswerWrapper,
  ArrowIcon,
  Column,
  ContactForm,
  ContactInfoItem,
  ContactInfoList,
  ContactSection,
  Container,
  ContentGrid,
  FaqItem,
  FaqTitle,
  FaqWrapper,
  Input,
  Label,
  QuestionButton,
  SectionTitle,
  Subheading,
  SubmitButton,
  Textarea
} from "./styles";

export const ContactScreen: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <>
      <Header />

      <ContactSection>
        <Container>
          <SectionTitle>Entre em Contato</SectionTitle>
          <ContentGrid>
            <Column>
              <Subheading>Tire Suas Dúvidas</Subheading>
              <ContactForm>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input type="text" id="name" />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input type="email" id="email" />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" />
                </div>
                <SubmitButton type="submit">Enviar Mensagem</SubmitButton>
              </ContactForm>
            </Column>

            <Column>
              <Subheading>Dados de Contato</Subheading>
              <ContactInfoList>
                {contactLinks.map((link, index) => (
                  <ContactInfoItem key={index}>
                    {link.icon}
                    <span>{link.text || "Texto não disponível"}</span>
                  </ContactInfoItem>
                ))}
              </ContactInfoList>
            </Column>
          </ContentGrid>
          
          <FaqTitle>Perguntas Frequentes</FaqTitle>
          <FaqWrapper>
          {faqData.map((item, index) => (
            <FaqItem key={index}>
                <QuestionButton onClick={() => handleToggle(index)}>
                  <span>{item.question}</span>
                  <ArrowIcon isOpen={openIndex === index}>▼</ArrowIcon>
                </QuestionButton>
                <AnswerWrapper isOpen={openIndex === index}>
                  {item.answer}
                </AnswerWrapper>
            </FaqItem>
          ))}
        </FaqWrapper>
        </Container>
      </ContactSection>
    </>
  );
};
