# 🎬 Catálogo de Filmes V2

Aplicativo de catálogo de filmes desenvolvido com React Native e Expo Router.

## 📱 Funcionalidades

- ✅ Sistema de autenticação (Login/Cadastro)
- ✅ Proteção de rotas
- ✅ Temas dinâmicos (Claro/Escuro/Sistema)
- ✅ Favoritos offline (SQLite)
- ✅ Perfil com foto (Câmera/Galeria)
- ✅ Catálogo de filmes (TMDB API)

## 🚀 Como iniciar

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`

Se a TMDB retornar erro `401`, configure também `EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN`. Esse token fica no painel da TMDB em `Settings > API`.

3. Inicie o projeto:

```bash
npx expo start
```

## 🛠️ Tecnologias

- React Native
- Expo Router
- Supabase (Autenticação)
- SQLite (Banco local)
- TMDB API (Filmes)
- Expo Image Picker

## 📚 Estrutura

```
app/          # Telas (file-based routing)
providers/    # Contexts (Session, Theme)
services/     # Serviços (Auth, DB, API)
hooks/        # Hooks customizados
components/   # Componentes reutilizáveis
constants/    # Configurações
```

## 📝 Desenvolvido por

Osvaldo Cruz - Desenvolvimento Mobile com React Native
