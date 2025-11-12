import type { ReactNode } from 'react';
import { FiMail, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';

export const contactLinks = [
  { icon: <FiMail />, text: 'contato@entrevistaja.com.br' },
  { icon: <FiInstagram />, text: 'instagram.com/entrevistaja' },
  { icon: <FiYoutube />, text: 'youtube.com/entrevistaja' },
  { icon: <FiLinkedin />, text: 'linkedin.com/company/entrevistaja' },
];

export const faqData: { question: string; answer: ReactNode }[] = [
  {
      question: '1. Para quem é o Entrevista Já?',
      answer: <p>O Entrevista Já foi desenhado exclusivamente para talentos em início de carreira na área de tecnologia. Nosso foco são <strong>estudantes, recém-formados, profissionais em transição de carreira</strong> e qualquer pessoa que se identifique como júnior.</p>,
  },
  {
      question: '2. Qual o diferencial do Entrevista Já em relação a outras plataformas?',
      answer: <p>Nosso principal diferencial é o <strong>foco exclusivo em iniciantes</strong>. Diferente de plataformas genéricas, nós eliminamos o ruído de vagas que exigem anos de experiência. Nossos diferenciais incluem curadoria humana, vagas exclusivas e desenvolvimento de perfil.</p>,
  },
  {
      question: '3. Existe um plano gratuito? O que ele inclui?',
      answer: <p>Sim! O plano <strong>Básico (gratuito)</strong> permite que você busque e se candidate a centenas de vagas curadas, crie seu perfil na plataforma e receba alertas de vagas que combinam com seu perfil.</p>,
  },
  {
      question: '4. Por que eu deveria assinar um plano pago?',
      answer: <p>Os planos pagos são para quem deseja uma <strong>vantagem competitiva</strong>. Com eles, você tem acesso a recursos premium como vagas exclusivas, análise de perfil por especialistas e suporte prioritário para acelerar sua busca pelo emprego.</p>,
  },
  {
      question: '5. As vagas são realmente para juniores, sem "pegadinhas"?',
      answer: <p>Sim. Esse é o nosso principal compromisso. Nossa equipe faz uma triagem rigorosa para garantir que os requisitos das vagas sejam realistas para quem está começando. Se uma vaga pede 5 anos de experiência para uma posição júnior, ela simplesmente não entra na nossa plataforma.</p>,
  },
  {
      question: '6. O Entrevista Já garante que eu vou conseguir um emprego?',
      answer: <p>Não podemos garantir a contratação, pois ela depende de muitos fatores. O que <strong>nós garantimos</strong> é que você terá acesso às melhores ferramentas, às vagas mais relevantes e ao suporte necessário para aumentar exponencialmente suas chances de sucesso.</p>,
  },
];
