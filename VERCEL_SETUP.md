# Configuração do Vercel

## Problema Resolvido
O projeto está dentro da pasta `front/`, mas o Vercel estava tentando fazer o build na raiz do repositório.

## O que foi ajustado
- ✅ Adicionado `"rootDirectory": "front"` no `vercel.json`
- Agora o Vercel executará os comandos dentro do diretório correto

## Passos para Deploy

### 1. Configure as Variáveis de Ambiente no Vercel

Acesse: https://vercel.com/dashboard → Seu Projeto → **Settings** → **Environment Variables**

Adicione as seguintes variáveis:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_key_aqui
```

**Importante:** Marque todos os ambientes (Production, Preview, Development)

### 2. Como obter as credenciais do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Faça o Commit e Push

```bash
git add vercel.json VERCEL_SETUP.md
git commit -m "fix: configurar rootDirectory no vercel.json"
git push
```

### 4. Redeploy no Vercel

Após o push, o Vercel fará o deploy automaticamente com as configurações corretas.

Se preferir forçar um redeploy:
- Vá em **Deployments** → último deploy → **Redeploy**

## Verificação

Após o deploy, verifique:
- ✅ Build completado com sucesso
- ✅ Sem warnings sobre Supabase no console
- ✅ HomeScreen carregando corretamente

## Para Desenvolvimento Local

Crie um arquivo `.env` em `/front/.env`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_key_aqui
```

**Nota:** Nunca commite o arquivo `.env` (ele já está no .gitignore)

