/**
 * TaskFlow Theme - iOS-inspired with glassmorphism
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    // iOS System Colors
    primary: "#007AFF",
    secondary: "#5856D6",
    accent: "#FF9500",
    background: "#F2F2F7",
    surface: "#FFFFFF",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    textPrimary: "#000000",
    textSecondary: "#3C3C43",

    // Glass/Glassmorphism
    glassLight: "rgba(255, 255, 255, 0.7)",
    glassMedium: "rgba(255, 255, 255, 0.5)",
    glassDark: "rgba(0, 0, 0, 0.3)",
    glassBorder: "rgba(255, 255, 255, 0.18)",

    // Tab bar
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#007AFF",

    // Legacy for compatibility
    text: "#000000",
    tint: "#007AFF",
    icon: "#8E8E93",
  },
  dark: {
    // iOS System Colors (Dark)
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    accent: "#FF9F0A",
    background: "#000000",
    surface: "#1C1C1E",
    error: "#FF453A",
    success: "#32D74B",
    warning: "#FF9F0A",
    textPrimary: "#FFFFFF",
    textSecondary: "#EBEBF5",

    // Glass/Glassmorphism (Dark)
    glassLight: "rgba(0, 0, 0, 0.7)",
    glassMedium: "rgba(0, 0, 0, 0.5)",
    glassDark: "rgba(255, 255, 255, 0.3)",
    glassBorder: "rgba(255, 255, 255, 0.12)",

    // Tab bar
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#0A84FF",

    // Legacy for compatibility
    text: "#FFFFFF",
    tint: "#0A84FF",
    icon: "#8E8E93",
  },
};

// Typography Scale (SF Pro - iOS System Font)
export const Typography = {
  largeTitle: { fontSize: 34, fontWeight: "700" as const, lineHeight: 41 },
  title1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  title2: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28 },
  title3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 24 },
  headline: { fontSize: 17, fontWeight: "600" as const, lineHeight: 22 },
  body: { fontSize: 17, fontWeight: "400" as const, lineHeight: 22 },
  callout: { fontSize: 16, fontWeight: "400" as const, lineHeight: 21 },
  subheadline: { fontSize: 15, fontWeight: "400" as const, lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  caption1: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  caption2: { fontSize: 11, fontWeight: "400" as const, lineHeight: 13 },
};

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

// Glass Effect Settings
export const GlassEffect = {
  light: {
    intensity: 50,
    tint: "light" as const,
    opacity: 0.85,
  },
  dark: {
    intensity: 90,
    tint: "dark" as const,
    opacity: 0.85,
  },
};

// Shadow Styles
export const Shadow = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
