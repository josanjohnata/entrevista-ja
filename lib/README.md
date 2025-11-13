# Currículo Turbo Bot 🚀

Aplicação web inteligente que utiliza IA para otimizar currículos e aumentar as chances de aprovação em processos seletivos.

## 🎯 Funcionalidades

- **Score de Match**: Análise percentual de compatibilidade entre currículo e vaga
- **Identificação de Palavras-Chave**: Detecta termos importantes que faltam no currículo
- **Resumo Profissional Otimizado**: Gera um resumo personalizado para o topo do currículo
- **Sugestões Inteligentes**: Recomendações de melhoria baseadas em IA
- **Upload de Arquivos**: Suporte para PDF, DOCX e TXT

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Clean Code**:

```
src/
├── infrastructure/        # Integrações externas (Supabase, APIs)
├── presentation/         # Camada de apresentação
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── Label/
│   │   ├── Badge/
│   │   └── Layout/
│   └── pages/          # Páginas da aplicação
│       ├── Index/
│       ├── Resultados/
│       └── NotFound/
├── styles/             # Temas e estilos globais
│   ├── theme.ts
│   └── GlobalStyles.ts
├── App.tsx
└── main.tsx
```

## 🛠️ Tecnologias

### Core
- **React 18**: Biblioteca para interfaces de usuário
- **TypeScript**: Tipagem estática para JavaScript
- **Vite**: Build tool e dev server ultrarrápido

### Estilização
- **Styled Components**: CSS-in-JS com suporte a temas
- **Design System**: Sistema de design tokens personalizado

### Gerenciamento de Estado
- **React Query (TanStack Query)**: Cache e gerenciamento de estado assíncrono
- **React Router**: Roteamento declarativo

### Backend & Integração
- **Supabase**: Backend as a Service (BaaS)
  - Edge Functions para processamento
  - Armazenamento de dados

### Notificações
- **React Toastify**: Notificações e alertas elegantes

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd vaga-turbo-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:8080`

## 🎨 Sistema de Design

### Theme
O sistema de temas é centralizado e totalmente tipado:

- **Cores**: Palette completa com variantes
- **Tipografia**: Escalas de tamanhos e pesos
- **Espaçamentos**: Sistema de spacing consistente
- **Breakpoints**: Responsividade mobile-first
- **Shadows**: Elevações padronizadas
- **Bordas**: Raios de borda consistentes

### Componentes

Todos os componentes seguem as boas práticas:
- **Separação de responsabilidades**: Lógica separada de estilos
- **Composição**: Componentes pequenos e reutilizáveis
- **Tipagem forte**: Props totalmente tipadas
- **Acessibilidade**: Suporte a ARIA labels e navegação por teclado

## 🚀 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev

# Preview da build
npm run preview

# Lint
npm run lint
```

## 📝 Boas Práticas Implementadas

### Clean Code
- ✅ Nomes descritivos e significativos
- ✅ Funções pequenas e com responsabilidade única
- ✅ Comentários apenas quando necessário
- ✅ Formatação consistente
- ✅ Tratamento adequado de erros

### Clean Architecture
- ✅ Separação de camadas (Presentation, Infrastructure)
- ✅ Dependências apontando para dentro
- ✅ Componentes independentes e testáveis
- ✅ Baixo acoplamento, alta coesão

### React Best Practices
- ✅ Componentes funcionais com hooks
- ✅ Custom hooks para lógica reutilizável
- ✅ Memoização quando apropriado
- ✅ Lazy loading de componentes
- ✅ Error boundaries

### TypeScript
- ✅ Tipagem estrita habilitada
- ✅ Interfaces e tipos bem definidos
- ✅ Evita uso de `any`
- ✅ Generics quando apropriado

## 🔒 Segurança

- Variáveis de ambiente para dados sensíveis
- Validação de inputs no client-side
- Rate limiting via Supabase
- Sanitização de dados

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ seguindo as melhores práticas de desenvolvimento

---

**Nota**: Este projeto foi desenvolvido com foco em qualidade de código, arquitetura limpa e experiência do usuário.
