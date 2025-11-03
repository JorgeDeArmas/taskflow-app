import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
          });

          return { error: null };
        } catch (error) {
          console.error("Sign in error:", error);
          return { error: error as Error };
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          console.log("Sign up response:", {
            hasUser: !!data.user,
            hasSession: !!data.session,
            userId: data.user?.id,
            emailConfirmed: data.user?.email_confirmed_at,
          });

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: !!data.session,
          });

          return { error: null };
        } catch (error) {
          console.error("Sign up error:", error);
          return { error: error as Error };
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Sign out error:", error);
        }
      },

      signInWithApple: async () => {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: {
              redirectTo: "taskflow://auth/callback",
            },
          });

          if (error) throw error;

          return { error: null };
        } catch (error) {
          console.error("Apple sign in error:", error);
          return { error: error as Error };
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setSession: (session) => set({ session, isAuthenticated: !!session }),

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get initial session
          const {
            data: { session },
          } = await supabase.auth.getSession();

          set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session,
            isLoading: false,
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session,
            });
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
