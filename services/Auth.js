import { supabase } from "./Supabase";

/**
 * Faz login do usuário
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signIn = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("🔐 Tentando fazer login com:", normalizedEmail);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) throw error;
    console.log("✅ Login bem-sucedido:", data.user.email);
    return { success: true, user: data.user };
  } catch (error) {
    console.error("❌ Erro no login:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Registra novo usuário
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const signUp = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Faz logout do usuário
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erro no logout:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia email de redefinicao de senha
 * @param {string} email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resetPassword = async (email) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: "http://localhost:8081/login",
      },
    );
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar reset de senha:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtém a sessão atual do usuário
 * @returns {Promise<object|null>}
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    console.log(
      "📋 Sessão atual:",
      session ? `Usuário: ${session.user.email}` : "Nenhuma sessão",
    );
    return session;
  } catch (error) {
    console.error("❌ Erro ao verificar sessão:", error);
    return null;
  }
};

/**
 * Obtém o usuário atual
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
};
