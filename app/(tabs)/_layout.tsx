// @ts-nocheck
import { withLayoutContext } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/ThemeContext";

const { Navigator } = createMaterialTopTabNavigator();

const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowIcon: true,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          flexDirection: "row",
          gap: 6,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.primary,
          height: 3,
        },
      }}
    >
      <TopTabs.Screen
        name="index"
        options={{
          title: "Filmes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="film" size={16} color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={16} color={color} />
          ),
        }}
      />
      <TopTabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={16} color={color} />
          ),
        }}
      />
    </TopTabs>
  );
}
