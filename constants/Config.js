/**
 * Constantes da aplicação
 */

// API Configuration
export const API_CONFIG = {
  TMDB_BASE_URL:
    process.env.EXPO_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3",
  TMDB_IMAGE_BASE_URL:
    process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
  TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

// Image Sizes (TMDB)
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    XLARGE: "w780",
    ORIGINAL: "original",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  THEME_MODE: "themeMode",
  PROFILE_AVATAR: "profileAvatar",
  USER_PREFERENCES: "userPreferences",
};

// Theme Modes
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// App Info
export const APP_INFO = {
  NAME: "Catálogo de Filmes V2",
  VERSION: "1.0.0",
  AUTHOR: "Aluno INFNET",
  DESCRIPTION: "App de catálogo de filmes com React Native",
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 15,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Messages
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login realizado com sucesso!",
    LOGOUT_SUCCESS: "Até logo!",
    REGISTER_SUCCESS: "Conta criada com sucesso!",
    INVALID_EMAIL: "Email inválido",
    SHORT_PASSWORD: "A senha deve ter pelo menos 6 caracteres",
  },
  FAVORITES: {
    ADDED: "Filme adicionado aos favoritos!",
    REMOVED: "Filme removido dos favoritos",
    ALREADY_EXISTS: "Este filme já está nos favoritos",
  },
  ERRORS: {
    GENERIC: "Ocorreu um erro. Tente novamente.",
    NETWORK: "Verifique sua conexão com a internet",
    NO_DATA: "Nenhum dado encontrado",
  },
};
