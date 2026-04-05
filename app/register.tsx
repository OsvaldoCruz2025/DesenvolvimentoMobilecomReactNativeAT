// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";
import { signUp } from "../services/Auth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme } = useTheme();
  const router = useRouter();

  /**
   * Valida os campos do formulário
   */
  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, insira seu email");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return false;
    }

    if (!password) {
      Alert.alert("Erro", "Por favor, insira uma senha");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    return true;
  };

  /**
   * Realiza o cadastro
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signUp(email.trim(), password);

      if (result.success) {
        Alert.alert(
          "Cadastro Realizado!",
          "Sua conta foi criada com sucesso. Faça login para continuar.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ],
        );
      } else {
        // Tratamento especial para erro de rate limit
        const errorMessage =
          result.error || "Não foi possível criar sua conta. Tente novamente.";

        if (
          errorMessage.includes("429") ||
          errorMessage.toLowerCase().includes("rate limit")
        ) {
          Alert.alert(
            "Muitas tentativas",
            "Você atingiu o limite de cadastros. Por favor, aguarde alguns minutos e tente novamente.",
          );
        } else if (
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("já existe")
        ) {
          Alert.alert(
            "Email já cadastrado",
            "Esse email já possui uma conta. Faça login ou use outro email.",
            [
              {
                text: "Ir para Login",
                onPress: () => router.replace("/login"),
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ],
          );
        } else {
          Alert.alert("Erro no Cadastro", errorMessage);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botão voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Logo/Ícone */}
        <View
          style={[styles.logoContainer, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="person-add" size={60} color="#FFF" />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: theme.text }]}>Criar Conta</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Preencha os dados para se cadastrar
        </Text>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Senha */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Senha (mínimo 6 caracteres)"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Confirme a senha"
              placeholderTextColor={theme.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Botão de Cadastro */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para login */}
          <TouchableOpacity
            onPress={() => router.replace("/login")}
            disabled={loading}
          >
            <Text style={[styles.link, { color: theme.primary }]}>
              Já tem conta? <Text style={styles.linkBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
  linkBold: {
    fontWeight: "bold",
  },
});
