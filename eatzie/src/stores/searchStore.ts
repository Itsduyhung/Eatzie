import {
  FoodSuggestion,
  suggestionFoodData,
} from "@/app/constant/suggestionFoodData";
import { create } from "zustand";

export interface SearchState {
  text: string;
  history: string[];
  trending: string[];
  suggestions: FoodSuggestion[];
  loadingSuggestions: boolean;

  setText: (val: string) => void;
  addHistory: (val: string) => void;
  clearHistory: () => void;

  setTrending: (list: string[]) => void;

  fetchSuggestions: (query: string) => void;
  clearSuggestions: () => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  text: "",
  history: [],
  trending: [],
  suggestions: [],
  loadingSuggestions: false,

  setText: (val) => set({ text: val }),

  addHistory: (val) =>
    set((state) => {
      if (!val) return state;
      const newHistory = state.history.filter((h) => h !== val);
      return { history: [val, ...newHistory] };
    }),

  clearHistory: () => set({ history: [] }),

  setTrending: (list) => set({ trending: list }),

  fetchSuggestions: (query) => {
    if (!query) {
      set({ suggestions: [] });
      return;
    }
    set({ loadingSuggestions: true });

    const result = suggestionFoodData.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    set({ suggestions: result, loadingSuggestions: false });
  },

  clearSuggestions: () => set({ suggestions: [] }),

  reset: () => set({ text: "", suggestions: [], loadingSuggestions: false }),
}));
