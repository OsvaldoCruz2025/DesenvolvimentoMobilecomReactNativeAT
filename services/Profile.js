import { supabase } from "./Supabase";

/**
 * Busca o perfil do usuário logado
 * @returns {Promise<{data: object, error: any}>}
 */
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("❌ Erro ao buscar perfil:", error);
    return { data: null, error };
  }
};

/**
 * Cria ou atualiza o perfil do usuário
 * @param {string} userId - ID do usuário
 * @param {object} profileData - Dados do perfil (full_name, bio, avatar_url)
 * @returns {Promise<{data: object, error: any}>}
 */
export const upsertProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Perfil atualizado com sucesso");
    return { data, error: null };
  } catch (error) {
    console.error("❌ Erro ao atualizar perfil:", error);
    return { data: null, error };
  }
};

/**
 * Atualiza apenas a foto do perfil
 * @param {string} userId - ID do usuário
 * @param {string} avatarUrl - URL da foto
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const updateAvatar = async (userId, avatarUrl) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);

    if (error) throw error;

    console.log("✅ Foto de perfil atualizada");
    return { success: true, error: null };
  } catch (error) {
    console.error("❌ Erro ao atualizar foto:", error);
    return { success: false, error };
  }
};

/**
 * Atualiza o nome do usuário
 * @param {string} userId - ID do usuário
 * @param {string} fullName - Nome completo
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const updateFullName = async (userId, fullName) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId);

    if (error) throw error;

    console.log("✅ Nome atualizado");
    return { success: true, error: null };
  } catch (error) {
    console.error("❌ Erro ao atualizar nome:", error);
    return { success: false, error };
  }
};

/**
 * Atualiza a bio do usuário
 * @param {string} userId - ID do usuário
 * @param {string} bio - Biografia
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const updateBio = async (userId, bio) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", userId);

    if (error) throw error;

    console.log("✅ Bio atualizada");
    return { success: true, error: null };
  } catch (error) {
    console.error("❌ Erro ao atualizar bio:", error);
    return { success: false, error };
  }
};

/**
 * Faz upload de imagem para o Supabase Storage
 * @param {string} userId - ID do usuário
 * @param {string} fileUri - URI do arquivo local
 * @returns {Promise<{url: string, error: any}>}
 */
export const uploadAvatar = async (userId, fileUri) => {
  try {
    // Converte a URI em blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Nome único para o arquivo
    const fileName = `${userId}-${Date.now()}.jpg`;
    const filePath = `avatars/${fileName}`;

    // Upload para o bucket 'avatars'
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    // Obtém a URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    console.log("✅ Imagem enviada:", publicUrl);
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("❌ Erro ao fazer upload:", error);
    return { url: null, error };
  }
};

/**
 * Deleta a foto de perfil do storage
 * @param {string} avatarUrl - URL da foto antiga
 * @returns {Promise<{success: boolean}>}
 */
export const deleteAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl || !avatarUrl.includes("avatars/")) {
      return { success: true };
    }

    // Extrai o caminho do arquivo da URL
    const filePath = avatarUrl.split("/avatars/")[1];

    const { error } = await supabase.storage
      .from("avatars")
      .remove([`avatars/${filePath}`]);

    if (error) throw error;

    console.log("✅ Foto antiga removida");
    return { success: true };
  } catch (error) {
    console.error("⚠️ Erro ao remover foto antiga:", error);
    return { success: false };
  }
};
