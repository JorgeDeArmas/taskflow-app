import { BorderRadius, Colors, GlassEffect, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity,
  borderRadius = BorderRadius.medium,
  noPadding = false,
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const glassSettings = isDark ? GlassEffect.dark : GlassEffect.light;
  const blurIntensity = intensity ?? glassSettings.intensity;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderWidth: 1,
          borderColor: isDark
            ? Colors.dark.glassBorder
            : Colors.light.glassBorder,
          overflow: "hidden",
        },
        Shadow.medium,
        style,
      ]}
    >
      <BlurView
        intensity={blurIntensity}
        tint={glassSettings.tint}
        style={[
          styles.blurView,
          {
            backgroundColor: isDark
              ? Colors.dark.glassLight
              : Colors.light.glassLight,
          },
          !noPadding && styles.padding,
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  blurView: {
    flex: 1,
  },
  padding: {
    padding: 16,
  },
});
