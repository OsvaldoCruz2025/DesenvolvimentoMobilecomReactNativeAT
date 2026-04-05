// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../providers/ThemeContext";
import { useFavorites } from "../../hooks/useFavorites";
import { MovieCard } from "../../components/MovieCard";
import { LoadingScreen } from "../../components/LoadingScreen";
import { EmptyState } from "../../components/EmptyState";

export default function FavoritesScreen() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const router = useRouter();
  const {
    favorites,
    loading,
    refreshing,
    onRefresh,
    removeFromFavorites,
    reloadFavorites,
  } = useFavorites();

  const [favoriteStates, setFavoriteStates] = useState({});

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

  // Atualiza os estados quando os favoritos mudam
  useEffect(() => {
    const states = {};
    favorites.forEach((movie) => {
      states[movie.movie_id] = true;
    });
    setFavoriteStates(states);
  }, [favorites]);

  /**
   * Remove filme dos favoritos
   */
  const handleFavoritePress = async (movie) => {
    Alert.alert(
      "Remover Favorito",
      `Deseja remover "${movie.title}" dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const success = await removeFromFavorites(movie.movie_id);
            if (success) {
              setFavoriteStates((prev) => ({
                ...prev,
                [movie.movie_id]: false,
              }));
            } else {
              Alert.alert("Erro", "Não foi possível remover o favorito");
            }
          },
        },
      ],
    );
  };

  /**
   * Navega para os detalhes do filme
   */
  const handleMoviePress = (movie) => {
    router.push({
      pathname: "/details",
      params: { movieId: movie.movie_id },
    });
  };

  /**
   * Converte dados SQLite para formato esperado pelo MovieCard
   */
  const convertToMovieFormat = (favorite) => ({
    id: favorite.movie_id,
    title: favorite.title,
    poster_path: favorite.poster_url,
    overview: favorite.overview,
    release_date: favorite.release_date,
    vote_average: favorite.vote_average,
    backdrop_path: favorite.backdrop_path,
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState
          icon="heart-outline"
          title="Nenhum favorito ainda"
          description="Adicione filmes aos favoritos para vê-los aqui mesmo offline"
          actionLabel="Explorar Filmes"
          onActionPress={() => router.push("/")}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Meus Favoritos
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {favorites.length} {favorites.length === 1 ? "filme" : "filmes"}
        </Text>
      </View>

      {/* Lista de Favoritos */}
      <FlatList
        key={`fav-cols-${numColumns}`}
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MovieCard
            movie={convertToMovieFormat(item)}
            cardWidth={cardWidth}
            onPress={() => handleMoviePress(item)}
            onFavoritePress={() => handleFavoritePress(item)}
            isFavorite={true}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 8,
  },
});
