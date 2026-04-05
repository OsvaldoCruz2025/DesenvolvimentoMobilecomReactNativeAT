import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let SQLite = null;
let db = null;

// Importa SQLite apenas em plataformas móveis
if (Platform.OS !== "web") {
  SQLite = require("expo-sqlite");
}

/**
 * Inicializa o banco de dados SQLite
 */
export const initializeDatabase = async () => {
  try {
    // Na web, usa AsyncStorage ao invés de SQLite
    if (Platform.OS === "web") {
      console.log("✅ Usando AsyncStorage para web");
      return;
    }

    db = SQLite.openDatabaseSync("movies.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorite_movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        poster_url TEXT,
        overview TEXT,
        release_date TEXT,
        vote_average REAL,
        backdrop_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Banco de dados SQLite inicializado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    throw error;
  }
};

/**
 * Adiciona um filme aos favoritos
 * @param {object} movie - Objeto do filme
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const addFavorite = async (movie) => {
  try {
    // Web: usa AsyncStorage
    if (Platform.OS === "web") {
      const favorites = await getAllFavorites();
      const exists = favorites.some((fav) => fav.movie_id === movie.id);

      if (exists) {
        return { success: false, error: "Este filme já está nos favoritos" };
      }

      const newFavorite = {
        id: Date.now(),
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        backdrop_path: movie.backdrop_path,
        created_at: new Date().toISOString(),
      };

      favorites.push(newFavorite);
      await AsyncStorage.setItem("favorite_movies", JSON.stringify(favorites));
      console.log("✅ Filme adicionado aos favoritos:", movie.title);
      return { success: true };
    }

    // Mobile: usa SQLite
    if (!db) {
      await initializeDatabase();
    }

    await db.runAsync(
      `INSERT INTO favorite_movies 
       (movie_id, title, poster_url, overview, release_date, vote_average, backdrop_path) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id,
        movie.title,
        movie.poster_path,
        movie.overview,
        movie.release_date,
        movie.vote_average,
        movie.backdrop_path,
      ],
    );

    console.log("✅ Filme adicionado aos favoritos:", movie.title);
    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao adicionar favorito:", error);

    if (error.message.includes("UNIQUE constraint")) {
      return { success: false, error: "Este filme já está nos favoritos" };
    }
    return { success: false, error: error.message };
  }
};

/**
 * Remove um filme dos favoritos
 * @param {number} movieId - ID do filme
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const removeFavorite = async (movieId) => {
  try {
    // Web: usa AsyncStorage
    if (Platform.OS === "web") {
      const favorites = await getAllFavorites();
      const filtered = favorites.filter((fav) => fav.movie_id !== movieId);
      await AsyncStorage.setItem("favorite_movies", JSON.stringify(filtered));
      console.log("✅ Filme removido dos favoritos:", movieId);
      return { success: true };
    }

    // Mobile: usa SQLite
    if (!db) {
      await initializeDatabase();
    }

    await db.runAsync("DELETE FROM favorite_movies WHERE movie_id = ?", [
      movieId,
    ]);

    console.log("✅ Filme removido dos favoritos:", movieId);
    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao remover favorito:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca todos os filmes favoritos
 * @returns {Promise<Array>}
 */
export const getAllFavorites = async () => {
  try {
    // Web: usa AsyncStorage
    if (Platform.OS === "web") {
      const data = await AsyncStorage.getItem("favorite_movies");
      return data ? JSON.parse(data) : [];
    }

    // Mobile: usa SQLite
    if (!db) {
      await initializeDatabase();
    }

    const result = await db.getAllAsync(
      "SELECT * FROM favorite_movies ORDER BY created_at DESC",
    );

    return result || [];
  } catch (error) {
    console.error("❌ Erro ao buscar favoritos:", error);
    return [];
  }
};

/**
 * Verifica se um filme está nos favoritos
 * @param {number} movieId - ID do filme
 * @returns {Promise<boolean>}
 */
export const checkIsFavorite = async (movieId) => {
  try {
    // Web: usa AsyncStorage
    if (Platform.OS === "web") {
      const favorites = await getAllFavorites();
      return favorites.some((fav) => fav.movie_id === movieId);
    }

    // Mobile: usa SQLite
    if (!db) {
      await initializeDatabase();
    }

    const result = await db.getFirstAsync(
      "SELECT * FROM favorite_movies WHERE movie_id = ?",
      [movieId],
    );

    return !!result;
  } catch (error) {
    console.error("❌ Erro ao verificar favorito:", error);
    return false;
  }
};

/**
 * Limpa todos os favoritos (útil para testes)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const clearAllFavorites = async () => {
  try {
    // Web: usa AsyncStorage
    if (Platform.OS === "web") {
      await AsyncStorage.setItem("favorite_movies", JSON.stringify([]));
      console.log("✅ Todos os favoritos foram removidos");
      return { success: true };
    }

    // Mobile: usa SQLite
    if (!db) {
      await initializeDatabase();
    }

    await db.runAsync("DELETE FROM favorite_movies");
    console.log("✅ Todos os favoritos foram removidos");
    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao limpar favoritos:", error);
    return { success: false, error: error.message };
  }
};
