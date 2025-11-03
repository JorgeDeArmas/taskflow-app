import { Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuthStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
    } else {
      // Check if user has a session (auto-confirmed) or needs email confirmation
      const { session } = useAuthStore.getState();

      if (session) {
        // User is auto-confirmed and logged in
        Alert.alert("Success!", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      } else {
        // User needs to confirm email
        Alert.alert(
          "Check Your Email",
          "We've sent you a confirmation email. Please check your inbox and click the link to verify your account, then come back and sign in.",
          [{ text: "OK", onPress: () => router.replace("/auth/login") }]
        );
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  color: isDark
                    ? Colors.dark.textPrimary
                    : Colors.light.textPrimary,
                },
              ]}
            >
              Create Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: isDark
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
                },
              ]}
            >
              Join TaskFlow to start organizing your tasks
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark
                  ? "rgba(28, 28, 30, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          >
            <View style={styles.form}>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? "rgba(58, 58, 60, 0.8)"
                      : "rgba(242, 242, 247, 0.8)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={[
                    styles.textInput,
                    {
                      color: isDark
                        ? Colors.dark.textPrimary
                        : Colors.light.textPrimary,
                    },
                  ]}
                  placeholderTextColor={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? "rgba(58, 58, 60, 0.8)"
                      : "rgba(242, 242, 247, 0.8)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="newPassword"
                  style={[
                    styles.textInput,
                    {
                      color: isDark
                        ? Colors.dark.textPrimary
                        : Colors.light.textPrimary,
                    },
                  ]}
                  placeholderTextColor={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark
                      ? "rgba(58, 58, 60, 0.8)"
                      : "rgba(242, 242, 247, 0.8)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="newPassword"
                  style={[
                    styles.textInput,
                    {
                      color: isDark
                        ? Colors.dark.textPrimary
                        : Colors.light.textPrimary,
                    },
                  ]}
                  placeholderTextColor={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                />
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isLoading}
                style={[
                  styles.signUpButton,
                  {
                    backgroundColor: isDark
                      ? Colors.dark.primary
                      : Colors.light.primary,
                    opacity: isLoading ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.signInLink}
          >
            <Text
              style={[
                styles.signInText,
                {
                  color: isDark
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
                },
              ]}
            >
              Already have an account?{" "}
              <Text
                style={{
                  color: isDark ? Colors.dark.primary : Colors.light.primary,
                  fontWeight: "600",
                }}
              >
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  title: {
    ...Typography.largeTitle,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
  },
  card: {
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  signInLink: {
    alignItems: "center",
    padding: Spacing.md,
  },
  signInText: {
    ...Typography.body,
  },
});
