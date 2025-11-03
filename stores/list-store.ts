import { supabase } from "@/lib/supabase";
import type { List, ListInsert, ListUpdate } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./auth-store";

interface ListState {
  lists: List[];
  isLoading: boolean;

  // Actions
  fetchLists: () => Promise<void>;
  addList: (list: Omit<ListInsert, "user_id">) => Promise<List | null>;
  updateList: (id: string, updates: ListUpdate) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  reorderLists: (lists: List[]) => Promise<void>;
  subscribeToLists: () => () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: [],
      isLoading: false,

      fetchLists: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          set({ isLoading: true });

          const { data, error } = await supabase
            .from("lists")
            .select("*")
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true });

          if (error) throw error;

          set({ lists: data || [], isLoading: false });
        } catch (error) {
          console.error("Fetch lists error:", error);
          set({ isLoading: false });
        }
      },

      addList: async (listData) => {
        const user = useAuthStore.getState().user;
        if (!user) return null;

        try {
          const maxSortOrder = Math.max(
            ...get().lists.map((l) => l.sort_order),
            0
          );

          const { data, error } = await supabase
            .from("lists")
            .insert({
              ...listData,
              user_id: user.id,
              sort_order: maxSortOrder + 1,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({ lists: [...state.lists, data] }));
          return data;
        } catch (error) {
          console.error("Add list error:", error);
          return null;
        }
      },

      updateList: async (id, updates) => {
        try {
          const { error } = await supabase
            .from("lists")
            .update(updates)
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            lists: state.lists.map((list) =>
              list.id === id ? { ...list, ...updates } : list
            ),
          }));
        } catch (error) {
          console.error("Update list error:", error);
        }
      },

      deleteList: async (id) => {
        try {
          // Note: Tasks in this list will have their list_id set to NULL (ON DELETE SET NULL)
          const { error } = await supabase.from("lists").delete().eq("id", id);

          if (error) throw error;

          set((state) => ({
            lists: state.lists.filter((list) => list.id !== id),
          }));
        } catch (error) {
          console.error("Delete list error:", error);
        }
      },

      reorderLists: async (reorderedLists) => {
        try {
          // Update sort_order for all lists
          const updates = reorderedLists.map((list, index) => ({
            id: list.id,
            sort_order: index,
          }));

          const { error } = await supabase.from("lists").upsert(updates);

          if (error) throw error;

          set({ lists: reorderedLists });
        } catch (error) {
          console.error("Reorder lists error:", error);
        }
      },

      subscribeToLists: () => {
        const user = useAuthStore.getState().user;
        if (!user) return () => {};

        const channel = supabase
          .channel("lists-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "lists",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const { eventType, new: newRecord, old: oldRecord } = payload;

              set((state) => {
                let newLists = [...state.lists];

                switch (eventType) {
                  case "INSERT":
                    if (!newLists.find((l) => l.id === newRecord.id)) {
                      newLists.push(newRecord as List);
                    }
                    break;
                  case "UPDATE":
                    newLists = newLists.map((list) =>
                      list.id === newRecord.id ? (newRecord as List) : list
                    );
                    break;
                  case "DELETE":
                    newLists = newLists.filter(
                      (list) => list.id !== oldRecord.id
                    );
                    break;
                }

                return { lists: newLists };
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
      name: "list-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lists: state.lists,
      }),
    }
  )
);
