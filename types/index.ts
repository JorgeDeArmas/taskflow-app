import { Database } from "@/lib/supabase";

// Database table types
export type List = Database["public"]["Tables"]["lists"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];

// Insert types
export type ListInsert = Database["public"]["Tables"]["lists"]["Insert"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type UserSettingsInsert =
  Database["public"]["Tables"]["user_settings"]["Insert"];

// Update types
export type ListUpdate = Database["public"]["Tables"]["lists"]["Update"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type UserSettingsUpdate =
  Database["public"]["Tables"]["user_settings"]["Update"];

// Recurrence types
export type RecurrenceRule = "daily" | "weekly" | "monthly" | "custom";

export interface RecurrenceOptions {
  rule: RecurrenceRule;
  interval: number;
  endDate?: Date | null;
}

// Sort options
export type SortField = "due_date" | "created_at" | "priority" | "alphabetical";
export type SortDirection = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

// Filter options
export interface FilterOptions {
  listId?: string | null;
  isFlagged?: boolean;
  isCompleted?: boolean;
  hasNotes?: boolean;
  hasDueDate?: boolean;
}

// Task with list info
export interface TaskWithList extends Task {
  list?: List | null;
}

// Notification types
export interface TaskNotification {
  taskId: string;
  title: string;
  body: string;
  data: {
    taskId: string;
    listId?: string;
  };
  trigger: {
    date: Date;
  };
}

// Theme types
export type Theme = "light" | "dark" | "auto";

// Navigation types
export type RootStackParamList = {
  "(tabs)": undefined;
  "task-detail": { taskId: string };
  "list-detail": { listId: string };
  settings: undefined;
  "auth/login": undefined;
  "auth/signup": undefined;
};

// Store action types
export interface StoreActions<T> {
  set: (items: T[]) => void;
  add: (item: T) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  clear: () => void;
}
