import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../services/Supabase";
import { getCurrentSession } from "../services/Auth";

// Criação do contexto
const SessionContext = createContext(undefined);

/**
 * Provider para gerenciar a sessão do usuário
 */
export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão inicial
    checkSession();

    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth event:", event);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN") {
          console.log("✅ Usuário logado:", session?.user?.email);
        } else if (event === "SIGNED_OUT") {
          console.log("👋 Usuário deslogado");
        }
      },
    );

    // Cleanup do listener
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  /**
   * Verifica se existe uma sessão ativa
   */
  const checkSession = async () => {
    try {
      console.log("🔍 Verificando sessão...");
      const session = await getCurrentSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("✅ Sessão restaurada:", session.user.email);
      } else {
        console.log("ℹ️ Nenhuma sessão ativa");
      }
    } catch (error) {
      console.error("❌ Erro ao verificar sessão:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Força atualização da sessão (sem alterar loading)
   */
  const refreshSession = async () => {
    try {
      console.log("🔄 Atualizando sessão...");
      const session = await getCurrentSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("✅ Sessão atualizada:", session.user.email);
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar sessão:", error);
    }
  };

  const value = {
    user,
    loading,
    refreshSession,
    isAuthenticated: !!user,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

/**
 * Hook para usar o contexto de sessão
 */
export const useSession = () => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession deve ser usado dentro de um SessionProvider");
  }

  return context;
};
