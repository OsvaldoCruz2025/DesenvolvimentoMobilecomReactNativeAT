import { useState, useEffect, useCallback } from "react";
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
} from "../services/SQLite";

/**
 * Hook customizado para gerenciar filmes favoritos
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Carrega todos os filmes favoritos
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllFavorites();
      setFavorites(data);
      console.log(`✅ ${data.length} favoritos carregados`);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recarrega a lista de favoritos (pull-to-refresh)
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, [loadFavorites]);

  /**
   * Adiciona um filme aos favoritos
   * @param {object} movie - Objeto do filme
   * @returns {Promise<boolean>} - True se adicionado com sucesso
   */
  const addToFavorites = async (movie) => {
    try {
      const result = await addFavorite(movie);

      if (result.success) {
        await loadFavorites(); // Recarrega a lista
        return true;
      } else {
        console.warn("Aviso:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      return false;
    }
  };

  /**
   * Remove um filme dos favoritos
   * @param {number} movieId - ID do filme
   * @returns {Promise<boolean>} - True se removido com sucesso
   */
  const removeFromFavorites = async (movieId) => {
    try {
      const result = await removeFavorite(movieId);

      if (result.success) {
        await loadFavorites(); // Recarrega a lista
        return true;
      } else {
        console.error("Erro ao remover:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      return false;
    }
  };

  /**
   * Verifica se um filme está nos favoritos
   * @param {number} movieId - ID do filme
   * @returns {Promise<boolean>}
   */
  const isFavorite = async (movieId) => {
    return await checkIsFavorite(movieId);
  };

  /**
   * Toggle favorito (adiciona ou remove)
   * @param {object} movie - Objeto do filme
   * @returns {Promise<boolean>} - Novo estado (true = favoritado)
   */
  const toggleFavorite = async (movie) => {
    const isCurrentlyFavorite = await isFavorite(movie.id);

    if (isCurrentlyFavorite) {
      const removed = await removeFromFavorites(movie.id);
      return !removed; // Se removeu, retorna false
    } else {
      const added = await addToFavorites(movie);
      return added; // Se adicionou, retorna true
    }
  };

  // Carrega favoritos ao montar o componente
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    refreshing,
    onRefresh,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    reloadFavorites: loadFavorites,
  };
};
