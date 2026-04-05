import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";
import { THEME_MODES } from "../services/Themes";

/**
 * Componente seletor de tema (Radio buttons)
 */
export const ThemeSelector = ({ currentMode, onModeChange }) => {
  const { theme } = useTheme();

  const themeOptions = [
    {
      value: THEME_MODES.LIGHT,
      label: "Claro",
      icon: "sunny",
      description: "Tema com fundo branco",
    },
    {
      value: THEME_MODES.DARK,
      label: "Escuro",
      icon: "moon",
      description: "Tema com fundo preto",
    },
    {
      value: THEME_MODES.SYSTEM,
      label: "Padrão do Sistema",
      icon: "phone-portrait",
      description: "Acompanha o sistema operacional",
    },
  ];

  return (
    <View style={styles.container}>
      {themeOptions.map((option) => {
        const isSelected = currentMode === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { backgroundColor: theme.surface, borderColor: theme.border },
              isSelected && { borderColor: theme.primary, borderWidth: 2 },
            ]}
            onPress={() => onModeChange(option.value)}
            activeOpacity={0.7}
          >
            {/* Ícone */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected
                    ? theme.primary
                    : theme.background,
                },
              ]}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={isSelected ? "#FFF" : theme.text}
              />
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? theme.primary : theme.text },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[styles.description, { color: theme.textSecondary }]}
              >
                {option.description}
              </Text>
            </View>

            {/* Checkmark */}
            {isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.primary}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
  },
});
