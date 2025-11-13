# Guia de Desenvolvimento

## Estrutura do Projeto

### Camadas da Aplicação

O projeto segue **Clean Architecture** com as seguintes camadas:

#### 1. Infrastructure Layer (`src/infrastructure/`)
- Responsável por integrações externas
- Contém o cliente do Supabase
- Isola dependências de terceiros

#### 2. Presentation Layer (`src/presentation/`)
- Contém toda a UI da aplicação
- Dividida em:
  - **Components**: Componentes reutilizáveis
  - **Pages**: Páginas da aplicação

#### 3. Styles (`src/styles/`)
- Sistema de design tokens
- Estilos globais
- Tema da aplicação

## Componentes

### Estrutura de Componentes

Cada componente segue o padrão:

```
ComponentName/
├── ComponentName.tsx       # Lógica do componente
├── ComponentName.styles.ts # Estilos styled-components
└── index.ts               # Exports públicos
```

### Boas Práticas

#### Nomenclatura
- **PascalCase** para componentes e tipos
- **camelCase** para funções e variáveis
- **UPPER_SNAKE_CASE** para constantes

#### Componentes
```typescript
// ✅ BOM: Componente funcional tipado
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

// ❌ RUIM: Componente sem tipos
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};
```

#### Styled Components
```typescript
// ✅ BOM: Props prefixadas com $
export const StyledButton = styled.button<{ $variant: string }>`
  color: ${({ $variant }) => $variant === 'primary' ? 'blue' : 'gray'};
`;

// ❌ RUIM: Props sem prefixo (podem vazar para o DOM)
export const StyledButton = styled.button<{ variant: string }>`
  color: ${({ variant }) => variant === 'primary' ? 'blue' : 'gray'};
`;
```

#### Hooks
```typescript
// ✅ BOM: Custom hook com nome adequado
const useFormValidation = (initialValues) => {
  // lógica do hook
};

// ❌ RUIM: Função comum disfarçada de hook
const validateForm = (values) => {
  // lógica da função
};
```

## Sistema de Temas

### Acessando o Tema

```typescript
import styled from 'styled-components';

const StyledComponent = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;
```

### Tokens Disponíveis

#### Cores
- `theme.colors.primary.*` - Cores primárias
- `theme.colors.secondary.*` - Cores secundárias
- `theme.colors.success.*` - Cores de sucesso
- `theme.colors.warning.*` - Cores de aviso
- `theme.colors.error.*` - Cores de erro
- `theme.colors.neutral.*` - Escala de cinza
- `theme.colors.text.*` - Cores de texto
- `theme.colors.background.*` - Cores de fundo

#### Espaçamento
- `theme.spacing.xs` até `theme.spacing.4xl`

#### Tipografia
- `theme.typography.fontSize.*`
- `theme.typography.fontWeight.*`
- `theme.typography.lineHeight.*`

#### Outros
- `theme.shadows.*` - Sombras
- `theme.borderRadius.*` - Raios de borda
- `theme.breakpoints.*` - Media queries
- `theme.transitions.*` - Transições

## Guia de Estilo

### Imports

Sempre use imports absolutos com `@`:

```typescript
// ✅ BOM
import { Button } from '@/presentation/components/Button';
import { supabase } from '@/infrastructure/supabase/client';

// ❌ RUIM
import { Button } from '../../../components/Button';
import { supabase } from '../../infrastructure/supabase/client';
```

### Organização de Imports

```typescript
// 1. Imports de React e bibliotecas
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports de componentes
import { Button } from '@/presentation/components/Button';
import { Card } from '@/presentation/components/Card';

// 3. Imports de utils e hooks
import { supabase } from '@/infrastructure/supabase/client';

// 4. Imports de estilos
import * as S from './Component.styles';
```

### Responsividade

Use mobile-first approach:

```typescript
const StyledComponent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  
  /* Tablet */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
  
  /* Desktop */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;
```

## Performance

### Otimizações Implementadas

1. **React Query** para cache de requisições
2. **Lazy Loading** de rotas (quando necessário)
3. **Code Splitting** automático pelo Vite
4. **Tree Shaking** para remover código não utilizado

### Dicas

- Use `React.memo()` para componentes que renderizam frequentemente
- Use `useMemo()` e `useCallback()` com moderação
- Evite criar funções dentro de JSX

```typescript
// ✅ BOM
const handleClick = useCallback(() => {
  // lógica
}, [dependencies]);

return <Button onClick={handleClick}>Click</Button>;

// ❌ RUIM
return <Button onClick={() => handleSomething()}>Click</Button>;
```

## Testes

### Estrutura de Testes (futuro)

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── ComponentName.test.tsx
└── index.ts
```

## Git Workflow

### Commits

Use Conventional Commits:

```bash
feat: adiciona novo componente de modal
fix: corrige bug no upload de arquivo
docs: atualiza README com instruções
style: formata código com prettier
refactor: reorganiza estrutura de pastas
test: adiciona testes para Button
chore: atualiza dependências
```

### Branches

- `main` - Branch principal (protegida)
- `develop` - Branch de desenvolvimento
- `feature/nome-da-feature` - Novas funcionalidades
- `fix/nome-do-bug` - Correções
- `refactor/nome` - Refatorações

## Troubleshooting

### Erro: "Cannot find module '@/...'"

Verifique se o `tsconfig.json` está configurado corretamente:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erro: Styled Components não funciona

1. Verifique se o `ThemeProvider` está no topo da aplicação
2. Verifique se o tema está sendo importado corretamente
3. Limpe o cache: `rm -rf node_modules dist && npm install`

### Build falha

1. Execute `npm run lint` para verificar erros
2. Verifique se todas as dependências estão instaladas
3. Verifique se não há referências circulares

## Recursos Úteis

- [Styled Components Docs](https://styled-components.com/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## Contato e Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

