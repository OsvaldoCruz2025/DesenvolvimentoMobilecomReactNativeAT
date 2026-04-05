# 🎬 Guia Passo a Passo - Catálogo de Filmes V2

## ✅ Próximos Passos para Executar o Projeto

### **PASSO 1: Instalar Dependências**

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

**Tempo estimado:** 2-5 minutos  
**O que acontece:** Instala todas as bibliotecas necessárias (React Native, Expo, Supabase, SQLite, etc.)

---

### **PASSO 2: Configurar o Supabase**

#### 2.1 - Criar Conta no Supabase

1. Acesse: https://supabase.com/
2. Clique em "Start your project"
3. Faça login com GitHub ou email
4. Crie um novo projeto (escolha um nome, senha e região)

#### 2.2 - Obter Credenciais

1. No dashboard do Supabase, vá em **Settings** (ícone de engrenagem) → **API**
2. Copie:
   - **Project URL** (URL)
   - **anon/public key** (Chave pública)

#### 2.3 - Configurar .env

Abra o arquivo `.env` na raiz do projeto e preencha:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**IMPORTANTE:** O Supabase já vem configurado para autenticação por email/senha. Não precisa criar tabelas!

---

### **PASSO 3: Configurar TMDB API**

#### 3.1 - Criar Conta no TMDB

1. Acesse: https://www.themoviedb.org/
2. Crie uma conta gratuita
3. Vá em **Settings** → **API**
4. Solicite uma API Key (escolha tipo "Developer")
5. Preencha o formulário (pode usar dados fictícios para fins acadêmicos)

#### 3.2 - Obter API Key

Após aprovação (geralmente instantânea):

1. Copie a **API Key (v3 auth)**
2. Cole no arquivo `.env`:

```env
EXPO_PUBLIC_TMDB_API_KEY=sua-chave-tmdb-aqui
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

---

### **PASSO 4: Adicionar Imagem de Avatar (Opcional)**

Para a foto de perfil padrão:

**Opção 1 - Download rápido:**

1. Baixe uma imagem de avatar genérico de: https://www.flaticon.com/free-icon/user_149071
2. Salve como `default-avatar.png` na pasta `assets/`

**Opção 2 - Usar placeholder online (temporário):**
Edite o arquivo `app/(tabs)/profile.tsx` e troque a linha:

```javascript
const DEFAULT_AVATAR = require("../../assets/default-avatar.png");
```

Por:

```javascript
const DEFAULT_AVATAR = {
  uri: "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Avatar",
};
```

---

### **PASSO 5: Iniciar o Projeto**

Execute no terminal:

```bash
npx expo start
```

**Aguarde até aparecer o QR Code!**

---

### **PASSO 6: Testar no Celular ou Emulador**

#### **Opção A - Celular Físico (Recomendado)**

1. Instale o app **Expo Go** no seu celular:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/br/app/expo-go/id982107779

2. Escaneie o QR Code que apareceu no terminal
3. O app abrirá automaticamente

#### **Opção B - Emulador Android (Windows/Mac/Linux)**

1. Execute no terminal: `npx expo start --android`
2. O Android Studio abrirá automaticamente

#### **Opção C - Simulador iOS (Apenas Mac)**

1. Execute: `npx expo start --ios`
2. O Xcode abrirá automaticamente

---

### **PASSO 7: Testar Funcionalidades**

#### 7.1 - Criar Conta

1. Na tela de login, clique em "Cadastre-se"
2. Use um email válido (exemplo: `teste@teste.com`)
3. Crie uma senha com pelo menos 6 caracteres
4. Clique em "Cadastrar"

#### 7.2 - Fazer Login

1. Use as credenciais criadas
2. Você será redirecionado para a tela de filmes

#### 7.3 - Explorar Filmes

- Veja filmes populares, em cartaz e melhores
- Clique em um filme para ver detalhes
- Clique no coração para favoritar

#### 7.4 - Favoritos Offline

1. Adicione alguns filmes aos favoritos
2. Vá na aba "Favoritos"
3. **Teste offline:** Feche o app, desative Wi-Fi/dados, abra novamente
4. Os favoritos devem aparecer mesmo sem internet!

#### 7.5 - Trocar Foto de Perfil

1. Vá na aba "Perfil"
2. Clique no ícone de câmera (tire uma selfie) ou galeria
3. A foto será atualizada imediatamente

#### 7.6 - Mudar Tema

1. No perfil, clique em "Configurações"
2. Escolha entre: Claro, Escuro ou Padrão do Sistema
3. O tema muda instantaneamente em todo o app

---

## 🐛 Resolução de Problemas Comuns

### Erro: "Supabase URL não configurada"

**Solução:** Verifique se o arquivo `.env` está na raiz do projeto e se as variáveis estão corretas.

### Erro: "Cannot find module 'expo-router'"

**Solução:** Execute `npm install` novamente.

### Erro: "Network request failed" ao buscar filmes

**Solução:** Verifique se a TMDB API Key está correta no `.env`.

### App não carrega após escanear QR Code

**Solução:**

1. Certifique-se que o celular e computador estão na mesma rede Wi-Fi
2. Tente limpar o cache: `npx expo start -c`

### Erro de permissão ao usar câmera/galeria

**Solução:** Nas configurações do celular, permita acesso à câmera e fotos para o Expo Go.

---

## 📋 Checklist Final

Antes de entregar o trabalho, verifique:

- [ ] Consegue fazer cadastro e login
- [ ] Lista de filmes carrega corretamente
- [ ] Consegue ver detalhes de um filme
- [ ] Favoritos são salvos e aparecem na aba Favoritos
- [ ] Favoritos aparecem mesmo sem internet (teste offline)
- [ ] Consegue trocar foto de perfil (câmera e galeria)
- [ ] Nome do usuário não quebra o layout (máx 15 caracteres)
- [ ] Consegue mudar o tema (Claro/Escuro/Sistema)
- [ ] Tema é aplicado em todas as telas
- [ ] Botão de logout funciona
- [ ] Ao reabrir o app, a sessão é mantida (auto-login)

---

## 🎓 Documentação de IA Usada

**IMPORTANTE:** Segundo as regras do trabalho, você deve citar o uso de IA.

### Modelo Usado:

- **GitHub Copilot** com **Claude Sonnet 4.5**
- Data de uso: [Data atual]

### Como citar no trabalho:

```
Este projeto foi desenvolvido com auxílio de ferramentas de IA (GitHub Copilot/Claude),
que forneceram suporte na estruturação do código, implementação de funcionalidades e
boas práticas de React Native. Todo código foi revisado, testado e adaptado para
atender aos requisitos específicos do trabalho.

