import { RestaurantService } from "@/domain/service/RestaurantService";
import { RestaurantItem } from "@/types/restaurant";
import { create } from "zustand";

interface RestaurantState {
  restaurants: Record<number, RestaurantItem>;
  loading: boolean;
  error: string | null;

  fetchRestaurant: (id: number) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: {},
  loading: false,
  error: null,

  fetchRestaurant: async (id: number) => {
    const { restaurants } = get();
    if (restaurants[id]) return;

    try {
      set({ loading: true, error: null });
      const restaurant = await RestaurantService.getRestaurantById(id);
      set((state) => ({
        restaurants: { ...state.restaurants, [id]: restaurant },
      }));
    } catch (err: any) {
      set({ error: err.message || "Không thể tải dữ liệu" });
    } finally {
      set({ loading: false });
    }
  },
}));
