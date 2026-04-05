import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";

/**
 * Hook customizado para buscar filmes da API TMDB
 */
export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Função genérica para fazer requisições à API
   * @param {string} endpoint - Endpoint da API
   * @returns {Promise<object|null>}
   */
  const fetchFromAPI = async (endpoint) => {
    try {
      if (!API_KEY) {
        throw new Error(
          "TMDB API Key não configurada. Configure no arquivo .env",
        );
      }

      const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}&language=pt-BR`;

      console.log("📡 Buscando:", endpoint);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("❌ Erro na requisição:", err);
      setError(err.message);
      return null;
    }
  };

  /**
   * Busca filmes populares
   * @param {number} page - Número da página
   */
  const fetchPopularMovies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchFromAPI(`/movie/popular?page=${page}`);

      if (data && data.results) {
        setMovies(data.results);
        console.log(`✅ ${data.results.length} filmes populares carregados`);
        console.log(
          "📽️ Primeiro filme:",
          data.results[0]?.title,
          "- Poster:",
          data.results[0]?.poster_path,
        );
      }
    } catch (err) {
      console.error("Erro ao buscar filmes populares:", err);
      Alert.alert("Erro", "Não foi possível carregar os filmes");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca filmes em cartaz
   * @param {number} page - Número da página
   */
  const fetchNowPlayingMovies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchFromAPI(`/movie/now_playing?page=${page}`);

      if (data && data.results) {
        setMovies(data.results);
        console.log(`✅ ${data.results.length} filmes em cartaz carregados`);
      }
    } catch (err) {
      console.error("Erro ao buscar filmes em cartaz:", err);
      Alert.alert("Erro", "Não foi possível carregar os filmes");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca filmes top rated
   * @param {number} page - Número da página
   */
  const fetchTopRatedMovies = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchFromAPI(`/movie/top_rated?page=${page}`);

      if (data && data.results) {
        setMovies(data.results);
        console.log(`✅ ${data.results.length} filmes top rated carregados`);
      }
    } catch (err) {
      console.error("Erro ao buscar top rated:", err);
      Alert.alert("Erro", "Não foi possível carregar os filmes");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca detalhes de um filme específico
   * @param {number} movieId - ID do filme
   * @returns {Promise<object|null>}
   */
  const fetchMovieDetails = async (movieId) => {
    try {
      const data = await fetchFromAPI(`/movie/${movieId}`);
      console.log("✅ Detalhes do filme carregados:", data?.title);
      return data;
    } catch (err) {
      console.error("Erro ao buscar detalhes do filme:", err);
      return null;
    }
  };

  /**
   * Busca filmes por termo de pesquisa
   * @param {string} query - Termo de pesquisa
   * @returns {Promise<Array>}
   */
  const searchMovies = async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      setLoading(true);
      const encodedQuery = encodeURIComponent(query.trim());
      const data = await fetchFromAPI(`/search/movie?query=${encodedQuery}`);

      if (data && data.results) {
        console.log(
          `✅ ${data.results.length} filmes encontrados para: ${query}`,
        );
        return data.results;
      }

      return [];
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarrega os filmes (pull-to-refresh)
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPopularMovies(1);
    setRefreshing(false);
  }, [fetchPopularMovies]);

  // Carrega filmes populares ao montar o componente
  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  return {
    movies,
    loading,
    refreshing,
    error,
    onRefresh,
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchTopRatedMovies,
    fetchMovieDetails,
    searchMovies,
  };
};
