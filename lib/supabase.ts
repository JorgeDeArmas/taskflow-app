import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import "react-native-url-polyfill/auto";

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          list_id: string | null;
          title: string;
          notes: string | null;
          due_date: string | null;
          is_completed: boolean;
          completed_at: string | null;
          is_flagged: boolean;
          is_recurring: boolean;
          recurrence_rule: string | null;
          recurrence_interval: number;
          recurrence_end_date: string | null;
          parent_task_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          list_id?: string | null;
          title: string;
          notes?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          is_flagged?: boolean;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          recurrence_interval?: number;
          recurrence_end_date?: string | null;
          parent_task_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          list_id?: string | null;
          title?: string;
          notes?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          is_flagged?: boolean;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          recurrence_interval?: number;
          recurrence_end_date?: string | null;
          parent_task_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          notifications_enabled: boolean;
          notification_sound: string;
          theme: string;
          default_list_id: string | null;
          show_completed_tasks: boolean;
          default_sort: string;
          default_sort_direction: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notifications_enabled?: boolean;
          notification_sound?: string;
          theme?: string;
          default_list_id?: string | null;
          show_completed_tasks?: boolean;
          default_sort?: string;
          default_sort_direction?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notifications_enabled?: boolean;
          notification_sound?: string;
          theme?: string;
          default_list_id?: string | null;
          show_completed_tasks?: boolean;
          default_sort?: string;
          default_sort_direction?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
