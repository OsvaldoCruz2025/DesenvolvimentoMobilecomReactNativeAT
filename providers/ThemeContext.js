import React, { createContext, useState, useEffect, useContext } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, THEME_MODES } from "../services/Themes";
import { saveData, getData } from "../services/Storage";

// Criação do contexto
const ThemeContext = createContext(undefined);

// Chave para armazenar preferência de tema
const THEME_STORAGE_KEY = "themeMode";

/**
 * Provider para gerenciar temas da aplicação
 */
export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeMode] = useState(THEME_MODES.SYSTEM);

  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * Carrega a preferência de tema salva
   */
  const loadThemePreference = async () => {
    try {
      const saved = await getData(THEME_STORAGE_KEY);

      if (saved && Object.values(THEME_MODES).includes(saved)) {
        setThemeMode(saved);
        console.log("✅ Tema carregado:", saved);
      } else {
        console.log("ℹ️ Usando tema padrão do sistema");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar tema:", error);
    }
  };

  /**
   * Altera o tema da aplicação
   * @param {string} mode - 'light' | 'dark' | 'system'
   */
  const changeTheme = async (mode) => {
    if (!Object.values(THEME_MODES).includes(mode)) {
      console.error("❌ Modo de tema inválido:", mode);
      return;
    }

    setThemeMode(mode);
    await saveData(THEME_STORAGE_KEY, mode);
    console.log("✅ Tema alterado para:", mode);
  };

  /**
   * Determina o tema atual baseado no modo selecionado
   */
  const getCurrentTheme = () => {
    if (themeMode === THEME_MODES.SYSTEM) {
      // Usa o tema do sistema (light ou dark)
      return systemScheme === "dark" ? darkTheme : lightTheme;
    }

    // Usa o tema escolhido pelo usuário
    return themeMode === THEME_MODES.DARK ? darkTheme : lightTheme;
  };

  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === darkTheme;

  const value = {
    theme: currentTheme,
    themeMode,
    changeTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook para usar o contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
};
