// stores/foodStore.ts
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";
import { create } from "zustand";

interface FoodState {
  foods: Record<number, FoodItemD>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;

  fetchFood: (id: number) => Promise<void>;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: {},
  loading: {},
  error: {},

  fetchFood: async (id: number) => {
    const { foods, loading } = get();

    if (foods[id] || loading[id]) return;

    try {
      set((state) => ({
        loading: { ...state.loading, [id]: true },
        error: { ...state.error, [id]: null },
      }));

      const food = await SearchService.getFoodId(id);

      set((state) => ({
        foods: { ...state.foods, [id]: food },
      }));
    } catch (err: any) {
      set((state) => ({
        error: { ...state.error, [id]: err.message || "Không thể tải dữ liệu" },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, [id]: false },
      }));
    }
  },
}));
