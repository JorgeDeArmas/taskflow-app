import {
  BorderRadius,
  Colors,
  GlassEffect,
  Shadow,
  Typography,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function GlassButton({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
}: GlassButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const glassSettings = isDark ? GlassEffect.dark : GlassEffect.light;

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.small,
      borderWidth: 1,
      overflow: "hidden",
      opacity: disabled ? 0.5 : 1,
    };

    const sizeStyles = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
    };
  };

  const getTextStyle = (): TextStyle => {
    const color = isDark ? Colors.dark.textPrimary : Colors.light.textPrimary;

    return {
      ...Typography.body,
      fontWeight: "600",
      color,
      textAlign: "center",
    };
  };

  const getBorderColor = () => {
    if (variant === "primary") {
      return isDark ? Colors.dark.primary : Colors.light.primary;
    }
    return isDark ? Colors.dark.glassBorder : Colors.light.glassBorder;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        getButtonStyle(),
        { borderColor: getBorderColor() },
        Shadow.small,
        style,
      ]}
      activeOpacity={0.7}
    >
      <BlurView
        intensity={glassSettings.intensity}
        tint={glassSettings.tint}
        style={[
          styles.blurView,
          {
            backgroundColor:
              variant === "primary"
                ? isDark
                  ? `${Colors.dark.primary}40`
                  : `${Colors.light.primary}40`
                : isDark
                ? Colors.dark.glassLight
                : Colors.light.glassLight,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={isDark ? Colors.dark.textPrimary : Colors.light.textPrimary}
          />
        ) : (
          <>
            {icon}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          </>
        )}
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  blurView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
