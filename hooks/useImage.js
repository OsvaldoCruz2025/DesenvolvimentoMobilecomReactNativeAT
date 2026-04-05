import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Hook customizado para gerenciar câmera e galeria
 */
export const useImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Solicita permissão para câmera ou galeria
   * @param {string} type - 'camera' ou 'gallery'
   * @returns {Promise<boolean>}
   */
  const requestPermission = async (type) => {
    try {
      const permission =
        type === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão Necessária",
          `Precisamos de acesso ${type === "camera" ? "à câmera" : "à galeria de fotos"} para continuar.`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Configurações",
              onPress: () => console.log("Abrir configurações"),
            },
          ],
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      return false;
    }
  };

  /**
   * Abre a câmera para tirar uma foto
   * @returns {Promise<string|null>} - Base64 da imagem ou null
   */
  const takePhoto = async () => {
    const hasPermission = await requestPermission("camera");
    if (!hasPermission) return null;

    try {
      setLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Image = result.assets[0].base64;
        setImage(base64Image);
        console.log("✅ Foto capturada com sucesso");
        return base64Image;
      }

      return null;
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      Alert.alert("Erro", "Não foi possível acessar a câmera");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre a galeria para escolher uma foto
   * @returns {Promise<string|null>} - Base64 da imagem ou null
   */
  const pickFromGallery = async () => {
    const hasPermission = await requestPermission("gallery");
    if (!hasPermission) return null;

    try {
      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Image = result.assets[0].base64;
        setImage(base64Image);
        console.log("✅ Imagem selecionada com sucesso");
        return base64Image;
      }

      return null;
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível acessar a galeria de fotos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpa a imagem atual
   */
  const clearImage = () => {
    setImage(null);
  };

  return {
    image,
    setImage,
    takePhoto,
    pickFromGallery,
    clearImage,
    loading,
  };
};
