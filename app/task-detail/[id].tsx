import { Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTaskStore } from "@/stores/task-store";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TaskDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask } = useTaskStore();

  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title || "");
  const [notes, setNotes] = useState(task?.notes || "");
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.due_date ? new Date(task.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFlagged, setIsFlagged] = useState(task?.is_flagged || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || "");
      setDueDate(task.due_date ? new Date(task.due_date) : null);
      setIsFlagged(task.is_flagged);
    }
  }, [task]);

  if (!task) {
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
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text
            style={[
              styles.errorText,
              {
                color: isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
              },
            ]}
          >
            Task not found
          </Text>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    setIsSubmitting(true);
    await updateTask(id!, {
      title: title.trim(),
      notes: notes.trim() || null,
      due_date: dueDate?.toISOString() || null,
      is_flagged: isFlagged,
    });
    setIsSubmitting(false);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(id!);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={isDark ? Colors.dark.primary : Colors.light.primary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              color: isDark
                ? Colors.dark.textPrimary
                : Colors.light.textPrimary,
            },
          ]}
        >
          Edit Task
        </Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting || !title.trim()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={[
              styles.headerButtonText,
              {
                color:
                  isSubmitting || !title.trim()
                    ? isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                    : isDark
                    ? Colors.dark.primary
                    : Colors.light.primary,
              },
            ]}
          >
            {isSubmitting ? "Saving..." : "Done"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark
                ? "rgba(28, 28, 30, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <View style={styles.inputRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={
                isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
              }
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Task title"
              value={title}
              onChangeText={setTitle}
              style={[
                styles.titleInput,
                {
                  color: isDark
                    ? Colors.dark.textPrimary
                    : Colors.light.textPrimary,
                },
              ]}
              placeholderTextColor={
                isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
              }
              autoFocus
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          />

          <View style={styles.inputRow}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={
                isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
              }
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={[
                styles.notesInput,
                {
                  color: isDark
                    ? Colors.dark.textPrimary
                    : Colors.light.textPrimary,
                },
              ]}
              placeholderTextColor={
                isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
              }
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Due Date and Flag Buttons */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.optionButton,
              {
                backgroundColor: isDark
                  ? "rgba(28, 28, 30, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={
                dueDate
                  ? isDark
                    ? Colors.dark.primary
                    : Colors.light.primary
                  : isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary
              }
            />
            <Text
              style={[
                styles.optionButtonText,
                {
                  color: dueDate
                    ? isDark
                      ? Colors.dark.primary
                      : Colors.light.primary
                    : isDark
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
                },
              ]}
            >
              {dueDate ? format(dueDate, "MMM d, yyyy") : "Add due date"}
            </Text>
            {dueDate && (
              <TouchableOpacity
                onPress={() => setDueDate(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={
                    isDark
                      ? Colors.dark.textSecondary
                      : Colors.light.textSecondary
                  }
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsFlagged(!isFlagged)}
            style={[
              styles.optionButton,
              {
                backgroundColor: isDark
                  ? "rgba(28, 28, 30, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          >
            <Ionicons
              name={isFlagged ? "flag" : "flag-outline"}
              size={20}
              color={
                isFlagged
                  ? isDark
                    ? Colors.dark.accent
                    : Colors.light.accent
                  : isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary
              }
            />
            <Text
              style={[
                styles.optionButtonText,
                {
                  color: isFlagged
                    ? isDark
                      ? Colors.dark.accent
                      : Colors.light.accent
                    : isDark
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
                },
              ]}
            >
              {isFlagged ? "Flagged" : "Add flag"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            styles.deleteButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 59, 48, 0.1)"
                : "rgba(255, 59, 48, 0.1)",
              borderColor: isDark ? Colors.dark.error : Colors.light.error,
            },
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={isDark ? Colors.dark.error : Colors.light.error}
          />
          <Text
            style={[
              styles.deleteButtonText,
              {
                color: isDark ? Colors.dark.error : Colors.light.error,
              },
            ]}
          >
            Delete Task
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerButton: {
    minWidth: 80,
  },
  headerButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  headerTitle: {
    ...Typography.headline,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...Typography.body,
  },
  inputContainer: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  titleInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 17,
    paddingVertical: 8,
  },
  notesInput: {
    flex: 1,
    ...Typography.body,
    minHeight: 100,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
    marginLeft: 40,
  },
  optionsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  optionButtonText: {
    ...Typography.body,
    flex: 1,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  deleteButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
