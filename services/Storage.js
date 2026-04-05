import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Salva dados no AsyncStorage
 * @param {string} key - Chave
 * @param {any} value - Valor (será convertido para JSON)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return { success: true };
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca dados do AsyncStorage
 * @param {string} key - Chave
 * @returns {Promise<any|null>}
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Erro ao ler ${key}:`, error);
    return null;
  }
};

/**
 * Remove dados do AsyncStorage
 * @param {string} key - Chave
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error(`Erro ao remover ${key}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Limpa todos os dados do AsyncStorage
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return { success: true };
  } catch (error) {
    console.error("Erro ao limpar AsyncStorage:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtém todas as chaves armazenadas
 * @returns {Promise<Array<string>>}
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error("Erro ao buscar chaves:", error);
    return [];
  }
};
