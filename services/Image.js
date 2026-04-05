/**
 * Formata URI de imagem para uso no React Native Image
 * @param {string} imageString - String da imagem (URL, base64, etc)
 * @param {any} defaultImage - Imagem padrão local
 * @returns {object} - Objeto com uri ou require local
 */
export const formatImageUri = (imageString, defaultImage) => {
  // Se não tem imagem, retorna a padrão
  if (!imageString) {
    return defaultImage;
  }

  // URL HTTP/HTTPS - retorna como uri
  if (imageString.startsWith("http://") || imageString.startsWith("https://")) {
    return { uri: imageString };
  }

  // Já tem o prefixo data:image - retorna como uri
  if (imageString.startsWith("data:image/")) {
    return { uri: imageString };
  }

  // Base64 "cru" - adiciona o prefixo data:image
  // Assume PNG por padrão, pode ser alterado se necessário
  return { uri: `data:image/png;base64,${imageString}` };
};

/**
 * Trunca texto com reticências
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo (padrão: 15)
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 15) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Converte caminho relativo de poster do TMDB para URL completa
 * @param {string} posterPath - Caminho do poster (ex: "/abc123.jpg")
 * @param {string} size - Tamanho da imagem (w500, w780, original)
 * @returns {string|null} - URL completa ou null
 */
export const getTMDBImageUrl = (posterPath, size = "w500") => {
  if (!posterPath) return null;

  // Remove barras duplas se houver
  const cleanPath = posterPath.startsWith("/") ? posterPath : `/${posterPath}`;

  const baseUrl =
    process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  const fullUrl = `${baseUrl}/${size}${cleanPath}`;

  console.log("🖼️ URL da imagem:", fullUrl);

  return fullUrl;
};

/**
 * Valida se uma string é uma imagem base64 válida
 * @param {string} str - String a ser validada
 * @returns {boolean}
 */
export const isValidBase64Image = (str) => {
  if (!str) return false;

  // Verifica se tem o prefixo data:image
  if (str.startsWith("data:image/")) {
    return true;
  }

  // Verifica se é base64 válido (apenas caracteres base64)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Regex.test(str);
};
