/**
 * Tema Claro
 */
export const lightTheme = {
  // Cores de fundo
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",

  // Cores de texto
  text: "#000000",
  textSecondary: "#666666",
  textTertiary: "#999999",

  // Cores de ação
  primary: "#E50914", // Netflix Red
  secondary: "#B81D24", // Darker Red
  accent: "#564D4D", // Dark Gray

  // Interface
  tabBar: "#FFFFFF",
  border: "#E0E0E0",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Status
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  // Ratings
  ratingGood: "#4CAF50",
  ratingAverage: "#FF9800",
  ratingBad: "#F44336",
};

/**
 * Tema Escuro
 */
export const darkTheme = {
  // Cores de fundo
  background: "#141414",
  surface: "#1F1F1F",
  card: "#2C2C2C",

  // Cores de texto
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textTertiary: "#666666",

  // Cores de ação
  primary: "#E50914", // Netflix Red
  secondary: "#FF1744", // Brighter Red
  accent: "#FFFFFF", // White

  // Interface
  tabBar: "#000000",
  border: "#2C2C2E",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.7)",

  // Status
  success: "#66BB6A",
  warning: "#FFA726",
  error: "#EF5350",
  info: "#42A5F5",

  // Ratings
  ratingGood: "#66BB6A",
  ratingAverage: "#FFA726",
  ratingBad: "#EF5350",
};

/**
 * Obtém a cor da avaliação baseado no valor
 * @param {number} rating - Avaliação (0-10)
 * @param {object} theme - Tema atual
 * @returns {string} - Cor hex
 */
export const getRatingColor = (rating, theme) => {
  if (rating >= 7) return theme.ratingGood;
  if (rating >= 5) return theme.ratingAverage;
  return theme.ratingBad;
};

/**
 * Constantes de temas
 */
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};
