import { RestaurantFoodService } from "@/domain/service/FoodsByRestaurant";
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface FoodState {
  foods: Record<number, FoodItemD>;
  foodsByRestaurant: Record<number, FoodItemD[]>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
  lastAddedFoodId: number | null;

  fetchFood: (id: number) => Promise<void>;
  fetchFoodByRestaurant: (restaurantId: number) => Promise<void>;
  triggerFly: (foodId: number) => void;
}

export const useFoodStore = create<FoodState>()(
  subscribeWithSelector((set, get) => ({
    foods: {},
    foodsByRestaurant: {},
    loading: {},
    error: {},
    lastAddedFoodId: null,

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
          error: {
            ...state.error,
            [id]: err.message || "Không thể tải dữ liệu",
          },
        }));
      } finally {
        set((state) => ({
          loading: { ...state.loading, [id]: false },
        }));
      }
    },

    fetchFoodByRestaurant: async (restaurantId: number) => {
      const { foodsByRestaurant, loading } = get();
      if (foodsByRestaurant[restaurantId] || loading[restaurantId]) return;

      try {
        set((state) => ({
          loading: { ...state.loading, [restaurantId]: true },
          error: { ...state.error, [restaurantId]: null },
        }));

        const foodList = await RestaurantFoodService.getFoodsByRestaurantId(
          restaurantId
        );
        const newFoods: Record<number, FoodItemD> = {};
        foodList.forEach((f) => (newFoods[f.id] = f));

        set((state) => ({
          foods: { ...state.foods, ...newFoods },
          foodsByRestaurant: {
            ...state.foodsByRestaurant,
            [restaurantId]: foodList,
          },
        }));
      } catch (err: any) {
        set((state) => ({
          error: {
            ...state.error,
            [restaurantId]: err.message || "Không thể tải dữ liệu",
          },
        }));
      } finally {
        set((state) => ({
          loading: { ...state.loading, [restaurantId]: false },
        }));
      }
    },

    triggerFly: (foodId) => set({ lastAddedFoodId: foodId }),
  }))
);
