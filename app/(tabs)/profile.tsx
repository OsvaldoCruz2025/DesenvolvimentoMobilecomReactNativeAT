// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "../../providers/SessionContext";
import { useTheme } from "../../providers/ThemeContext";
import { useImage } from "../../hooks/useImage";
import { useProfile } from "../../hooks/useProfile";
import { formatImageUri, truncateText } from "../../services/Image";
import { signOut } from "../../services/Auth";

const DEFAULT_AVATAR = require("../../assets/default-avatar.png");

export default function ProfileScreen() {
  const { user } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const {
    image,
    takePhoto,
    pickFromGallery,
    loading: imageLoading,
  } = useImage();
  const { profile, loading: profileLoading, updateProfilePhoto } = useProfile();

  const performLogout = async () => {
    const result = await signOut();

    if (!result.success) {
      Alert.alert("Erro", result.error || "Nao foi possivel sair da conta.");
      return;
    }

    console.log("👋 Usuário deslogado");
    router.replace("/login");
  };

  /**
   * Captura foto com a câmera e atualiza no Supabase
   */
  const handleTakePhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      Alert.alert("Atualizar Foto", "Deseja atualizar sua foto de perfil?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            const result = await updateProfilePhoto(photo);
            if (result.success) {
              Alert.alert("Sucesso", "Foto do perfil atualizada!");
            } else {
              Alert.alert("Erro", "Não foi possível atualizar a foto");
            }
          },
        },
      ]);
    }
  };

  /**
   * Escolhe foto da galeria e atualiza no Supabase
   */
  const handlePickFromGallery = async () => {
    const photo = await pickFromGallery();
    if (photo) {
      Alert.alert("Atualizar Foto", "Deseja atualizar sua foto de perfil?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            const result = await updateProfilePhoto(photo);
            if (result.success) {
              Alert.alert("Sucesso", "Foto do perfil atualizada!");
            } else {
              Alert.alert("Erro", "Não foi possível atualizar a foto");
            }
          },
        },
      ]);
    }
  };

  /**
   * Faz logout
   */
  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = globalThis.confirm("Tem certeza que deseja sair?");
      if (!confirmed) return;
      performLogout();
      return;
    }

    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  // Determina qual avatar mostrar (Supabase > imagem local > fallback)
  const avatarSource = formatImageUri(
    profile?.avatar_url || image,
    DEFAULT_AVATAR,
  );

  const displayName = truncateText(
    profile?.full_name || user?.email?.split("@")[0] || "Usuário",
    15,
  );
  const displayEmail = truncateText(user?.email || "", 30);

  // Loading state
  if (profileLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Carregando perfil...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header com Avatar */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />

          {/* FABs para trocar foto */}
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: theme.primary }]}
              onPress={handleTakePhoto}
              disabled={imageLoading || profileLoading}
            >
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fab, { backgroundColor: theme.primary }]}
              onPress={handlePickFromGallery}
              disabled={imageLoading || profileLoading}
            >
              <Ionicons name="images" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.name, { color: theme.text }]}>{displayName}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {displayEmail}
        </Text>
      </View>

      {/* Menu de opções */}
      <View style={styles.menuContainer}>
        {/* Configurações */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => router.push("/settings")}
        >
          <View
            style={[styles.menuIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <Ionicons name="settings-outline" size={24} color={theme.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>
              Configurações
            </Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              Temas e preferências
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        {/* Sobre o App */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => {
            Alert.alert(
              "🎬 Catálogo de Filmes V2",
              "Versão 1.0.0\n\nDesenvolvido como projeto acadêmico.\n\nINFNET - Desenvolvimento Mobile com React Native",
              [{ text: "OK" }],
            );
          }}
        >
          <View
            style={[styles.menuIcon, { backgroundColor: theme.info + "20" }]}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.info}
            />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>
              Sobre o App
            </Text>
            <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
              Versão e informações
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "#FF3B30" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  fabContainer: {
    position: "absolute",
    bottom: -5,
    right: -5,
    flexDirection: "row",
    gap: 8,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
