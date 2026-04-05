import { useState, useEffect } from "react";
import { useSession } from "../providers/SessionContext";
import {
  getProfile,
  upsertProfile,
  updateAvatar,
  uploadAvatar,
  deleteAvatar,
} from "../services/Profile";

/**
 * Hook para gerenciar o perfil do usuário no Supabase
 * @returns {object} Dados e funções do perfil
 */
export function useProfile() {
  const { session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega o perfil ao montar o componente
  useEffect(() => {
    if (session?.user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  /**
   * Carrega os dados do perfil
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await getProfile(session.user.id);

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza os dados do perfil
   * @param {object} updates - Dados a atualizar (full_name, bio, etc)
   */
  const updateProfile = async (updates) => {
    try {
      setError(null);

      const { data, error } = await upsertProfile(session.user.id, updates);

      if (error) throw error;

      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.message);
      return { success: false, error: err };
    }
  };

  /**
   * Atualiza a foto de perfil
   * @param {string} imageUri - URI da imagem local
   */
  const updateProfilePhoto = async (imageUri) => {
    try {
      setError(null);

      // Remove foto antiga se existir
      if (profile?.avatar_url) {
        await deleteAvatar(profile.avatar_url);
      }

      // Faz upload da nova foto
      const { url, error: uploadError } = await uploadAvatar(
        session.user.id,
        imageUri,
      );

      if (uploadError) throw uploadError;

      // Atualiza o perfil com a nova URL
      const { error: updateError } = await updateAvatar(session.user.id, url);

      if (updateError) throw updateError;

      // Atualiza o estado local
      setProfile((prev) => ({ ...prev, avatar_url: url }));

      return { success: true, url };
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
      setError(err.message);
      return { success: false, error: err };
    }
  };

  /**
   * Recarrega o perfil do banco
   */
  const refresh = async () => {
    await loadProfile();
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateProfilePhoto,
    refresh,
  };
}
