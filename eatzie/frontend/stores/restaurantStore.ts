import { RestaurantService } from "@/domain/service/RestaurantService";
import { mapRestaurantItemToCard } from "@/infrastructure/mappers/restaurant.mapper";
import { RestaurantItem, RestaurantModel } from "@/types/restaurant";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface RestaurantState {
  restaurants: Record<number, RestaurantItem>;
  loading: boolean;
  error: string | null;

  fetchRestaurant: (id: number) => Promise<void>;
  createRestaurant: (data: RestaurantModel) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>()(
  subscribeWithSelector((set, get) => ({
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
        set({ error: err.message || "Không thể tải dữ liệu nhà hàng" });
      } finally {
        set({ loading: false });
      }
    },

    createRestaurant: async (data: RestaurantModel) => {
      try {
        set({ loading: true, error: null });
        const response = await RestaurantService.createRestaurant(data);

        if (response.data) {
          const restaurant = mapRestaurantItemToCard(response.data);
          set((state) => ({
            restaurants: {
              ...state.restaurants,
              [restaurant.id]: restaurant,
            },
          }));
        }
      } catch (err: any) {
        set({ error: err.message || "Không thể tạo nhà hàng mới" });
      } finally {
        set({ loading: false });
      }
    },
  }))
);
