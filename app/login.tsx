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
import { useSession } from "../providers/SessionContext";
import { signIn, resetPassword } from "../services/Auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const { theme } = /** @type {any} */ useTheme();
  const { refreshSession } = /** @type {any} */ useSession();
  const router = useRouter();

  /**
   * Valida os campos do formulário
   */
  const validateForm = () => {
    if (!email.trim()) {
      setAuthError("Por favor, insira seu email.");
      Alert.alert("Erro", "Por favor, insira seu email");
      return false;
    }

    if (!email.includes("@")) {
      setAuthError("Por favor, insira um email válido.");
      Alert.alert("Erro", "Por favor, insira um email válido");
      return false;
    }

    if (!password) {
      setAuthError("Por favor, insira sua senha.");
      Alert.alert("Erro", "Por favor, insira sua senha");
      return false;
    }

    if (password.length < 6) {
      setAuthError("A senha deve ter pelo menos 6 caracteres.");
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    setAuthError("");
    return true;
  };

  /**
   * Realiza o login
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setAuthError("");

    try {
      const result = await signIn(email.trim(), password);

      if (result.success) {
        console.log("✅ Login realizado com sucesso");
        setAuthError("");

        // Aguarda um momento para o Supabase processar
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Força atualização da sessão
        await refreshSession();

        // Navega para a home
        router.replace("/");
      } else {
        const errorMessage =
          result.error ||
          "Nao foi possivel fazer login. Verifique suas credenciais.";

        if (errorMessage.toLowerCase().includes("invalid login credentials")) {
          setAuthError("Email ou senha incorretos.");
          Alert.alert(
            "Credenciais invalidas",
            "Email ou senha incorretos. Se precisar, envie um email para redefinir sua senha.",
            [
              {
                text: "Redefinir senha",
                onPress: async () => {
                  if (!email.trim()) {
                    Alert.alert(
                      "Aviso",
                      "Digite seu email para redefinir a senha.",
                    );
                    return;
                  }
                  const resetResult = await resetPassword(email);
                  if (resetResult.success) {
                    Alert.alert("Sucesso", "Email de redefinicao enviado.");
                  } else {
                    Alert.alert(
                      "Erro",
                      resetResult.error ||
                        "Falha ao enviar email de redefinicao.",
                    );
                  }
                },
              },
              { text: "OK", style: "cancel" },
            ],
          );
          return;
        }

        setAuthError(errorMessage);
        Alert.alert("Erro no Login", errorMessage);
      }
    } catch (error) {
      setAuthError("Ocorreu um erro inesperado ao tentar entrar.");
      Alert.alert("Erro", "Ocorreu um erro inesperado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Aviso", "Digite seu email para redefinir a senha.");
      return;
    }

    setLoading(true);
    try {
      const resetResult = await resetPassword(email);
      if (resetResult.success) {
        Alert.alert("Sucesso", "Email de redefinicao enviado.");
      } else {
        Alert.alert(
          "Erro",
          resetResult.error || "Falha ao enviar email de redefinicao.",
        );
      }
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
        {/* Logo/Ícone */}
        <View
          style={[styles.logoContainer, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="film" size={60} color="#FFF" />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: theme.text }]}>
          🎬 Catálogo de Filmes
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Entre para continuar
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
              onChangeText={(text) => {
                setEmail(text);
                if (authError) setAuthError("");
              }}
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
              placeholder="Senha"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (authError) setAuthError("");
              }}
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

          <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
            <Text style={[styles.forgotPassword, { color: theme.primary }]}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          {!!authError && <Text style={styles.errorText}>{authError}</Text>}

          {/* Botão de Login */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para cadastro */}
          <TouchableOpacity
            onPress={() => router.push("/register")}
            disabled={loading}
          >
            <Text style={[styles.link, { color: theme.primary }]}>
              Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
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
  forgotPassword: {
    textAlign: "right",
    fontSize: 13,
    marginTop: 2,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    marginTop: -4,
  },
  linkBold: {
    fontWeight: "bold",
  },
});
