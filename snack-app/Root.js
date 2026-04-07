import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const TMDB_API_KEY = "c5ca28b28c796819ba9a5dcf7999298f";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const STORAGE_KEYS = {
  SESSION: "snack_session",
  FAVORITES: "snack_favorites",
  THEME: "snack_theme",
};

const THEMES = {
  dark: {
    background: "#111111",
    surface: "#1d1d1d",
    card: "#202020",
    text: "#ffffff",
    textSecondary: "#a1a1a1",
    border: "#2b2b2b",
    primary: "#e50914",
    tab: "#000000",
  },
  light: {
    background: "#f5f5f5",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#111111",
    textSecondary: "#666666",
    border: "#dddddd",
    primary: "#e50914",
    tab: "#ffffff",
  },
};

const categories = [
  {
    id: "popular",
    label: "Populares",
    icon: "flame",
    endpoint: "/movie/popular",
  },
  {
    id: "now_playing",
    label: "Em cartaz",
    icon: "ticket",
    endpoint: "/movie/now_playing",
  },
  {
    id: "top_rated",
    label: "Melhores",
    icon: "star",
    endpoint: "/movie/top_rated",
  },
];

const tabs = [
  { id: "movies", label: "Filmes", icon: "film" },
  { id: "favorites", label: "Favoritos", icon: "heart" },
  { id: "settings", label: "Ajustes", icon: "settings" },
];

function getImageUrl(path) {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

function MovieItem({
  movie,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  theme,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={() => onOpenDetails(movie)}
      activeOpacity={0.85}
    >
      <View style={styles.posterBox}>
        {getImageUrl(movie.poster_path) ? (
          <Image
            source={{ uri: getImageUrl(movie.poster_path) }}
            style={styles.poster}
          />
        ) : (
          <View
            style={[styles.posterFallback, { backgroundColor: theme.surface }]}
          >
            <Ionicons
              name="film-outline"
              size={38}
              color={theme.textSecondary}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(movie)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? theme.primary : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "Sem data"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Root() {
  const [themeMode, setThemeMode] = useState("dark");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("osvaldo.cruz@al.infnet.edu.br");
  const [password, setPassword] = useState("123456");
  const [activeTab, setActiveTab] = useState("movies");
  const [activeCategory, setActiveCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const theme = THEMES[themeMode];
  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites],
  );

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadMovies(activeCategory);
    }
  }, [isAuthenticated, activeCategory]);

  async function bootstrap() {
    try {
      const [session, storedFavorites, storedTheme] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSION),
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      if (session) setIsAuthenticated(true);
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedTheme && THEMES[storedTheme]) setThemeMode(storedTheme);
    } finally {
      setLoading(false);
    }
  }

  async function loadMovies(categoryId) {
    const category =
      categories.find((item) => item.id === categoryId) || categories[0];
    setLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}${category.endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`,
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.log(error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email.trim() || password.trim().length < 6) return;
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ email }));
    setIsAuthenticated(true);
  }

  async function handleLogout() {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    setIsAuthenticated(false);
    setActiveTab("movies");
  }

  async function handleToggleFavorite(movie) {
    const exists = favorites.some((item) => item.id === movie.id);
    const nextFavorites = exists
      ? favorites.filter((item) => item.id !== movie.id)
      : [movie, ...favorites];
    setFavorites(nextFavorites);
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(nextFavorites),
    );
  }

  async function handleThemeChange(mode) {
    setThemeMode(mode);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
  }

  if (loading && !isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.background }]}
      >
        <StatusBar
          barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
        />
        <View style={styles.authWrap}>
          <View
            style={[
              styles.authCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View
              style={[styles.logoCircle, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="film" size={34} color="#fff" />
            </View>
            <Text style={[styles.authTitle, { color: theme.text }]}>
              Catálogo de Filmes
            </Text>
            <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
              Versão para Expo Snack
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                },
              ]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                },
              ]}
            />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const listData = activeTab === "favorites" ? favorites : movies;

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
      />
      <View
        style={[
          styles.header,
          { backgroundColor: theme.tab, borderBottomColor: theme.border },
        ]}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? theme.primary : theme.textSecondary}
            />
            <Text
              style={{
                color:
                  activeTab === tab.id ? theme.primary : theme.textSecondary,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "movies" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    activeCategory === category.id
                      ? theme.primary
                      : theme.surface,
                },
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={activeCategory === category.id ? "#fff" : theme.text}
              />
              <Text
                style={{
                  color: activeCategory === category.id ? "#fff" : theme.text,
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {activeTab === "settings" ? (
        <View style={styles.settingsWrap}>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tema
            </Text>
            <TouchableOpacity
              style={[styles.settingOption, { borderColor: theme.border }]}
              onPress={() => handleThemeChange("dark")}
            >
              <Text style={{ color: theme.text }}>Escuro</Text>
              {themeMode === "dark" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingOption, { borderColor: theme.border }]}
              onPress={() => handleThemeChange("light")}
            >
              <Text style={{ color: theme.text }}>Claro</Text>
              {themeMode === "light" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: theme.primary }]}
              onPress={handleLogout}
            >
              <Text style={styles.primaryButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centeredEmpty}>
              <Ionicons
                name="film-outline"
                size={52}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Nenhum filme encontrado
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textSecondary }]}
              >
                Adicione favoritos ou recarregue o catálogo.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              isFavorite={favoriteIds.has(item.id)}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetails={setSelectedMovie}
              theme={theme}
            />
          )}
        />
      )}

      <Modal visible={!!selectedMovie} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedMovie(null)}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            {selectedMovie && (
              <>
                {getImageUrl(
                  selectedMovie.backdrop_path || selectedMovie.poster_path,
                ) ? (
                  <Image
                    source={{
                      uri: getImageUrl(
                        selectedMovie.backdrop_path ||
                          selectedMovie.poster_path,
                      ),
                    }}
                    style={styles.modalImage}
                  />
                ) : null}
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {selectedMovie.title}
                </Text>
                <Text
                  style={[styles.modalText, { color: theme.textSecondary }]}
                >
                  Nota: {selectedMovie.vote_average?.toFixed?.(1) || "N/A"}
                </Text>
                <Text
                  style={[styles.modalText, { color: theme.textSecondary }]}
                >
                  {selectedMovie.overview || "Sem sinopse disponível."}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  authWrap: { flex: 1, justifyContent: "center", padding: 20 },
  authCard: { borderWidth: 1, borderRadius: 20, padding: 20 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  authTitle: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  authSubtitle: { fontSize: 14, textAlign: "center", marginBottom: 18 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tabButton: { alignItems: "center", gap: 4 },
  categoryRow: { padding: 12, gap: 10 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  listContent: { padding: 8 },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    maxWidth: "46%",
  },
  posterBox: { height: 220, position: "relative" },
  poster: { width: "100%", height: "100%" },
  posterFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: 12 },
  cardTitle: { fontWeight: "700", fontSize: 14, marginBottom: 4 },
  cardMeta: { fontSize: 12 },
  centeredEmpty: { paddingTop: 80, alignItems: "center" },
  emptyTitle: { fontSize: 22, fontWeight: "700", marginTop: 16 },
  emptySubtitle: { fontSize: 14, marginTop: 8 },
  settingsWrap: { flex: 1, padding: 16 },
  settingsCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "65%",
  },
  modalClose: { alignSelf: "flex-end", marginBottom: 12 },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalTitle: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  modalText: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
});
