import {
  BorderRadius,
  Colors,
  GlassEffect,
  Typography,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function GlassInput({
  icon,
  style,
  containerStyle,
  ...props
}: GlassInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const glassSettings = isDark ? GlassEffect.dark : GlassEffect.light;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: BorderRadius.small,
          borderWidth: 1,
          borderColor: isDark
            ? Colors.dark.glassBorder
            : Colors.light.glassBorder,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      <BlurView
        intensity={glassSettings.intensity}
        tint={glassSettings.tint}
        style={[
          styles.blurView,
          {
            backgroundColor: isDark
              ? Colors.dark.glassLight
              : Colors.light.glassLight,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          {...props}
          style={[
            styles.input,
            {
              color: isDark
                ? Colors.dark.textPrimary
                : Colors.light.textPrimary,
            },
          ]}
          placeholderTextColor={
            isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
          }
        />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  blurView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...Typography.body,
  },
});
