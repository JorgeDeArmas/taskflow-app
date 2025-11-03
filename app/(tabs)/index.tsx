import { GlassCard } from "@/components/glass/glass-card";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/auth-store";
import { useTaskStore } from "@/stores/task-store";
import type { Task } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TaskItem = React.memo(
  ({
    task,
    onToggleComplete,
    onPress,
  }: {
    task: Task;
    onToggleComplete: () => void;
    onPress: () => void;
  }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const getDueDateText = () => {
      if (!task.due_date) return null;
      const date = new Date(task.due_date);

      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      return format(date, "MMM d");
    };

    const isOverdue =
      task.due_date && isPast(new Date(task.due_date)) && !task.is_completed;

    return (
      <View style={styles.taskItemContainer}>
        <GlassCard style={styles.taskCard} noPadding>
          <View style={styles.taskContent}>
            <TouchableOpacity
              onPress={onToggleComplete}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[
                styles.checkbox,
                {
                  borderColor: task.is_flagged
                    ? isDark
                      ? Colors.dark.accent
                      : Colors.light.accent
                    : isDark
                    ? Colors.dark.glassBorder
                    : Colors.light.glassBorder,
                  backgroundColor: task.is_completed
                    ? isDark
                      ? Colors.dark.primary
                      : Colors.light.primary
                    : "transparent",
                },
              ]}
            >
              {task.is_completed && (
                <Ionicons name="checkmark" size={16} color="#FFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.taskInfo}
              onPress={onPress}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.taskTitle,
                  {
                    color: isDark
                      ? Colors.dark.textPrimary
                      : Colors.light.textPrimary,
                    textDecorationLine: task.is_completed
                      ? "line-through"
                      : "none",
                    opacity: task.is_completed ? 0.5 : 1,
                  },
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>

              {(task.due_date || task.notes) && (
                <View style={styles.taskMeta}>
                  {task.due_date && (
                    <Text
                      style={[
                        styles.dueDate,
                        {
                          color: isOverdue
                            ? isDark
                              ? Colors.dark.error
                              : Colors.light.error
                            : isDark
                            ? Colors.dark.textSecondary
                            : Colors.light.textSecondary,
                        },
                      ]}
                    >
                      {getDueDateText()}
                    </Text>
                  )}
                  {task.notes && (
                    <Ionicons
                      name="document-text-outline"
                      size={14}
                      color={
                        isDark
                          ? Colors.dark.textSecondary
                          : Colors.light.textSecondary
                      }
                    />
                  )}
                </View>
              )}
            </TouchableOpacity>

            {task.is_flagged && (
              <Ionicons
                name="flag"
                size={20}
                color={isDark ? Colors.dark.accent : Colors.light.accent}
              />
            )}
          </View>
        </GlassCard>
      </View>
    );
  }
);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    tasks,
    fetchTasks,
    toggleComplete,
    subscribeToTasks,
    sortOptions,
    filterOptions,
    setFilterOptions,
  } = useTaskStore();

  const [refreshing, setRefreshing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (user && !hasInitialized) {
      console.log("Initializing tasks - fetching and subscribing");
      fetchTasks();
      setHasInitialized(true);
      const unsubscribe = subscribeToTasks();
      return () => {
        console.log("Cleaning up subscription");
        unsubscribe();
      };
    }
  }, [user, hasInitialized, fetchTasks, subscribeToTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleToggleComplete = React.useCallback(
    (taskId: string) => {
      // Don't await - let optimistic update happen immediately
      toggleComplete(taskId);
    },
    [toggleComplete]
  );

  // Compute filtered tasks directly in component so it updates when tasks change
  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filterOptions.listId) {
      filtered = filtered.filter(
        (task) => task.list_id === filterOptions.listId
      );
    }
    if (filterOptions.isFlagged !== undefined) {
      filtered = filtered.filter(
        (task) => task.is_flagged === filterOptions.isFlagged
      );
    }
    if (filterOptions.isCompleted !== undefined) {
      filtered = filtered.filter(
        (task) => task.is_completed === filterOptions.isCompleted
      );
    }
    if (filterOptions.hasNotes) {
      filtered = filtered.filter((task) => task.notes && task.notes.length > 0);
    }
    if (filterOptions.hasDueDate) {
      filtered = filtered.filter((task) => task.due_date !== null);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.field) {
        case "due_date":
          const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "priority":
          comparison = (b.is_flagged ? 1 : 0) - (a.is_flagged ? 1 : 0);
          break;
        case "alphabetical":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOptions.direction === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, sortOptions, filterOptions]);

  const handleTaskPress = React.useCallback(
    (taskId: string) => {
      router.push(`/task-detail/${taskId}` as any);
    },
    [router]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onToggleComplete={() => handleToggleComplete(item.id)}
        onPress={() => handleTaskPress(item.id)}
      />
    ),
    [handleToggleComplete, handleTaskPress]
  );

  const keyExtractor = React.useCallback((item: Task) => item.id, []);

  if (!user) {
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
        <View style={styles.emptyState}>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: isDark
                  ? Colors.dark.textPrimary
                  : Colors.light.textPrimary,
              },
            ]}
          >
            Welcome to TaskFlow
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
              },
            ]}
          >
            Sign in to start managing your tasks
          </Text>
        </View>
      </View>
    );
  }

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
      <View style={styles.header}>
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
          My Tasks
        </Text>

        <TouchableOpacity
          onPress={() => {
            // Toggle showing completed tasks
            setFilterOptions({
              ...filterOptions,
              isCompleted:
                filterOptions.isCompleted === false ? undefined : false,
            });
          }}
          style={styles.toggleButton}
        >
          <Ionicons
            name={
              filterOptions.isCompleted === false
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={24}
            color={
              isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
            }
          />
          <Text
            style={[
              styles.toggleText,
              {
                color: isDark
                  ? Colors.dark.textSecondary
                  : Colors.light.textSecondary,
              },
            ]}
          >
            {filterOptions.isCompleted === false ? "Show" : "Hide"} Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={
                isDark ? Colors.dark.textSecondary : Colors.light.textSecondary
              }
            />
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: isDark
                    ? Colors.dark.textPrimary
                    : Colors.light.textPrimary,
                },
              ]}
            >
              No Tasks Yet
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: isDark
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
                },
              ]}
            >
              Tap the + button to create your first task
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: isDark
              ? Colors.dark.primary
              : Colors.light.primary,
          },
        ]}
        onPress={() => router.push("/modal")}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.largeTitle,
    marginBottom: Spacing.sm,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  toggleText: {
    ...Typography.body,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  taskItemContainer: {
    marginBottom: Spacing.md,
  },
  taskCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...Typography.body,
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  dueDate: {
    ...Typography.caption1,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
  },
  emptyTitle: {
    ...Typography.title1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
});
