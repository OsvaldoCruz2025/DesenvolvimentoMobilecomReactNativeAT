import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";
import { useMovies } from "../hooks/useMovies";
import { useFavorites } from "../hooks/useFavorites";
import { getTMDBImageUrl } from "../services/Image";
import { getRatingColor, lightTheme } from "../services/Themes";

type ThemeColors = typeof lightTheme;

type MovieGenre = {
  id: number;
  name: string;
};

type MovieDetails = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  runtime?: number;
  genres?: MovieGenre[];
  overview?: string;
  status?: string;
  original_language?: string;
  budget: number;
  revenue: number;
};

export default function DetailsScreen() {
  const { movieId } = useLocalSearchParams<{ movieId?: string | string[] }>();
  const { theme } = useTheme() as { theme: ThemeColors };
  const router = useRouter();
  const { fetchMovieDetails } = useMovies();
  const { isFavorite, toggleFavorite } = useFavorites();
  const movieIdValue = Array.isArray(movieId) ? movieId[0] : movieId;
  const movieIdNumber = Number(movieIdValue);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteState, setFavoriteState] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  /**
   * Carrega os detalhes do filme
   */
  const loadMovieDetails = async () => {
    try {
      if (!movieIdValue || Number.isNaN(movieIdNumber)) {
        throw new Error("ID do filme inválido");
      }

      setLoading(true);
      const data = (await fetchMovieDetails(
        movieIdNumber,
      )) as MovieDetails | null;
      setMovie(data);

      // Verifica se está nos favoritos
      const isFav = await isFavorite(movieIdNumber);
      setFavoriteState(isFav);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do filme");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle favorito
   */
  const handleFavoriteToggle = async () => {
    if (!movie) return;

    try {
      const newState = await toggleFavorite(movie);
      setFavoriteState(newState);

      Alert.alert(
        "Sucesso",
        newState
          ? "Filme adicionado aos favoritos!"
          : "Filme removido dos favoritos",
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os favoritos");
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: theme.background }]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={theme.textSecondary}
        />
        <Text style={[styles.errorText, { color: theme.text }]}>
          Filme não encontrado
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = getTMDBImageUrl(movie.backdrop_path ?? "", "w780");
  const posterUrl = getTMDBImageUrl(movie.poster_path ?? "", "w500");
  const ratingColor = getRatingColor(movie.vote_average, theme);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Backdrop */}
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />

          {/* Botão Voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Botão Favoritar */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Ionicons
              name={favoriteState ? "heart" : "heart-outline"}
              size={28}
              color={favoriteState ? theme.primary : "#FFF"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Poster e Info Principal */}
        <View style={styles.mainInfo}>
          {posterUrl && (
            <Image source={{ uri: posterUrl }} style={styles.poster} />
          )}

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              {movie.title}
            </Text>

            {/* Metadados */}
            <View style={styles.metadata}>
              {/* Ano */}
              <View style={styles.metadataItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text
                  style={[styles.metadataText, { color: theme.textSecondary }]}
                >
                  {releaseYear}
                </Text>
              </View>

              {/* Duração */}
              {movie.runtime && (
                <View style={styles.metadataItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.metadataText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {movie.runtime} min
                  </Text>
                </View>
              )}

              {/* Rating */}
              <View
                style={[styles.ratingBadge, { backgroundColor: ratingColor }]}
              >
                <Ionicons name="star" size={14} color="#FFF" />
                <Text style={styles.ratingText}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Gêneros */}
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genres}>
                {movie.genres.slice(0, 3).map((genre) => (
                  <View
                    key={genre.id}
                    style={[
                      styles.genreTag,
                      { backgroundColor: theme.surface },
                    ]}
                  >
                    <Text style={[styles.genreText, { color: theme.text }]}>
                      {genre.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Sinopse */}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Sinopse
            </Text>
            <Text style={[styles.overview, { color: theme.textSecondary }]}>
              {movie.overview}
            </Text>
          </View>
        )}

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informações
          </Text>

          {movie.status && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Status:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {movie.status}
              </Text>
            </View>
          )}

          {movie.original_language && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Idioma Original:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {movie.original_language.toUpperCase()}
              </Text>
            </View>
          )}

          {movie.budget > 0 && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Orçamento:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                ${movie.budget.toLocaleString()}
              </Text>
            </View>
          )}

          {movie.revenue > 0 && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Receita:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                ${movie.revenue.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  backdropContainer: {
    height: 250,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  mainInfo: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    width: 130,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
