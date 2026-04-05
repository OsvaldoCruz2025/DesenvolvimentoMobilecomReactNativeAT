// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";
import { ThemeSelector } from "../components/ThemeSelector";
import { signOut } from "../services/Auth";

export default function SettingsScreen() {
  const { theme, themeMode, changeTheme } = useTheme();
  const router = useRouter();

  const performLogout = async () => {
    const result = await signOut();
    if (result.success) {
      router.replace("/login");
    } else {
      Alert.alert("Erro", result.error || "Nao foi possivel sair.");
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = globalThis.confirm(
        "Tem certeza que deseja sair da conta?",
      );
      if (!confirmed) return;
      performLogout();
      return;
    }

    Alert.alert("Sair", "Tem certeza que deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Personalize sua experiência
        </Text>
      </View>

      {/* Seção de Aparência */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Aparência
        </Text>
        <Text
          style={[styles.sectionDescription, { color: theme.textSecondary }]}
        >
          Escolha como o aplicativo deve aparecer
        </Text>

        <ThemeSelector currentMode={themeMode} onModeChange={changeTheme} />
      </View>

      {/* Informações */}
      <View style={[styles.infoBox, { backgroundColor: theme.surface }]}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          💡 As configurações são salvas automaticamente
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFF" />
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  infoBox: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
