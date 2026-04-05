# 🚀 Comandos Úteis - Guia Rápido

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Limpar cache e reinstalar (se tiver problemas)
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## ▶️ Executar o Projeto

```bash
# Iniciar normalmente
npx expo start

# Iniciar e limpar cache
npx expo start -c

# Iniciar no Android
npx expo start --android

# Iniciar no iOS (apenas Mac)
npx expo start --ios

# Iniciar no Web
npx expo start --web
```

---

## 🐛 Resolução de Problemas

```bash
# Limpar cache do Expo
npx expo start -c

# Limpar cache do Metro Bundler
npx react-native start --reset-cache

# Reinstalar dependências
rm -rf node_modules
npm install

# Verificar versões
npx expo doctor

# Atualizar Expo CLI
npm install -g expo-cli@latest
```

---

## 📱 Comandos do Expo Go

### Após executar `npx expo start`:

- Pressione **`a`** - Abrir no Android
- Pressione **`i`** - Abrir no iOS
- Pressione **`w`** - Abrir no navegador
- Pressione **`r`** - Recarregar app
- Pressione **`m`** - Alternar menu de desenvolvimento
- Pressione **`c`** - Limpar cache e recarregar
- Pressione **`q`** - Sair

---

## 🔑 Configurar Variáveis de Ambiente

### Supabase (https://supabase.com/)

1. Criar projeto no Supabase
2. Ir em Settings → API
3. Copiar URL e anon key
4. Colar no `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### TMDB (https://www.themoviedb.org/)

1. Criar conta no TMDB
2. Ir em Settings → API
3. Solicitar API Key (gratuita)
4. Colar no `.env`:

```env
EXPO_PUBLIC_TMDB_API_KEY=sua_chave_aqui
```

---

## 📊 Testar Bancos de Dados

### Ver dados do SQLite (opcional - para debug)

```bash
# Instalar SQLite Viewer
npm install -g sqlite3

# Ver tabela de favoritos
# (Primeiro encontre o arquivo .db no simulador/emulador)
sqlite3 movies.db "SELECT * FROM favorite_movies;"
```

### Ver dados do AsyncStorage (debug)

No código, adicione temporariamente:

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ver todas as chaves
const keys = await AsyncStorage.getAllKeys();
console.log("Keys:", keys);

// Ver um valor específico
const value = await AsyncStorage.getItem("themeMode");
console.log("Theme:", value);
```

---

## 🎨 Gerar Ícones e Splash Screen

### Opção 1 - Usar ferramenta online

1. Acesse: https://icon.expo.fyi/
2. Faça upload de uma imagem
3. Baixe os assets gerados
4. Substitua em `assets/`

### Opção 2 - Usar CLI do Expo

```bash
# Gerar ícones automaticamente (requer icon.png 1024x1024)
npx expo prebuild
```

---

## 📦 Build para Produção

### Android (APK)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Build APK para teste
eas build -p android --profile preview

# Build AAB para Play Store
eas build -p android --profile production
```

### iOS (apenas Mac com Xcode)

```bash
# Build para TestFlight
eas build -p ios --profile production
```

---

## 🧪 Testes e Validação

### Checklist de Testes Manuais

```bash
# 1. Autenticação
✅ Cadastrar novo usuário
✅ Fazer login
✅ Logout
✅ Sessão mantida ao reabrir

# 2. Filmes
✅ Listar filmes populares
✅ Trocar categoria
✅ Ver detalhes
✅ Pull to refresh

# 3. Favoritos
✅ Adicionar favorito
✅ Remover favorito
✅ Ver na aba Favoritos
✅ Funciona offline

# 4. Perfil
✅ Ver informações do usuário
✅ Tirar foto com câmera
✅ Escolher da galeria
✅ Foto atualiza imediatamente

# 5. Tema
✅ Tema claro
✅ Tema escuro
✅ Padrão do sistema
✅ Persiste ao reabrir
```

---

## 🔍 Debug e Logs

### Ver logs no console

```bash
# Logs gerais
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Ou use o console do Expo Go
# Pressione 'm' no terminal e ative "Debug Remote JS"
```

### Adicionar logs no código

```javascript
// Console padrão
console.log("✅ Sucesso:", data);
console.error("❌ Erro:", error);
console.warn("⚠️ Aviso:", warning);

// Debug de objetos
console.log("Objeto:", JSON.stringify(object, null, 2));
```

---

## 📚 Documentação Rápida

### Links Úteis

- **Expo Docs:** https://docs.expo.dev/
- **React Native:** https://reactnative.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **Supabase:** https://supabase.com/docs
- **TMDB API:** https://developers.themoviedb.org/3
- **Expo SQLite:** https://docs.expo.dev/versions/latest/sdk/sqlite/
- **Image Picker:** https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

## 💡 Dicas Úteis

### Performance

```bash
# Modo produção (mais rápido)
npx expo start --no-dev --minify

# Ver bundle size
npx expo export
```

### Atualizar dependências

```bash
# Ver outdated
npm outdated

# Atualizar tudo
npm update

# Atualizar Expo SDK
npx expo upgrade
```

### Limpar TUDO (última tentativa se nada funcionar)

```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npx expo start -c

# Mac/Linux
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npx expo start -c
```

---

## 🆘 Erros Comuns e Soluções

### "Cannot find module 'react'"

```bash
npm install
```

### "Network request failed"

- Verifique sua conexão com a internet
- Verifique se as API Keys estão corretas no `.env`
- Tente reiniciar: `npx expo start -c`

### "Unable to resolve module"

```bash
npx expo start -c
```

### "Supabase URL não configurada"

- Verifique o arquivo `.env`
- Certifique-se que as variáveis começam com `EXPO_PUBLIC_`

### App não conecta no celular

- Certifique-se que celular e PC estão na mesma rede Wi-Fi
- Desabilite VPN se estiver usando
- Use conexão via cabo USB (modo Tunnel no Expo)

---

## 🎯 Após Concluir o Projeto

### Para entregar:

1. ✅ Teste todas as funcionalidades
2. ✅ Tire screenshots do app funcionando
3. ✅ Documente o uso de IA (veja PASSO_A_PASSO.md)
4. ✅ Prepare apresentação (se necessário)

### Para portfolio:

```bash
# Fazer build de produção
eas build -p android --profile preview

# Gerar link público
eas submit -p android
```

---

Bom trabalho! 🚀
