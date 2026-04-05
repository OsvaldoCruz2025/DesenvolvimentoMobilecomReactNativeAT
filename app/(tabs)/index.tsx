// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/ThemeContext";
import { useMovies } from "../../hooks/useMovies";
import { useFavorites } from "../../hooks/useFavorites";
import { MovieCard } from "../../components/MovieCard";
import { LoadingScreen } from "../../components/LoadingScreen";
import { EmptyState } from "../../components/EmptyState";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const router = useRouter();
  const {
    movies,
    loading,
    refreshing,
    onRefresh,
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchTopRatedMovies,
  } = useMovies();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [favoriteStates, setFavoriteStates] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("popular");

  const numColumns =
    width >= 1400
      ? 6
      : width >= 1100
        ? 5
        : width >= 900
          ? 4
          : width >= 680
            ? 3
            : 2;
  const cardWidth = Math.max(
    130,
    Math.floor((width - 16 - numColumns * 16) / numColumns),
  );

  const categories = [
    {
      id: "popular",
      label: "Populares",
      icon: "flame",
      fetch: fetchPopularMovies,
    },
    {
      id: "now_playing",
      label: "Em Cartaz",
      icon: "ticket",
      fetch: fetchNowPlayingMovies,
    },
    {
      id: "top_rated",
      label: "Melhores",
      icon: "star",
      fetch: fetchTopRatedMovies,
    },
  ];

  // Carrega estados de favoritos quando os filmes mudam
  useEffect(() => {
    loadFavoriteStates();
  }, [movies]);

  const loadFavoriteStates = async () => {
    const states = {};
    for (const movie of movies) {
      states[movie.id] = await isFavorite(movie.id);
    }
    setFavoriteStates(states);
  };

  /**
   * Altera a categoria de filmes
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category.id);
    category.fetch(1);
  };

  /**
   * Manipula favoritar/desfavoritar
   */
  const handleFavoritePress = async (movie) => {
    try {
      const newState = await toggleFavorite(movie);
      setFavoriteStates((prev) => ({
        ...prev,
        [movie.id]: newState,
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível favoritar o filme");
      console.error(error);
    }
  };

  /**
   * Navega para os detalhes do filme
   */
  const handleMoviePress = (movie) => {
    router.push({
      pathname: "/details",
      params: { movieId: movie.id },
    });
  };

  if (loading && movies.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.surface },
              selectedCategory === category.id && {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={() => handleCategoryChange(category)}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? "#FFF" : theme.text}
            />
            <Text
              style={[
                styles.categoryLabel,
                {
                  color: selectedCategory === category.id ? "#FFF" : theme.text,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Filmes */}
      {movies.length === 0 ? (
        <EmptyState
          icon="film-outline"
          title="Nenhum filme encontrado"
          description="Não foi possível carregar os filmes"
          actionLabel="Tentar Novamente"
          onActionPress={onRefresh}
        />
      ) : (
        <FlatList
          key={`home-cols-${numColumns}`}
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              cardWidth={cardWidth}
              onPress={() => handleMoviePress(item)}
              onFavoritePress={() => handleFavoritePress(item)}
              isFavorite={favoriteStates[item.id] || false}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 8,
  },
});