Ferramentas de IA utilizadas:
- GitHub Copilot (Claude Sonnet 4.5)
- Uso: Scaffolding do projeto, implementação de componentes, serviços e telas
- Data: [Insira a data]
```

---

## 📚 Recursos Adicionais

### Documentação Oficial:

- **Expo Router:** https://docs.expo.dev/router/introduction/
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **TMDB API:** https://developers.themoviedb.org/3
- **Expo SQLite:** https://docs.expo.dev/versions/latest/sdk/sqlite/
- **Expo Image Picker:** https://docs.expo.dev/versions/latest/sdk/imagepicker/

### Tutoriais Úteis:

- Como usar Context API: https://react.dev/learn/passing-data-deeply-with-context
- SQLite no React Native: https://docs.expo.dev/develop/user-interface/store-data/
- Proteção de rotas com Expo Router: https://docs.expo.dev/router/reference/authentication/

---

## 🎯 Conceitos Aplicados no Projeto

Este projeto demonstra conhecimento em:

1. **Arquitetura e Organização**
   - File-based routing (Expo Router)
   - Separação de responsabilidades (Services, Providers, Hooks, Components)
   - Código modular e reutilizável

2. **Gerenciamento de Estado**
   - Context API (SessionContext, ThemeContext)
   - Hooks customizados
   - Estados locais e globais

3. **Persistência de Dados**
   - SQLite (favoritos offline)
   - AsyncStorage (preferências do usuário)
   - Supabase (autenticação na nuvem)

4. **Recursos Nativos**
   - Câmera e galeria (Expo Image Picker)
   - Permissões do dispositivo
   - Detecção do tema do sistema

5. **UX/UI**
   - Temas dinâmicos (claro/escuro)
   - Pull-to-refresh
   - Estados de loading e empty state
   - Navegação intuitiva com tabs

6. **Boas Práticas**
   - Tipagem com TypeScript
   - Tratamento de erros
   - Validação de formulários
   - Código documentado
   - Responsividade

---

## 🚀 Pronto para Começar!

Execute `npm install` e siga os passos. Boa sorte! 🎉

Se tiver dúvidas:

1. Consulte este guia
2. Leia a documentação oficial dos links acima
3. Verifique os comentários no código
