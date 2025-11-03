import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/auth-store";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { session, initialize, isLoading } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Initialize auth on app start
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Wait for auth to initialize before navigating
    if (isLoading) return;

    // Mark navigation as ready after first render
    if (!isNavigationReady) {
      setIsNavigationReady(true);
      return;
    }

    const inAuthGroup = segments[0] === "auth";

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/auth/login");
    } else if (session && inAuthGroup) {
      // Redirect to tabs if already authenticated
      router.replace("/(tabs)");
    }
  }, [session, segments, isLoading, isNavigationReady]);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
