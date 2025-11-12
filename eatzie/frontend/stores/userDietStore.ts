import { create } from "zustand";
import { UserDiet } from "@/types/userDiet.types";

interface UserDietState {
  userDiet: UserDiet | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUserDiet: (userDiet: UserDiet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserDiet: (updates: Partial<UserDiet>) => void;
  clearUserDiet: () => void;
}

export const useUserDietStore = create<UserDietState>((set) => ({
  userDiet: null,
  isLoading: false,
  error: null,
  
  setUserDiet: (userDiet) => set({ userDiet, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  updateUserDiet: (updates) => 
    set((state) => ({
      userDiet: state.userDiet ? { ...state.userDiet, ...updates } : null
    })),
    
  clearUserDiet: () => set({ userDiet: null, error: null })
}));
