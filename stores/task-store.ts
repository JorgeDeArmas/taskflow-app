import { supabase } from "@/lib/supabase";
import type {
  FilterOptions,
  SortOptions,
  Task,
  TaskInsert,
  TaskUpdate,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, addMonths, addWeeks } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./auth-store";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  sortOptions: SortOptions;
  filterOptions: FilterOptions;

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<TaskInsert, "user_id">) => Promise<Task | null>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  toggleFlag: (id: string) => Promise<void>;
  createRecurringTask: (task: Task) => Promise<void>;
  setSortOptions: (options: SortOptions) => void;
  setFilterOptions: (options: FilterOptions) => void;
  getFilteredTasks: () => Task[];
  subscribeToTasks: () => () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      sortOptions: { field: "due_date", direction: "asc" },
      filterOptions: { isCompleted: false }, // Hide completed tasks by default (iOS behavior)

      fetchTasks: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          console.log("fetchTasks called - fetching from database");
          set({ isLoading: true });

          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true });

          if (error) throw error;

          console.log(
            "fetchTasks completed - received",
            data?.length || 0,
            "tasks"
          );
          set({ tasks: data || [], isLoading: false });
        } catch (error) {
          console.error("Fetch tasks error:", error);
          set({ isLoading: false });
        }
      },

      addTask: async (taskData) => {
        const user = useAuthStore.getState().user;
        if (!user) return null;

        try {
          const { data, error } = await supabase
            .from("tasks")
            .insert({
              ...taskData,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          console.log(
            "Adding task to state:",
            data.id,
            "Current tasks count:",
            get().tasks.length
          );
          set((state) => {
            const newTasks = [...state.tasks, data];
            console.log("After add, tasks count:", newTasks.length);
            return { tasks: newTasks };
          });
          return data;
        } catch (error) {
          console.error("Add task error:", error);
          return null;
        }
      },

      updateTask: async (id, updates) => {
        try {
          const { error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          }));
        } catch (error) {
          console.error("Update task error:", error);
        }
      },

      deleteTask: async (id) => {
        try {
          const { error } = await supabase.from("tasks").delete().eq("id", id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        } catch (error) {
          console.error("Delete task error:", error);
        }
      },

      toggleComplete: async (id) => {
        try {
          const task = get().tasks.find((t) => t.id === id);
          if (!task) return;

          const isCompleted = !task.is_completed;
          const completed_at = isCompleted ? new Date().toISOString() : null;

          // Optimistic update - update UI immediately
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? { ...t, is_completed: isCompleted, completed_at }
                : t
            ),
          }));

          // Then update database
          const { error } = await supabase
            .from("tasks")
            .update({
              is_completed: isCompleted,
              completed_at,
            })
            .eq("id", id);

          if (error) {
            console.error("Database update error:", error);
            // Revert optimistic update on error
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      is_completed: task.is_completed,
                      completed_at: task.completed_at,
                    }
                  : t
              ),
            }));
            throw error;
          }

          // If task has recurrence_rule and is being completed, create next occurrence
          if (isCompleted && task.recurrence_rule) {
            await get().createRecurringTask(task);
          }
        } catch (error) {
          console.error("Toggle complete error:", error);
        }
      },

      toggleFlag: async (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        await get().updateTask(id, {
          is_flagged: !task.is_flagged,
        });
      },

      createRecurringTask: async (originalTask) => {
        if (!originalTask.due_date || !originalTask.recurrence_rule) return;

        const dueDate = new Date(originalTask.due_date);
        let nextDueDate: Date;

        switch (originalTask.recurrence_rule) {
          case "daily":
            nextDueDate = addDays(dueDate, originalTask.recurrence_interval);
            break;
          case "weekly":
            nextDueDate = addWeeks(dueDate, originalTask.recurrence_interval);
            break;
          case "monthly":
            nextDueDate = addMonths(dueDate, originalTask.recurrence_interval);
            break;
          default:
            return;
        }

        // Check if we should stop creating new occurrences
        if (originalTask.recurrence_end_date) {
          const endDate = new Date(originalTask.recurrence_end_date);
          if (nextDueDate > endDate) return;
        }

        await get().addTask({
          list_id: originalTask.list_id,
          title: originalTask.title,
          notes: originalTask.notes,
          due_date: nextDueDate.toISOString(),
          is_flagged: originalTask.is_flagged,
          is_recurring: true,
          recurrence_rule: originalTask.recurrence_rule,
          recurrence_interval: originalTask.recurrence_interval,
          recurrence_end_date: originalTask.recurrence_end_date,
          parent_task_id: originalTask.parent_task_id || originalTask.id,
        });
      },

      setSortOptions: (options) => set({ sortOptions: options }),

      setFilterOptions: (options) => set({ filterOptions: options }),

      getFilteredTasks: () => {
        const { tasks, sortOptions, filterOptions } = get();

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
          filtered = filtered.filter(
            (task) => task.notes && task.notes.length > 0
          );
        }
        if (filterOptions.hasDueDate) {
          filtered = filtered.filter((task) => task.due_date !== null);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortOptions.field) {
            case "due_date":
              const dateA = a.due_date
                ? new Date(a.due_date).getTime()
                : Infinity;
              const dateB = b.due_date
                ? new Date(b.due_date).getTime()
                : Infinity;
              comparison = dateA - dateB;
              break;
            case "created_at":
              comparison =
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime();
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
      },

      subscribeToTasks: () => {
        const user = useAuthStore.getState().user;
        if (!user) return () => {};

        const channel = supabase
          .channel("tasks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tasks",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const { eventType, new: newRecord, old: oldRecord } = payload;

              set((state) => {
                let newTasks = [...state.tasks];

                switch (eventType) {
                  case "INSERT":
                    if (!newTasks.find((t) => t.id === newRecord.id)) {
                      console.log(
                        "Real-time INSERT: Adding task",
                        newRecord.id,
                        "Current count:",
                        newTasks.length
                      );
                      newTasks.push(newRecord as Task);
                      console.log("After INSERT, count:", newTasks.length);
                    } else {
                      console.log(
                        "Real-time INSERT: Task already exists",
                        newRecord.id
                      );
                    }
                    break;
                  case "UPDATE":
                    newTasks = newTasks.map((task) =>
                      task.id === newRecord.id ? (newRecord as Task) : task
                    );
                    break;
                  case "DELETE":
                    newTasks = newTasks.filter(
                      (task) => task.id !== oldRecord.id
                    );
                    break;
                }

                return { tasks: newTasks };
              });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist settings, NOT tasks (tasks come from database)
      partialize: (state) => ({
        sortOptions: state.sortOptions,
        filterOptions: state.filterOptions,
      }),
    }
  )
);
