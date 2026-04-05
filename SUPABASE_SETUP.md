# 🗄️ Configuração do Banco de Dados Supabase

## 📋 Guia Completo - Executar Scripts SQL

### ✅ Passo 1: Acessar o SQL Editor

1. Abra o dashboard do Supabase: https://app.supabase.com/
2. Selecione seu projeto **"catalogo-filmes"**
3. No menu lateral esquerdo, clique em **"SQL Editor"**
4. Clique no botão **"+ New query"**

---

### ✅ Passo 2: Copiar e Executar o Script SQL

Cole o código abaixo no editor e clique em **"Run"** (ou pressione `Ctrl+Enter`):

```sql
-- ================================================
-- TABELA DE PERFIS DE USUÁRIO
-- ================================================
-- Cria tabela de perfis vinculada aos usuários do Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ================================================
-- Habilita Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- FUNÇÃO PARA AUTO-CRIAR PERFIL
-- ================================================
-- Cria automaticamente um perfil quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGER PARA AUTO-CRIAR PERFIL
-- ================================================
-- Dispara a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- FUNÇÃO PARA ATUALIZAR 'updated_at'
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGER PARA ATUALIZAR 'updated_at'
-- ================================================
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

---

### ✅ Passo 3: Configurar o Storage para Avatares

#### 3.1 - Criar Bucket de Imagens

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Create a new bucket"**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Marque esta opção (para imagens serem públicas)
4. Clique em **"Create bucket"**

#### 3.2 - Configurar Políticas do Bucket

1. Clique no bucket **"avatars"** que acabou de criar
2. Vá na aba **"Policies"**
3. Clique em **"New Policy"** e cole cada política abaixo:

**Política 1: Permitir Upload**

```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);
```

**Política 2: Permitir Leitura Pública**

```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

**Política 3: Permitir Atualização**

```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);
```

**Política 4: Permitir Deletar**

```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);
```

---

### ✅ Passo 4: Verificar se Funcionou

#### 4.1 - Verificar Tabela

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver a tabela **"profiles"** criada
3. Ela estará vazia inicialmente

#### 4.2 - Testar no App

1. **Cadastre um novo usuário** no app
2. Volte ao Supabase → **Table Editor** → **profiles**
3. Você deve ver um registro criado automaticamente! ✅

---

## 📊 Estrutura Criada

### Tabela: `profiles`

| Coluna     | Tipo      | Descrição               |
| ---------- | --------- | ----------------------- |
| id         | UUID      | ID do usuário (FK auth) |
| email      | TEXT      | Email do usuário        |
| full_name  | TEXT      | Nome completo           |
| avatar_url | TEXT      | URL da foto de perfil   |
| bio        | TEXT      | Biografia               |
| created_at | TIMESTAMP | Data de criação         |
| updated_at | TIMESTAMP | Última atualização      |

### Bucket de Storage: `avatars`

- Armazena fotos de perfil
- Público para leitura
- Apenas o dono pode fazer upload/deletar

---

## 🧪 Testando a Integração

### Teste 1: Criar Usuário

```javascript
// Ao criar usuário no app, verifica no Supabase se aparece na tabela profiles
```

### Teste 2: Atualizar Foto

```javascript
// Ao tirar foto no app, verifica no Storage se aparece em avatars/
```

### Teste 3: Ver Dados

```javascript
// Os dados do perfil devem carregar automaticamente na tela de perfil
```

---

## ⚠️ Solução de Problemas

### Erro: "permission denied for table profiles"

**Solução:** Execute novamente as políticas RLS (Passo 2)

### Erro: "new row violates row-level security policy"

**Solução:** Certifique-se que RLS está configurado corretamente

### Erro ao fazer upload de imagem

**Solução:**

1. Verifique se o bucket `avatars` está marcado como **Public**
2. Execute novamente as políticas do Storage (Passo 3.2)

---

## 📝 Dados de Exemplo (Opcional)

Para testar manualmente, cole este SQL no editor:

```sql
-- Inserir perfil de teste
INSERT INTO public.profiles (id, email, full_name, bio)
VALUES (
  auth.uid(), -- ID do usuário logado
  'teste@teste.com',
  'João Silva',
  'Desenvolvedor mobile apaixonado por React Native!'
);
```

---

## ✅ Checklist de Validação

Marque conforme vai completando:

- [ ] Tabela `profiles` criada
- [ ] Políticas RLS configuradas
- [ ] Triggers criados
- [ ] Bucket `avatars` criado
- [ ] Bucket marcado como público
- [ ] Políticas do Storage configuradas
- [ ] Testei criar usuário no app
- [ ] Perfil foi criado automaticamente
- [ ] Consegui fazer upload de foto

---

## 🎯 Próximos Passos

Após concluir esta configuração:

1. Reinicie o app Expo (`r` no terminal)
2. Faça login ou crie uma nova conta
3. Teste atualizar a foto de perfil
4. Verifique no Supabase se tudo foi salvo!

**Pronto! Seu app agora está totalmente integrado com o Supabase! 🎉**
