# 🚀 Quick Start - Início Rápido

## ⚡ Iniciando o Projeto em 3 Passos

### 1. Instalar Dependências (se ainda não fez)
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_do_supabase
```

**⚠️ IMPORTANTE:** O projeto funciona SEM as variáveis de ambiente! Você pode testar a interface normalmente. As funcionalidades de análise de currículo só funcionarão quando você configurar o Supabase.

### 3. Iniciar o Servidor
```bash
npm run dev
```

Acesse: **http://localhost:8080**

---

## 🔧 Troubleshooting - Resolvendo Problemas

### Problema: Tela Branca / Nada Aparece

#### Solução 1: Limpar Cache e Reinstalar
```bash
rm -rf node_modules dist
npm install
npm run dev
```

#### Solução 2: Verificar Console do Navegador
1. Abra o navegador (Chrome/Firefox)
2. Pressione `F12` para abrir DevTools
3. Vá na aba **Console**
4. Procure por erros em vermelho
5. Recarregue a página com `Ctrl+Shift+R` (ou `Cmd+Shift+R` no Mac)

#### Solução 3: Verificar se o Servidor Está Rodando
```bash
# Deve mostrar algo como: "Local: http://localhost:8080"
npm run dev
```

#### Solução 4: Testar Outra Porta
Se a porta 8080 estiver ocupada:
```bash
# Edite vite.config.ts e mude a porta
server: {
  port: 3000  // ou outra porta disponível
}
```

### Problema: Erro de Supabase

**Isso é normal!** O aviso aparecerá no console se você não tiver as credenciais configuradas:
```
⚠️ Supabase credentials not configured...
```

A aplicação funcionará normalmente para visualização. Configure o Supabase apenas quando quiser usar a funcionalidade de análise.

### Problema: Erros de TypeScript

```bash
# Recompilar
npm run build
```

### Problema: Erros de ESLint

```bash
# Verificar erros
npm run lint
```

---

## 📦 Build para Produção

```bash
# Build otimizado
npm run build

# Preview da build
npm run preview
```

---

## 🎯 Próximos Passos

### Para Desenvolvimento
1. ✅ Projeto está rodando
2. 📖 Leia `DEVELOPMENT.md` para boas práticas
3. 🎨 Explore os componentes em `src/presentation/components/`
4. 📄 Crie novas páginas em `src/presentation/pages/`

### Para Configurar Supabase (Funcionalidade Completa)
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings → API
4. Copie:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`
5. Cole no arquivo `.env`
6. Reinicie o servidor (`npm run dev`)

---

## ✅ Checklist de Verificação

- [ ] Node.js 18+ instalado (`node -v`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em `http://localhost:8080`
- [ ] Console do navegador sem erros críticos
- [ ] Página carregando (mesmo sem Supabase)

---

## 🆘 Ainda com Problemas?

### 1. Verificar Versões
```bash
node -v   # Deve ser 18 ou superior
npm -v    # Deve ser 9 ou superior
```

### 2. Porta Ocupada
```bash
# Descobrir o que está usando a porta 8080
lsof -i :8080

# Matar o processo
kill -9 [PID]
```

### 3. Permissões
```bash
# Se houver erros de permissão
sudo npm install
```

### 4. Cache do Navegador
- Chrome: `Ctrl+Shift+Delete` → Limpar cache
- Firefox: `Ctrl+Shift+Delete` → Limpar cache
- Safari: `Cmd+Option+E` → Limpar cache

### 5. Modo Incógnito
Teste no modo anônimo/incógnito do navegador para descartar problemas de cache/extensões.

---

## 📞 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Preview da build |
| `npm run lint` | Verifica erros de código |
| `npm install` | Instala dependências |

---

## 🎉 Pronto!

Se seguiu todos os passos e ainda tem problemas, verifique:
1. Console do navegador (F12)
2. Terminal onde rodou `npm run dev`
3. Arquivo `.env` (se criou)

O projeto deve funcionar **mesmo sem Supabase configurado**! 🚀

