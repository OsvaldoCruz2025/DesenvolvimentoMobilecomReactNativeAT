import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";
import { getTMDBImageUrl } from "../services/Image";
import { getRatingColor } from "../services/Themes";

/**
 * Componente de card de filme
 */
export const MovieCard = ({
  movie,
  onPress,
  onFavoritePress,
  isFavorite = false,
  cardWidth,
}) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = React.useState(false);

  const posterUrl = getTMDBImageUrl(movie.poster_path || movie.poster_url);
  const ratingColor = getRatingColor(movie.vote_average, theme);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card },
        cardWidth ? { width: cardWidth } : null,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Poster */}
      <View style={styles.posterContainer}>
        {posterUrl && !imageError ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
            onError={() => {
              console.log("❌ Erro ao carregar imagem:", posterUrl);
              setImageError(true);
            }}
          />
        ) : (
          <View
            style={[
              styles.posterPlaceholder,
              { backgroundColor: theme.surface },
            ]}
          >
            <Ionicons
              name="film-outline"
              size={40}
              color={theme.textSecondary}
            />
          </View>
        )}

        {/* Botão de favorito */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? theme.primary : "#FFF"}
          />
        </TouchableOpacity>

        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
            <Ionicons name="star" size={12} color="#FFF" />
            <Text style={styles.ratingText}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {movie.title}
        </Text>

        {movie.release_date && (
          <Text style={[styles.year, { color: theme.textSecondary }]}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  posterContainer: {
    width: "100%",
    height: 225,
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
  },
});
