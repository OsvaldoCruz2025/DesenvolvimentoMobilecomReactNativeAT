import {
  initializeDatabase,
  addFavorite,
  removeFavorite,
  getAllFavorites,
  checkIsFavorite,
  clearAllFavorites,
} from "./SQLite";

/**
 * Alias solicitado no enunciado (initializeDb)
 */
export const initializeDb = initializeDatabase;

export {
  addFavorite,
  removeFavorite,
  getAllFavorites,
  checkIsFavorite,
  clearAllFavorites,
};
