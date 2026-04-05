// @ts-nocheck
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "../providers/SessionContext";
import { ThemeProvider, useTheme } from "../providers/ThemeContext";
import { initializeDatabase } from "../services/SQLite";
import { LoadingScreen } from "../components/LoadingScreen";

/**
 * Componente de navegação com proteção de rotas
 */
function RootLayoutNav() {
  const { user, loading } = /** @type {any} */ useSession();
  const { isDark } = /** @type {any} */ useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentRoute = segments[0];
    const isAuthRoute = currentRoute === "login" || currentRoute === "register";
    const isProtectedRoute =
      currentRoute === "(tabs)" ||
      currentRoute === "details" ||
      currentRoute === "settings";

    console.log(
      "🧭 Navegação - Usuário:",
      user?.email || "não autenticado",
      "| Segmento:",
      segments[0],
      "| rota:",
      currentRoute,
    );

    // Fallback para rota inicial
    if (!currentRoute) {
      router.replace(user ? "/" : "/login");
      return;
    }

    // Se não está autenticado e tenta acessar área protegida
    if (!user && isProtectedRoute) {
      console.log("🔒 Redirecionando para login (não autenticado)");
      router.replace("/login");
    }
    // Se está autenticado e está em tela de autenticação
    else if (user && isAuthRoute) {
      console.log("✅ Redirecionando para home (autenticado)");
      router.replace("/");
    }
  }, [user, loading, segments]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Slot />
    </>
  );
}

/**
 * Layout raiz da aplicação
 * Inicializa banco de dados e provedores de contexto
 */
export default function RootLayout() {
  useEffect(() => {
    // Inicializa o banco de dados SQLite
    initializeDatabase().catch((error) => {
      console.error("Erro crítico ao inicializar banco:", error);
    });
  }, []);

  return (
    <ThemeProvider>
      <SessionProvider>
        <RootLayoutNav />
      </SessionProvider>
    </ThemeProvider>
  );
}
